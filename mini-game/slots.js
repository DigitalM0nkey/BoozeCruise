const b = require("../bots/telegram").boozecruiseBot;
const globalFunctions = require("../constants/globalFunctions");
const log = globalFunctions.log;
const emoji = require("../constants/emoji");
const Ship = require("../models/ship");

const symbols = ["🍒", "🛳", "🏝", "🌊", "☀️", "⚓️"];
let rolls = [
  { symbol: "🍒", count: 0 },
  { symbol: "🛳", count: 0 },
  { symbol: "🏝", count: 0 },
  { symbol: "🌊", count: 0 },
  { symbol: "☀️", count: 0 },
  { symbol: "⚓️", count: 0 },
];
let plays = 0;
let amountOftrifectors = 0;
let largestJackpot = {
  amount: 0,
  winningSymbols: [],
};
let amountBet = 0;
let amountWon = 0;
let highestPower = 0;

const slots = (ship, bet, messageId) => {
  if (bet > ship.purse.balance) {
    b.sendMessage(
      ship.id,
      `You do not have enough Korona to play! Your current balance is: ${emoji.korona}${ship.purse.balance}`
    );
    console.log("NOT ENOUGH KORONA");
  } else {
    ship.purse.balance -= bet;
    ship.save();
    return new Promise(function (resolve, reject) {
      bet = parseInt(bet, 10);
      halfBet = Math.round(bet / 2);
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

      const print = () => {
        for (let i = 0; i < odds; i++) {
          setTimeout(function () {
            b.editMessageText(
              ship.id,
              messageId,
              house.reduce(
                (msg, symbol, j) =>
                  msg +
                  (i >= j ? (j === house.length - 1 ? symbol : symbol + "|") : j === house.length - 1 ? "❓" : "❓|"),
                `Won:${emoji.korona}${prizes(house.slice(0, i))}\n`
              )
            );
            // b.editMessageText(ship.id, messageId, `Balance: ${emoji.korona}${ship.purse.balance}`, "");
          }, 1000 * i);
        }
        setTimeout(() => {
          prizes(house);
        }, odds * 1000);
      };

      const prizes = slots => {
        let i = 0;
        let prize = slots.reduce((prize, symbol) => prize + (symbol === "🍒" ? halfBet : 0), 0);
        let power = 1;
        let jackpot = 0;
        let bonus = 0;

        console.log("JACKPOT ??? => ", checkJackpot(slots));

        if (checkJackpot(slots)) {
          jackpot = Math.pow(bet, 1 + odds / 5);
          if (largestJackpot.amount < jackpot) {
            largestJackpot.amount = jackpot;
            largestJackpot.winningSymbols = slots;
          }
        }
        const trifectorPrize = trifector(slots);
        if (trifectorPrize) {
          bonus = bet * 1.5 * trifectorPrize;
        }
        while (slots[i] === "🍒") {
          power += 0.1;
          i++;
        }

        prize = Math.ceil(Math.pow(prize, power) + jackpot + bonus);
        console.log(`Prize: ${prize}`);
        console.log(`Jackpot: ${jackpot}`);
        console.log(`Amount of trifectors: ${trifectorPrize}`);
        console.log(`Bonus: ${bonus}`);
        console.log(`Bet: ${bet}`);
        console.log(`Power ${power}`);

        if (power > highestPower) {
          highestPower = power;
        }

        amountBet += bet;
        amountWon += prize;
        amountOftrifectors += trifectorPrize;

        return prize;
        // if (slots[i] === "🍒") {
        //   document.getElementById("balance").innerHTML = balance + parseInt(bet, 10);
        // }
      };

      const trifector = (slots) => {
        let telly = 0;
        for (let i = 0; i < slots.length - 2; i++) {
          if (slots[i] === slots[i + 1] && slots[i] === slots[i + 2]) {
            telly++;
            i += 2;
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
        if (currentValue.every(equal)) {
          console.log("Jackpot");
          return true;
        } else {
          return false;
        }
      };

      print();
      console.log(reject);
    });
  }
};

const stats = () => {
  let message = `<pre>Slot Stats</pre>\n${rolls.map((roll) => `${roll.symbol}: ${roll.count}`)}\n${
    Math.ceil(largestJackpot.amount)
      ? `\n${emoji.korona}${Math.ceil(largestJackpot.amount)} Largest jackpot(${largestJackpot.winningSymbols}).`
      : ``
  }\n${emoji.korona}${amountBet} Amount bet.\n${emoji.korona}${amountWon} Amount Won.\n${emoji.korona}${
    amountBet - amountWon
  } House balance.\n\n${amountOftrifectors} Trifectors.\n${highestPower.toFixed(
    2
  )} Highest Power.\n${plays} games played.\n\n<i>Since server restart.</i>`;
  return message;
};

exports.stats = stats;
exports.get = slots;
