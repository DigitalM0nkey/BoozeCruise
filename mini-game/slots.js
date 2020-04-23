const b = require("../bots/telegram").boozecruiseBot;
const globalFunctions = require("../constants/globalFunctions");
const log = globalFunctions.log;

const symbols = ["🍒", "🛳", "🏝", "🌊", "☀️"];
let rolls = [
  { symbol: "🍒", count: 0 },
  { symbol: "🛳", count: 0 },
  { symbol: "🏝", count: 0 },
  { symbol: "🌊", count: 0 },
  { symbol: "☀️", count: 0 },
];
let plays = 0;

module.exports = (ship, bet, messageId) => {
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
    log(
      `Casino`,
      `<pre>Slot Stats</pre>\n${rolls.map(
        (roll) => `${roll.symbol}-${roll.count}`
      )}\nfrom ${plays} games\nSince server restart.`
    );

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
              ""
            )
          );
        }, 1000 * i);
      }
      setTimeout(() => {
        prizes();
      }, odds * 1000);
    };

    const prizes = () => {
      let i = 0;
      let prize = house.reduce((prize, symbol) => prize + (symbol === "🍒" ? halfBet : 0), 0);
      let power = 1;
      let jackpot = 0;

      console.log("JACKPOT ??? => ", checkJackpot(house));

      if (checkJackpot(house)) {
        jackpot = Math.pow(bet, 1 + odds / 5);
      }
      while (house[i] === "🍒") {
        power += 0.1;
        i++;
      }
      prize = Math.ceil(Math.pow(prize, power) + jackpot);
      console.log(`Prize: ${prize}`);
      console.log(`Jackpot: ${jackpot}`);
      console.log(`Bet: ${bet}`);
      console.log(`Power ${power}`);

      resolve(prize);
      // if (house[i] === "🍒") {
      //   document.getElementById("balance").innerHTML = balance + parseInt(bet, 10);
      // }
    };

    const bonus = () => {
      if (house) {
        console.log("Hello");
      }
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
  });
};

const stats = () => {
  return `<pre>Slot Stats</pre>\n${rolls.map(
    (roll) => `${roll.symbol}-${roll.count}`
  )}\nfrom ${plays} games\nSince server restart.`;
};

exports.stats = stats;
