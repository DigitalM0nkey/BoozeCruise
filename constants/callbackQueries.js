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
const MIXOLOGYPORT = -1001216326021; //Caspian
const emoji = require("../constants/emoji");

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
      }).then(function(port) {
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
        log(player, `Set sail for ${port.name}`);
        ship.location.port = undefined;
        ship.save();
        //console.log(data);
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
    }).then(function(ports) {
      globalFunctions.sendAvailablePorts(callback_query.from.id, ports, ship);
    });
    // Start Product list
  } else if (data.action === "product") {
    Product.findOne({
      _id: data.product,
    }).then((product) => {
      b.sendPhoto(
        callback_query.from.id,
        product.image,
        product.name + "\n" + product.type + "\n" + product.description
      );
      setTimeout(function() {
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
    LowestHighest.findOne({
      inProgress: true,
      _id: data.action.split("_")[1],
    }).then(function(game) {
      if (game) {
        //console.log(game);
        //console.log(_.find(game.players, (player) => player.id == callback_query.from.id));

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
            //console.log(result);

            if (result.winner) {
              Ship.findOne({
                id: result.winner,
              }).then(function(winner) {
                winner.purse.balance += 10;

                if (result.jackpot) {
                  LowestHighest.find({
                    jackpotPaid: false,
                  }).then((games) => {
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
            log(player, `Just played Lowest-Highest`);
            broadcastInlineKeyboard(
              `<pre>Lowest-Highest</pre>\n\n${callback_query.from.first_name} just played Lowest-Highest and is waiting for an opponent.\n<b>Think you can beat ${callback_query.from.first_name}?</b>\nGo to the casino <i>(only avalible while sailing)</i> and pick a number that is higher ⬆️ then ${callback_query.from.first_name}'s, but lower ⬇️ than the house. Good Luck`, {
                inline_keyboard: [
                  [{
                    text: `Play Now! ${KORONA}5`,
                    callback_data: JSON.stringify({
                      action: "lowest-highest",
                    }),
                  }, ],
                ],
              }
            );
          }
          game.save();
        }
      } else {
        b.sendMessage(callback_query.from.id, "This game is already finished. Stop picking numbers");
      }
    });
  } else if (data.action.indexOf("SL_") === 0) {
    //console.log("CALLBACK QUERY =>", callback_query);

    //SLOTS GAME
    //data.num = bet
    Ship.findOne({
      id: callback_query.from.id,
    }).then(function(ship) {
      slots.get(ship, data.num, callback_query.message.message_id).then((prize) => {
        if (prize) {
          ship.purse.balance += prize;
          ship.save();
          log(player, `Just won ${KORONA}${prize} on the ${emoji.slots}`);
          b.sendKeyboard(
            ship.id,
            `You won ${KORONA}${prize}\nNew Balance: ${KORONA}${ship.purse.balance}`,
            keyboards.slots("", "SL")
          );
          // b.sendKeyboard(ship.id, `<pre>Stats?</pre>`, {
          //   inline_keyboard: [
          //     [
          //       {
          //         text: "Stats for nerds",
          //         callback_data: JSON.stringify({ action: `slotStats` }),
          //       },
          //     ],
          //   ],
          // });
        } else {
          log(player, `Lost on the ${emoji.slots}`);
          b.sendKeyboard(ship.id, `You Lost\nNew Balance: ${KORONA}${ship.purse.balance}`, keyboards.slots("", "SL"));
        }
      });
    });
  } else if (data.action === "buy") {
    Product.findOne({
      _id: data.id,
    }).then((product) => {
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
  } else if (data.action === "lowest-highest") {
    if (ship.purse.balance >= 5) {
      ship.purse.balance -= 5;
      ship.save((err, saved, rows) => {
        if (err) console.error(err);
        LowestHighest.findOne({
          inProgress: true,
        }).then((game) => {
          if (game) {
            b.sendKeyboard(ship.id, "Pick a number", keyboards.numbers(game._id, "LH"));
          } else {
            LowestHighest.create({}, (err, game) => {
              b.sendKeyboard(ship.id, "Pick a number", keyboards.numbers(game._id, "LH"));
            });
          }
        });
      });
    }
  } else if (data.action === "slotStats") {
    console.log("In the SlotStats");
    log(player, `Getting nerdy! Cheking out the Slot stats.\n${slots.stats()}`);
    b.sendMessage(ship.id, slots.stats());
  } else if (data.action === "slotsInstructions") {
    log(player, "Reading instructions for the Slots");
    b.sendMessage(ship.id, slots.instructions);
  } else if (data.action === "mixology") {
    mixology.getGame()
      .then(game => {
        if (game) {
          sendCocktail(game.cocktail, game.fakeIngredients);
        } else {
          mixology.getFakeCocktail()
            .then(cocktail => {
              Mixology.create({
                fakeIngredients: cocktail.fakeIngredients,
                cocktail: cocktail._id
              }, (err, newGame) => {
                console.log(game);
                sendCocktail(cocktail, cocktail.fakeIngredients);
              });
            });
        }
      });
    console.log("Do some mixology stuff");
  } else if (data.action === "mix_guess") {
    mixology.checkGuess(ship, data, callback_query.from.first_name)
      .then(result => {
        switch (result) {
          case -3:
            b.sendMessage(MIXOLOGYPORT, `You won, ${callback_query.from.first_name}`);
            break;
          case -2:
            b.sendMessage(MIXOLOGYPORT, `You already guessed that, ${callback_query.from.first_name}`);
            break;
          case -1:
            b.sendMessage(MIXOLOGYPORT, `You're out, ${callback_query.from.first_name}`);
            break;
          default:
            b.sendMessage(MIXOLOGYPORT, `Good job ${callback_query.from.first_name}`);
        }
      });
  }

  function broadcastInlineKeyboard(message, keyboard) {
    Ship.find({}).then((ships) => {
      b.broadcastKeyboard(
        ships.map(({
          id
        }) => id),
        message,
        keyboard
      ).then(console.log, console.error);
    }, console.error);
  }
};

const sendCocktail = (cocktail, fakeIngredients) => {
  //(cocktail);
  b.sendPhoto(MIXOLOGYPORT, cocktail.image, `<pre>${cocktail.name}</pre>`);
  setTimeout(() => {
    //console.log(keyboards.mixologyIngredients(cocktail.ingredients.concat(cocktail.fakeIngredients)));
    b.sendKeyboard(
      MIXOLOGYPORT,
      `Which ingredients are part of ${cocktail.name}`,
      keyboards.mixologyIngredients(cocktail.ingredients.concat(fakeIngredients))
    );
  }, 500);
};