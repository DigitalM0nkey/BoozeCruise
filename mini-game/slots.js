const b = require("../bots/telegram").boozecruiseBot;
const globalFunctions = require("../constants/globalFunctions");
const log = globalFunctions.log;
const emoji = require("../constants/emoji");
const Ship = require("../models/ship");
const Slots = require("../models/mini-games/slots/slots");
const { Promise } = require("mongoose");

const symbols = ["🍒", "🛳", "🏝", "🌊", "☀️", "⚓️"];
let rolls = [
  {
    symbol: "🍒",
    count: 0,
  },
  {
    symbol: "🛳",
    count: 0,
  },
  {
    symbol: "🏝",
    count: 0,
  },
  {
    symbol: "🌊",
    count: 0,
  },
  {
    symbol: "☀️",
    count: 0,
  },
  {
    symbol: "⚓️",
    count: 0,
  },
];
let plays = 0;
let amountOfTrifectors = 0;
let largestJackpot = {
  amount: 0,
  winningSymbols: [],
};
let amountBet = 0;
let amountWon = 0;
let highestPower = 0;

const slots = async (ship, bet, messageId) => {
  console.log("Slots message ID -> ", messageId);
  let slots = await Slots.findOne({ id: ship.id });
  if (!slots) {
    slots = new Slots({ id: ship.id });
  }

  amountBet += bet;
  if (bet > ship.purse.balance) {
    b.sendMessage(
      ship.id,
      `You do not have enough Korona to play! Your current balance is: ${emoji.korona}${ship.purse.balance}`
    );
    console.log("NOT ENOUGH KORONA");
  } else {
    ship.purse.balance -= bet;
    ship.save();
    bet = parseInt(bet, 10);
    let halfBet = Math.round(bet / 2);
    let odds = 0;
    switch (bet) {
      case 10:
      case 20:
      case 30:
        odds = 10;
        break;
      case 40:
        odds = 9;
        break;
      case 50:
        odds = 8;
        break;
      case 60:
        odds = 7;
        break;
      case 70:
        odds = 6;
        break;
      case 80:
        odds = 5;
        break;
      case 90:
        odds = 4;
        break;
      case 100:
        odds = 3;
        break;
      default:
        odds = 10;
    }

    // if (bet >= 90) {
    //   odds = 3;
    // } else if (bet >= 30) {
    //   odds = Math.ceil((bet + 1) / 10);
    // } else {
    //   odds = 10;
    // }
    console.log("ODDS =>", odds);

    const house = new Array(odds);
    for (let i = 0; i < odds; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      house[i] = symbol;
      for (let roll of rolls) {
        if (roll.symbol === symbol) {
          roll.count++;
          break;
        }
      }
    }
    plays++;
    console.log(`${plays} times played`);
    console.log(rolls);
    await print(ship, messageId, house, halfBet, bet, odds);
    let prize = prizes(house, true, halfBet, bet);
    let jackpot = 0;
    if (checkJackpot(house)) {
      const globalJackpot = await Slots.aggregate([
        {
          $group: {
            _id: "jackpot",
            jackpot: { $sum: "$globalJackpot" },
          },
        },
      ]).exec();
      jackpot = globalJackpot.jackpot;
      slots.largestJackpot = Math.max(slots.largestJackpot, jackpot);
      prize += jackpot;
      await Slots.updateMany({}, { $set: { globalJackpot: 0 } }).exec();
    } else {
      jackpot = Math.floor(bet * 0.1);
      // jackpot = Math.pow(bet, 1 + odds / 5);
      slots.globalJackpot += jackpot;
    }

    slots.bets.push({ value: bet, prize: prize, symbols: house });
    slots.plays++;
    await slots.save();
    return prize;
  }
};

const print = (ship, messageId, house, halfBet, bet, odds) => {
  return new Promise((resolve) => {
    for (let i = 0; i < odds; i++) {
      setTimeout(function () {
        b.editMessageText(
          ship.id,
          messageId,
          house.reduce(
            (msg, symbol, j) =>
              msg + (i >= j ? (j === house.length - 1 ? symbol : symbol + "|") : j === house.length - 1 ? "❓" : "❓|"),
            `Bet: ${emoji.korona}${bet}\nWon: ${emoji.korona}${prizes(house.slice(0, i + 1), halfBet, bet)}\n`
          )
        );
      }, 1000 * i);
    }
    setTimeout(() => {
      resolve();
    }, odds * 1000);
  });
};

