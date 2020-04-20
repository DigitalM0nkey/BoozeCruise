const b = require("../bots/telegram").boozecruiseBot;

const symbols = ["🍒", "🛳", "🏝", "🌊", "☀️"];
let rolls = [
  { symbol: "🍒", count: 0 },
  { symbol: "🛳", count: 0 },
  { symbol: "🏝", count: 0 },
  { symbol: "🌊", count: 0 },
  { symbol: "☀️", count: 0 },
];
let plays = 0;

module.exports = (ship, bet) => {
  return new Promise(function (resolve, reject) {
    bet = parseInt(bet, 10);
    halfBet = Math.round(bet / 2);
    let odds = 0;
    if (bet <= 91) {
      odds = 3;
    } else if (bet <= 10) {
      odds = Math.ceil((bet - 1) / 10);
    } else {
      odds = 10;
    }

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
          b.sendMessage(
            ship.id,
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
      }, (odds - 1) * 1000);
    };

    const prizes = () => {
      i = 0;
      prize = house.reduce((prize, symbol) => prize + (symbol === "🍒" ? halfBet : 0), 0);
      let power = 1;
      while (house[i] === "🍒") {
        power += 0.1;
        i++;
      }
      prize = Math.ceil(Math.pow(prize, power));
      console.log(`Prize: ${prize}`);
      console.log(`Bet: ${bet}`);
      console.log(`Half Bet: ${halfBet}`);
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

    print();
  });
};
