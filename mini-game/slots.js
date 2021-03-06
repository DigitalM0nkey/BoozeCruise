const b = require("../bots/telegram").boozecruiseBot;
const globalFunctions = require("../constants/globalFunctions");
const log = globalFunctions.log;
const symbols = require("../constants/symbols");
const emoji = require("../constants/emoji");
const Ship = require("../models/ship");
const Slots = require("../models/mini-games/slots/slots");
const { Promise } = require("mongoose");

let plays = 0;
let amountOfTrifectors = 0;
let largestJackpot = {
  amount: 0,
  winningSymbols: [],
};
let amountBet = 0;
let amountWon = 0;
let highestPower = 0;

const getSlots = async (ship, bet, messageId) => {
  // console.log("Slots message ID -> ", messageId);
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
    // console.log("NOT ENOUGH KORONA");
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
    // console.log("ODDS =>", odds);

    const house = new Array(odds);
    for (let i = 0; i < odds; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      house[i] = symbol;
    }
    plays++;
    // console.log(`${plays} times played`);
    await print(ship, messageId, house, halfBet, bet, odds);
    let prize = prizes(house, halfBet, bet);
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
      jackpot = Math.ceil((globalJackpot[0].jackpot * (120 - bet)) / 100);
      prize += jackpot;
      b.editMessageText(
        ship.id,
        messageId,
        house.reduce(
          (msg, symbol, j) => msg + (j === house.length - 1 ? symbol : symbol + "|"),
          `Bet: ${emoji.korona}${bet}\nWon: ${emoji.korona}${prize}\n`
        )
      );
      slots.largestJackpot = Math.max(slots.largestJackpot, jackpot);
      const allSlots = await Slots.find();
      allSlots.forEach(function (slot) {
        var updated = Math.ceil((slot.globalJackpot * (120 - bet)) / 100);
        Slots.update({ _id: slot._id }, { $set: { globalJackpot: updated } });
      });
      // console.log("JACKPOT WON", jackpot);
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
  // console.log(`Prize: ${prize}`);
  // console.log(`Amount of trifectors: ${trifectorPrize}`);
  // console.log(`Bonus: ${bonus}`);
  // console.log(`Bet: ${bet}`);
  // console.log(`Power ${power}`);

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
  // console.log(currentValue);
  const equal = (value) => {
    // console.log(value === currentValue[0]);
    return value === currentValue[0];
  };
  if (currentValue.length > 2) {
    if (currentValue.every(equal)) {
      // console.log("Jackpot");
      return true;
    } else {
      return false;
    }
  }
};

const stats = async () => {
  const globalJackpot = await Slots.aggregate([
    {
      $group: {
        _id: "jackpot",
        jackpot: { $sum: "$globalJackpot" },
        largestJackpot: { $max: "$largestJackpot" },
      },
    },
  ]);
  const globalBets = await Slots.aggregate([
    {
      $unwind: "$bets",
    },
    {
      $group: {
        _id: "bets",
        amountBet: { $sum: "$bets.value" },
        amountWon: { $sum: "$bets.prize" },
        plays: { $sum: 1 },
      },
    },
  ]);
  const globalSymbols = await Slots.aggregate([
    {
      $unwind: "$bets",
    },
    {
      $unwind: "$bets.symbols",
    },
    {
      $group: {
        _id: "$bets.symbols",
        count: { $sum: 1 },
      },
    },
  ]);
  let message = `<pre>Slot Stats</pre>\n`;
  // console.log("globalSymbols", globalSymbols);
  message += `${globalSymbols.map((roll) => `\n${roll._id}: ${roll.count}`)}\n\n`;
  message += `${emoji.korona}${globalJackpot[0].largestJackpot} Largest jackpot.\n\n`;
  message += `${emoji.korona}${globalBets[0].amountBet} Total Bet.\n`;
  message += `${emoji.korona}${globalBets[0].amountWon} Total Won.\n`;
  message += `${emoji.korona}${globalBets[0].amountBet - globalBets[0].amountWon} House Balance.\n\n`;
  message += `${globalBets[0].plays} games played.\n\n`;
  message += `<pre>Current Jackpot: ${emoji.korona}${globalJackpot[0].jackpot}</pre>\n`;
  return message;
};

const instructions = `<pre>Slot Instructions</pre>\nAny 🍒 is equal to 50% of your bet. However, if a 🍒 is in the first position, your payout is increased by a power of 0.1, any 🍒's immediately following add an additional 0.1 to the power.\n\n☀️|☀️|☀️ - Three in a row of any symbol trigers a trifector bonus = bet * 1.5\n\nThe jackpot is won when all slots are the same regardless of how many slots you are playing\nie. 🛳|🛳|🛳\nor 🏝|🏝|🏝|🏝|🏝\nor 🌊|🌊|🌊|🌊|🌊|🌊|🌊|🌊|🌊|🌊\nHowever, the less you bet the more of the jackpot you stand to win. Betting Ⓚ20 wins 100% of the jackpot as it is the hardest to win. 
\n<b>Odds:</b>
\nⓀ20 wins 100% of the jackpot(1/60466176)
\nⓀ40 wins 80% of the jackpot(1/1679616)
\nⓀ60 wins 60% of the jackpot(1/466656)
\nⓀ80 wins 40% of the jackpot(1/1296)
\nⓀ100 wins 20% of the jackpot(1/36)
\n<b>Examples:</b>
\nBet 100:\n🍒|🏝|🍒\n= Ⓚ159
\nBet 80:\n🍒|🏝|🛳|☀️|🛳\n= Ⓚ58
\nBet 60:\n🌊|🏝|🏝|🍒|🌊|🏝|🍒\n= Ⓚ60
\nBet 40:\n🍒|🌊|🍒|🏝|☀️|🏝|🍒|🍒|🍒\n= Ⓚ219
\nBet 20:\n☀️|🛳|🛳|🛳|🌊|🏝|🏝|🍒|🌊|☀️\n= Ⓚ40
\nIn short: Less is more, more or less... The less you bet the more likley you will win, However, betting more increases your odds of hitting a jackpot. How much will you bet?`;

exports.instructions = instructions;
exports.stats = stats;
exports.get = getSlots;
