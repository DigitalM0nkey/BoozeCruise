const schedule = require("node-schedule");

const TelegramBot = require("../bots/telegram");
const bingo = require("../mini-game/bingo/bingo");
const scrapers = require("../scrapers/allScrapers");
const b = TelegramBot.boozecruiseBot;

const Port = require("../models/port");
const Ship = require("../models/ship");
const Bingo = require("../models/mini-games/bingo/bingo");

const bingoEvent = schedule.scheduleJob("*/10 * * * * *", () => {
  Bingo.findOne({ status: "playing" }).then(async (game) => {
    const ball = await bingo.draw(game);
    if (ball) {
      game.ships.forEach((ship) => b.sendMessage(ship.id, `<b>${ball.letter}${ball.number}</b>`));
    }
  });
});

//var dailyEvent = schedule.scheduleJob('30 * * * * *', function(){
const dailyEvent = schedule.scheduleJob("0 0 8 * * *", () => {
  scrapers.cleanData();
  console.log("The answer to life, the universe, and everything!");
  Port.find({}).then((ports) => {
    ports.forEach((port) => {
      b.getChat(port.id).then((chat) => {
        // console.log(chat);
        port.description = chat.description;
        port.name = chat.title;
        port.save();
      });
    });
  });

  /*  Send a random event every day
  
      var randomEvent = events[Math.floor(Math.random() * events.length)]
      Ship.find({})
      .then(function(ships) {
        ships.forEach(function(ship) {
          b.sendKeyboard(ship.id, '<b>' + randomEvent.name + '</b> - ' + randomEvent.description, randomEvent.keyboard)
        });
      });
  
      */
});

const minutelyEvent = schedule.scheduleJob("0 */1 * * * *", () => {
  //  mixology.getCocktail();
  Port.find({}).then((ports) => {
    Ship.find({
      "nextLocation.arrival": {
        $lte: new Date(),
      },
    }).then((ships) => {
      ships.forEach((ship) => {
        const nextPort = _.find(ports, ({ id }) => {
          return id == ship.nextLocation.port;
        });
        if (nextPort) {
          b.exportChatInviteLink(nextPort.id).then((link) => {
            b.sendKeyboard(
              ship.id,
              `This is the ${nextPort.name} port authority \nUse this link to dock.\n`,
              {
                inline_keyboard: [
                  [
                    {
                      text: nextPort.name,
                      url: link,
                    },
                  ],
                ],
              }
              // keyboards.arrival
              // keyboards.home(false)
            );
            ship.location = nextPort.location;
            ship.location.port = nextPort.id;
            ship.nextLocation = undefined;
            ship.portHistory.push({
              port: ship.location.port,
              arrivalDate: new Date(),
            });
            ship.save().then(
              (savedShip) => {
                console.log(savedShip);
              },
              (e) => {
                console.error(e);
              }
            );
          });
        }
      });
    });
  });
});