const prizes = (slots, halfBet, bet) => {
  if (slots.length === 0) return 0;
  let i = 0;
  let prize = slots.reduce((prize, symbol) => prize + (symbol === "🍒" ? halfBet : 0), 0);
  let power = 1;
  let bonus = 0;

  const trifectorPrize = trifector(slots);
  if (trifectorPrize) {
    bonus = bet * 1.5 * trifectorPrize;
  }
  while (slots[i] === "🍒") {
    power += 0.1;
    i++;
  }

  if (power > highestPower) {
    highestPower = power;
  }

  prize = Math.ceil(Math.pow(prize, power) + bonus);
  console.log(`Prize: ${prize}`);
  console.log(`Amount of trifectors: ${trifectorPrize}`);
  console.log(`Bonus: ${bonus}`);
  console.log(`Bet: ${bet}`);
  console.log(`Power ${power}`);

  return prize;
};

const trifector = (slots) => {
  if (slots.length < 3) return 0;
  let telly = 0;

  for (let i = 0; i < slots.length - 2; i++) {
    if (slots[i] === slots[i + 1] && slots[i] === slots[i + 2]) {
      telly++;
      //i += 2;
    }
  }

  return telly;
};
//const checkJackpot = slots => slots.every(symbol => symbol === slots[0]);

const checkJackpot = (currentValue) => {
  console.log(currentValue);
  const equal = (value) => {
    console.log(value === currentValue[0]);
    return value === currentValue[0];
  };
  if (currentValue.length > 2) {
    if (currentValue.every(equal)) {
      console.log("Jackpot");
      return true;
    } else {
      return false;
    }
  }
};

const stats = () => {
  let message = `<pre>Slot Stats</pre>\n${rolls.map((roll) => `${roll.symbol}: ${roll.count}`)}\n${
    Math.ceil(largestJackpot.amount)
      ? `\n${emoji.korona}${Math.ceil(largestJackpot.amount)} Largest jackpot(${largestJackpot.winningSymbols}).`
      : ``
  }\n${emoji.korona}${amountBet} Amount bet.\n${emoji.korona}${amountWon} Amount Won.\n${emoji.korona}${
    amountBet - amountWon
  } House balance.\n\n${amountOfTrifectors} Trifectors.\n${highestPower.toFixed(
    2
  )} Highest Power.\n${plays} games played.\n\n<i>Since server restart.</i>`;
  return message;
};

const instructions = `Any 🍒 is equal to 50% of your bet. However, if a 🍒 is in the first position, your payout is increased by a power of 0.1, any 🍒's immediately following add an additional 0.1 to the power.\n\n☀️|☀️|☀️ - Three in a row of any symbol trigers a trifector bonus = bet * 1.5\n\nThe jackpot is won when all slots are the same regardless of how many slots you are playing\nie. 🛳|🛳|🛳\nor 🏝|🏝|🏝|🏝|🏝\nor 🌊|🌊|🌊|🌊|🌊|🌊|🌊|🌊|🌊|🌊\nWinning the jackpot results in your bet to the power of the odds devided by 5.\nExamples:
\nBet 100:\n🍒|🏝|🍒\n= Ⓚ159
\nBet 80:\n🍒|🏝|🛳|☀️|🛳\n= Ⓚ58
\nBet 60:\n🌊|🏝|🏝|🍒|🌊|🏝|🍒\n= Ⓚ60
\nBet 40:\n🍒|🌊|🍒|🏝|☀️|🏝|🍒|🍒|🍒\n= Ⓚ219
\nBet 20:\n☀️|🛳|🛳|🛳|🌊|🏝|🏝|🍒|🌊|☀️\n= Ⓚ40
\n In short: Less is more, more or less... The less you bet the more likley you will win, However, betting more increases your odds of hitting a jackpot. How much will you bet?`;

exports.instructions = instructions;
exports.stats = stats;
exports.get = slots;
