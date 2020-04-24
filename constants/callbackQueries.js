const Product = require("../models/product");
const Port = require("../models/port");
const Ship = require("../models/ship");
const LowestHighest = require("../models/mini-games/lowestHighest/lowestHighest");
const mixology = require("../mini-game/mixology");
const keyboards = require("./keyboards");
const globalFunctions = require("./globalFunctions");
const log = globalFunctions.log;
const b = require("../bots/telegram").boozecruiseBot;
const KORONA = "\u24C0";
const MYSHIP = "5be3d50298ae6843394411ee";

const lowestHighest = require("../mini-game/lowestHighest");
const slots = require("../mini-game/slots");

const moment = require("moment");
const _ = require("underscore");

module.exports = (callback_query, ship, data) => {
  const player = ship.user.first_name;
  if (data.action === "navigate") {
    if (ship.id != MYSHIP) {
      Port.findOne({
        id: data.port,
      }).then(function (port) {
        var arrival = new Date();
        arrival = arrival.setTime(
          arrival.getTime() + globalFunctions.calculateDistance(port.location, ship.location) * 60 * 60 * 1000
        );
        ship.nextLocation = {
          arrival: arrival,
          port: data.port,
          portName: port.name,
        };
        if (ship.portHistory.length > 0) {
          ship.portHistory[ship.portHistory.length - 1].departureDate = new Date();
        }
        b.kick(ship.location.port, ship.id, 1);
        b.sendMessage(ship.location.port, `${ship.user.first_name} just left port and is heading to ${port.name}`);
        ship.location.port = undefined;
        ship.save();
        console.log(data);
        b.sendMessage(
          ship.id,
          "Your ship is now en route to " + port.name + "\nyou will arrive in " + globalFunctions.calculateTime(arrival)
        );
        b.sendKeyboard(ship.id, "🌊🛳🌊", keyboards.home(ship.nextLocation.port));
      });
    }
  } else if (data.action === "navigate_sector") {
    Port.find({
      "location.sector": data.sector,
    }).then(function (ports) {
      globalFunctions.sendAvailablePorts(callback_query.from.id, ports, ship);
    });
    // Start Product list
  } else if (data.action === "product") {
    Product.findOne({ _id: data.product }).then((product) => {
      b.sendPhoto(
        callback_query.from.id,
        product.image,
        product.name + "\n" + product.type + "\n" + product.description
      );
      setTimeout(function () {
        b.sendKeyboard(
          callback_query.from.id,
          "Price: " +
            KORONA +
            product.price +
            "\nQuantity Available: " +
            product.quantity +
            "\nExpiry: " +
            product.expiry,
          keyboards.product(product)
        );
      }, 1500);
    });
    // End Product list

    // Start Mini-game Lowest-Highest
  } else if (data.action.indexOf("LH_") === 0) {
    LowestHighest.findOne({ inProgress: true, _id: data.action.split("_")[1] }).then(function (game) {
      if (game) {
        console.log(game);
        console.log(_.find(game.players, (player) => player.id == callback_query.from.id));

        if (_.find(game.players, (player) => player.id == callback_query.from.id)) {
          b.sendMessage(
            callback_query.from.id,
            "You have already picked a number for this game, currently waiting for an opponent"
          );
        } else {
          game.players.push({
            id: callback_query.from.id,
            guess: data.num,
            name: callback_query.from.first_name,
          });
          if (game.players.length === 2) {
            let result = lowestHighest(game.houseGuess, game.players[0], game.players[1]);
            console.log(result);

            if (result.winner) {
              Ship.findOne({ id: result.winner }).then(function (winner) {
                winner.purse.balance += 10;

                if (result.jackpot) {
                  LowestHighest.find({ jackpotPaid: false }).then((games) => {
                    winner.purse.balance += 4 * games.length;
                    winner.save();
                    b.sendMessage(game.players[0].id, result.message);
                    b.sendMessage(game.players[1].id, result.message);
                    games.forEach((game) => {
                      game.jackpotPaid = true;
                      game.save();
                    });
                  });
                } else {
                  b.sendMessage(game.players[0].id, result.message);
                  b.sendMessage(game.players[1].id, result.message);
                  winner.save();
                }
              });
            } else {
              b.sendMessage(game.players[0].id, result.message);
              b.sendMessage(game.players[1].id, result.message);
            }
            game.inProgress = false;
          } else {
            b.sendMessage(callback_query.from.id, "You have selected " + data.num);
            broadcast(
              `<pre>Lowest-Highest</pre>\n\n${callback_query.from.first_name} just played Lowest-Highest and is waiting for an opponent.\n<b>Think you can beat ${callback_query.from.first_name}?</b>\nGo to the casino <i>(only avalible while sailing)</i> and pick a number that is higher ⬆️ then ${callback_query.from.first_name}'s, but lower ⬇️ than the house. Good Luck`
            );
          }
          game.save();
        }
      } else {
        b.sendMessage(callback_query.from.id, "This game is already finished. Stop picking numbers");
      }
    });
  } else if (data.action.indexOf("SL_") === 0) {
    console.log("CALLBACK QUERY =>", callback_query);

    //SLOTS GAME
    //data.num = bet
    Ship.findOne({ id: callback_query.from.id }).then(function (ship) {
      slots.get(ship, data.num, callback_query.message.message_id).then((prize) => {
        ship.purse.balance += prize;
        ship.save();
        log(player, `Just won ${KORONA}${prize} on the pokies`);
        b.sendMessage(ship.id, `You won ${KORONA}${prize}\nNew Balance: ${KORONA}${ship.purse.balance}`);
        b.sendKeyboard(ship.id, "Play again?", keyboards.slots("", "SL"));
        b.sendKeyboard(ship.id, `<pre>Stats?</pre>`, {
          inline_keyboard: [
            [
              {
                text: "Stats for nerds",
                callback_data: JSON.stringify({ action: `slotStats` }),
              },
            ],
          ],
        });
      });
    });
  } else if (data.action === "buy") {
    Product.findOne({ _id: data.id }).then((product) => {
      ship.products.push({
        product: product._id,
        expiry: moment().add(product.expiry, "days"),
      });
      log(player, `Just spent some ${KORONA} in the shop.`);
      ship.save();
      product.quantity--;
      product.save();
    });
    // } else if (something) {
  } else if (data.action === "treasure") {
    globalFunctions.lookForTreasure(ship);
  } else if (data.action === "slotStats") {
    console.log("In the SlotStats");
    b.sendMessage(ship.id, slots.stats());
  } else if (data.action === "mixology") {
    Port.findOne({
      id: data.port,
    }).then(function (port) {
      console.log("port => ", port);
      mixology.getCocktail().then((cocktail) => b.sendMessage(ship.id, cocktail));
      console.log("Do some mixology stuff");
    });
  }
  function broadcast(message) {
    Ship.find({}).then((ships) => {
      b.broadcast(
        ships.map(({ id }) => {
          return id;
        }),
        message
      );
    });
  }
};
