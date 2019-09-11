var mixology = require('../../mini-game/mixology');
var router = require('express').Router();
var schedule = require('node-schedule');
var moment = require('moment');
var config = require('../../config');
var constants = require('../../constants');
var _ = require('underscore');
var TelegramBot = require('../../bots/telegram');
var keyboards = require('../../constants/keyboards');
var lowestHighest = require('../../mini-game/lowestHighest');

var HSECTORS = 4;
var VSECTORS = 3;
var TREASURE = 500;
var MYSHIP = '5be3d50298ae6843394411ee';
var KORONA = "\u24C0";
var WELCOME = "Welcome To Booze Cruise\!\n\nThis is your ship, go ahead and look around. Press all the buttons, it\'s the only way you\'ll know what they do.\nThis is not a fast-paced game, it occurs in real time.\nBoozeCruise is an in-development game, meaning that the game is constantly evolving.\n\nWant to send the developers a message, or suggest a feature? There's a button for that and we would love for you to use it.\n\nIn BoozeCruise you will travel from port to port, in each port you will meet other sailors like yourself, go ahead introduce yourself to whoever else is in port. \n\nThere is treasure hidden in one of the ports, make sure you look for teasure while you are docked. You could dig up some Korona.\n\nWhere would you like to go ?";
var LOWESTHIGHEST = "Play Lowest Highest for " + KORONA + "5";
var BITCOINADDRESS = '15t1A5qEwSKNtEWNpANdivZeeXp7SGDvqB';

var Port = require('../../models/port');
var Ship = require('../../models/ship');
var Product = require('../../models/product');
var guest = require('../../types/guest');
var LowestHighest = require('../../models/mini-games/lowestHighest/lowestHighest');

var b = TelegramBot.boozecruiseBot;


//TODO -- Add 'Get back to ship' command in port.
//TODO -- comment out keyboard keys that are not currently in use.
//TODO -- When a ship arrives in port, a meassage is sent to the ship. The message should include information about acheivement, stats, other ships in port, etc.

//var dailyEvent = schedule.scheduleJob('30 * * * * *', function(){
var dailyEvent = schedule.scheduleJob('0 0 8 * * *', function () {
  console.log('The answer to life, the universe, and everything!');
  Port.find({})
    .then(function (ports) {
      ports.forEach(function (port) {
        b.getChat(port.id).then(function (chat) {
          console.log(chat);
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

var minutelyEvent = schedule.scheduleJob('0 */1 * * * *', function () {
  //  mixology.getCocktail();
  Port.find({}).then(function (ports) {
    Ship.find({
      'nextLocation.arrival': {
        $lte: new Date()
      }
    }).then(function (ships) {
      ships.forEach(function (ship) {
        var nextPort = _.find(ports, function (port) {
          return port.id == ship.nextLocation.port;
        });
        b.exportChatInviteLink(nextPort.id).then(function (link) {
          b.sendKeyboard(ship.id, 'This is the ' + nextPort.name + ' port authority \nUse this link to dock.\n' + link, keyboards.home(false));
          ship.location = nextPort.location;
          ship.location.port = nextPort.id;
          ship.nextLocation = undefined;
          ship.portHistory.push({
            port: ship.location.port,
            arrivalDate: new Date()
          });
          ship.save().then(function (savedShip) {
            console.log(savedShip);
          }, function (e) {
            console.error(e);
          });
        });

      });
    });
  });

});
// Global Variables
/* Daily events list
var events = [{
    name: "Embarcation / Debarcation Day",
    description: "<b>Your Cruise is over.</b> Your current Guests will disembark your ship this morning, bringing with them stories from their cruise, the happier they are, the more more likley they will cruise again and the more likley they will tell their friends to cruise. Guests that have had a negitive experence are not likley to cruise again and are more than likley to discourage future guests from cruising. Use the time that your ship has no guests, to clean it and prepare it for the next cruise, which departs tonight.",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
  {
    name: "Deck Party",
    description: "It's party time.",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
  {
    name: "Formal Night",
    description: "Put on your glad rags and do your hair because tonight is formal night. That means it steak and lobster in the main dining room and a las Vegas style show in the Show Lounge.",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
  {
    name: "Sea Day",
    description: "<b>Look around.... Nothing but ocean.</b> That doesn't mean there is nothing to do, the Cruise Director has orginazed a bunch of activties for your guests to take part in. activties include: The Men's Hairy Chest Competition, BINGO, Scavenger Hunt, etc",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
  {
    name: "Port Day",
    description: "It's time to get off the ship and explore these strange and wonderful lands",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
  {
    name: "Hurricane",
    description: "This is your Captin speaking.... Due to some severe weather patterns, we will unfortunately be skipping our next port of call.",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
  {
    name: "Thank You",
    description: "Thank you for testing my game and giving me feedback on things that need fixing. I will be adding a place that you can report theses bugs, so keep an eye out for that button.\nOne thing I have become aware of is these daily messages are not very useful right now and as a result get ignored, I will be pausing the until they become relevant, with the hope that important messages like an invitation to dock will not get lost in the mix. \n\nAs you know I am building this game with the help of Laurent so that I can learn to code better, and it is clearly starting to pay off, so, THANK YOU LAURENT!",
    keyboard: keyboards.home(ship.nextLocation.port)
  },
];

*/
// Moves

var moves = {
  cocktailLounge: {
    guests: function () {
      guest.pick();
    }
  },
};

//b.exportChatInviteLink('')


// This post is everytime someone says something to the bot.

router.post('/', function (req, res, next) {
  console.log(req.body);

  if (req.body.callback_query) {
    Ship.findOne({
      id: req.body.callback_query.from.id
    })
      .then(function (ship) {
        //if (parseInt(req.body.callback_query.from.id) > 0) { } else { }
        var data = JSON.parse(req.body.callback_query.data);
        if (data.action === 'navigate') {
          if (ship.id != MYSHIP) {
            Port.findOne({
              id: data.port
            })
              .then(function (port) {
                var arrival = new Date();
                arrival = arrival.setTime(arrival.getTime() + calculateDistance(port.location, ship.location) * 60 * 60 * 1000);
                ship.nextLocation = {
                  arrival: arrival,
                  port: data.port,
                  portName: port.name
                };
                if (ship.portHistory.length > 0) {
                  ship.portHistory[ship.portHistory.length - 1].departureDate = new Date();
                }
                b.kick(ship.location.port, ship.id, 1);
                ship.location.port = undefined;
                ship.save();
                console.log(data);
                b.sendMessage(ship.id, "Your ship is now en route to " + port.name + "\nyou will arrive in " + calculateTime(arrival));
                b.sendKeyboard(ship.id, "--------", keyboards.home(ship.nextLocation.port));
              });
          }
        } else if (data.action === 'navigate_sector') {
          Port.find({
            "location.sector": data.sector
          })
            .then(function (ports) {
              sendAvailablePorts(req.body.callback_query.from.id, ports, ship);

            });
          // Start Product list
        } else if (data.action === 'product') {
          Product.findOne({ _id: data.product }).then(product => {
            b.sendPhoto(req.body.callback_query.from.id, product.image, product.name + "\n" + product.type + "\n" + product.description);
            setTimeout(function () { b.sendKeyboard(req.body.callback_query.from.id, "Price: " + KORONA + product.price + "\nQuantity Available: " + product.quantity + "\nExpiry: " + product.expiry, keyboards.product(product)) }, 1500);
          })
          // End Product list

          // Start Mini-game Lowest-Highest
        } else if (data.action.indexOf("LH_") === 0) {
          LowestHighest.findOne({ inProgress: true, _id: data.action.split("_")[1] }).then(function (game) {
            if (game) {
              console.log(game);
              console.log(_.find(game.players, player => player.id == req.body.callback_query.from.id));

              if (_.find(game.players, player => player.id == req.body.callback_query.from.id)) {
                b.sendMessage(req.body.callback_query.from.id, "You have already picked a number for this game")

              } else {
                game.players.push({
                  id: req.body.callback_query.from.id,
                  guess: data.num,
                  name: req.body.callback_query.from.first_name

                })
                if (game.players.length === 2) {
                  let result = lowestHighest(game.houseGuess, game.players[0], game.players[1]);
                  console.log(result);

                  if (result.winner) {
                    Ship.findOne({ id: result.winner }).then(function (winner) {
                      winner.purse.balance += 10;

                      if (result.jackpot) {
                        LowestHighest.find({ jackpotPaid: false }).then(games => {
                          winner.purse.balance += 4 * games.length;
                          winner.save();
                          b.sendMessage(game.players[0].id, result.message);
                          b.sendMessage(game.players[1].id, result.message);
                          games.forEach(game => {
                            game.jackpotPaid = true;
                            game.save();
                          })
                        })
                      } else {
                        b.sendMessage(game.players[0].id, result.message);
                        b.sendMessage(game.players[1].id, result.message);
                        winner.save();
                      }
                    })

                  } else {
                    b.sendMessage(game.players[0].id, result.message);
                    b.sendMessage(game.players[1].id, result.message);
                  }
                  game.inProgress = false;

                } else {
                  b.sendMessage(req.body.callback_query.from.id, "You have selected " + data.num)
                }
                game.save();
              }
            } else {
              b.sendMessage(req.body.callback_query.from.id, "This game is already finished. Stop picking numbers")
            }
          })
        }
        // End Mini-game Lowest-Highest
      });
    return res.sendStatus(200);
  } else if (req.body.edited_message || req.body.message.photo || req.body.message.game || req.body.message.emoji || req.body.message.voice || req.body.message.animation || req.body.message.sticker || req.body.message.reply_to_message) {
    //Ignore these messages as they're just chat interactions
    return res.sendStatus(200);
  } else {
    if (parseInt(req.body.message.chat.id) > 0) {
      Ship.findOne({
        id: req.body.message.chat.id
      })
        .then(function (ship) {
          if (!ship) {
            Port.find({})
              .then(function (ports) {
                var randomPort = ports[Math.floor(Math.random() * ports.length)];
                var newShip = new Ship({
                  id: req.body.message.chat.id,
                  user: {
                    id: req.body.message.from.id,
                    first_name: req.body.message.from.first_name,
                    last_name: req.body.message.from.last_name,
                    username: req.body.message.from.username,
                  },
                  location: {
                    sector: randomPort.location.sector,
                    x: randomPort.location.x,
                    y: randomPort.location.y,
                    port: randomPort.id,
                    homePort: randomPort.id,
                  }
                });
                newShip.save();
                b.sendKeyboard(req.body.message.chat.id, WELCOME, keyboards.home());
                console.log(randomPort);
              });

          } else {
            if (req.body.message.text == "/start") {
              //    b.sendMessage(req.body.message.chat.id, welcomeMessage);
              b.sendKeyboard(req.body.message.chat.id, WELCOME, keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == "Check Balance") {
              b.sendMessage(ship.id, "Your balance is " + KORONA + ship.purse.balance);
            } else if (req.body.message.text == "\ud83c\udf87 Achievements \ud83c\udf87") {
              var portIds = ship.portHistory.map(function (port) {
                return port.port;
              });
              Port.find({
                id: portIds
              }).then(function (ports) {
                console.log(ports);
                var count = ship.portHistory.reduce(function (portCount, port) {
                  if (!portCount[port.port]) {
                    portCount[port.port] = {
                      name: ports.find(function (foundPort) {
                        return foundPort.id == port.port;
                      }).name,
                      count: 0
                    };
                  }
                  portCount[port.port].count++;
                  return portCount;
                }, {});
                console.log(count);
                var message = "";
                for (var key in count) {
                  message += "\n" + count[key].name + " (" + count[key].count + ")";
                }
                b.sendMessage(ship.id, "You have been to the following ports: " + message);
              });

            } else if (req.body.message.text == "\ud83d\udc1b Maintenance \ud83d\udc1b") {
              b.sendKeyboard(req.body.message.chat.id, "\ud83d\udc1b Maintenance \ud83d\udc1b", keyboards.maintenance);
            } else if (req.body.message.text == "\ud83d\udc81 Crew Manifest \ud83d\udc81") {
              b.sendMessage(ship.id, "There are plenty of crew on your ship. You'll meet them when the time is right.")
            } else if (req.body.message.text == "\u2630 Main Menu \u2630") {
              b.sendKeyboard(req.body.message.chat.id, "\u2630 Main Menu \u2630", keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == "\ud83d\uddfa Navigation \ud83d\uddfa" || req.body.message.text == "\ud83d\udccd Current Location \ud83d\udccd") {
              console.log(ship.nextLocation);
              if (ship.nextLocation.port) {
                Port.findOne({
                  id: ship.nextLocation.port
                }).then(function (port) {
                  b.sendMessage(ship.id, "You will arrive in " + calculateTime(ship.nextLocation.arrival));
                  b.sendKeyboard(ship.id, "Your ship is currently en route to " + port.name, keyboards.atSea);
                });
              } else {

                Port.findOne({
                  id: ship.location.port
                }).then(function (port) {
                  b.exportChatInviteLink(port.id).then(function (link) {
                    b.sendKeyboard(ship.id, "You are currently in the " + port.name + " harbour.", keyboards.navigation);
                    /* setTimeout(function () {
                       
                     }, 5000);
                   */
                  });
                });

              }

              // Start Mini-game Lowest-Highest

            } else if (req.body.message.text == "Yes,\n" + LOWESTHIGHEST) {

              if (ship.purse.balance >= 5) {
                ship.purse.balance -= 5;
                ship.save((err, saved, rows) => {
                  if (err) console.error(err);
                  LowestHighest.findOne({ inProgress: true }).then(function (game) {
                    if (game) {
                      console.log(game);
                      b.sendKeyboard(ship.id, "Pick a number", keyboards.numbers(game._id));
                      b.sendKeyboard(ship.id, "Pick a number", keyboards.casino);
                    } else {
                      LowestHighest.create({
                      }, (err, game) => {
                        console.log(game);

                        b.sendKeyboard(ship.id, "Pick a number", keyboards.numbers(game._id));
                        b.sendKeyboard(ship.id, "Pick a number", keyboards.casino);
                      })
                    }
                  })
                });
              }
            }
            // End Mini-game Lowest-Highest

            // Decison keyboard promped
            else if (req.body.message.text == "\u2693 Dock \u2693") {

              Port.findOne({
                id: ship.location.port
              }).then(function (port) {
                b.exportChatInviteLink(port.id).then(function (link) {
                  b.sendKeyboard(ship.id, link, keyboards.navigation);
                });
              });

            } else if (req.body.message.text == "No") {
              b.sendKeyboard(req.body.message.chat.id, "This is the ship's bridge.\n\n From here you can control which port of call you will visit next.", keyboards.navigation);
            } else if (req.body.message.text == "\ud83d\udea2 Home Port \ud83d\udea2" || req.body.message.text == "/addGuest") {
              var newGuest = guest.pick();
              ship.guests.push(newGuest);
              ship.save();
              b.sendKeyboard(req.body.message.chat.id, "A " + guest.getType(newGuest.type) + " guest just boarded your vessel", keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == '\ud83d\udcb0 Treasure \ud83d\udcb0') {
              b.getChatMember(ship.location.port, ship.id)
                .then(function (chatMember) {
                  Port.findOne({
                    id: ship.location.port,
                    treasure: {
                      $gt: 0
                    }
                  }).then(function (port) {
                    if (port) {
                      b.sendMessage(ship.id, "You found " + port.treasure + " Korona in the buried treasure");
                      b.sendMessage(port.id, ship.user.first_name + " just found " + port.treasure + " Korona here.");
                      ship.purse.balance += port.treasure;
                      ship.purse.transactions.push({
                        date: new Date(),
                        type: "Treasure",
                        amount: port.treasure
                      });
                      ship.save();
                      port.treasure = 0;
                      port.save();
                      Port.find({
                        id: {
                          $ne: ship.location.port
                        }
                      }).then(function (ports) {
                        var randomPort = Math.floor(Math.random() * ports.length);
                        ports[randomPort].treasure = Math.round(Math.random() * TREASURE + 1);
                        ports[randomPort].save();
                      });
                    } else {
                      b.sendMessage(ship.id, "No treasure here, keep searching");
                    }
                  });
                }, function () {
                  b.exportChatInviteLink(ship.location.port).then(function (link) {
                    b.sendMessage(ship.id, "You have arrived in port. However, you have not docked, you can only search for treasure once you have docked in port.\n" + link);
                  });
                });

              // Captains Log:

            }
            else if (req.body.message.text.substring(0, req.body.message.text.indexOf(' ')) == "/log") {
              var message = req.body.message.text.substring(req.body.message.text.indexOf(' ') + 1);
              b.sendMessage(ship.id, "Captain's Log: " + message);
              Ship.findOne({
                id: ship.id
              }).then(function (ship) {
                ship.communication.push({
                  date: new Date(),
                  type: "log",
                  transcript: message
                })
                ship.save();
              });

              // GIFT SHOP

            } else if (req.body.message.text == '\ud83d\udcb0 Shop \ud83d\udcb0') {
              b.sendKeyboard(req.body.message.chat.id, "This is the ship's gift shop.\n\n From here you can buy trinkets and whositswhatsits that will benefit you in the game", keyboards.shop);
            } else if (req.body.message.text == 'Products') {
              Product.find({})
                .then(products => {
                  b.sendKeyboard(req.body.message.chat.id, "Buy something.", keyboards.products(products));
                })

            }
            else if (req.body.message.text == "\u2388 Capt's Log \u2388") {
              b.sendMessage(ship.id, "The Captian's Log is a place for you to keep notes or other information. Each entry will be date stamped and displayed below. \nTo create a new entry, type /log followed by your message. \n\neg. /log This is my first Captians Log.");
              var logReport = "<b>Captain's Log:</b>\n";
              ship.communication.forEach(function (element) {

                logReport += moment(element.date).format('LL') + " | " + element.transcript + "\n\n";
              });
              b.sendMessage(ship.id, logReport);


              // Broadcast



            } else if (req.body.message.text.substring(0, req.body.message.text.indexOf(' ')) == "/broadcast") {
              if (ship._id == MYSHIP) {
                broadcast(req.body.message.text.substring(req.body.message.text.indexOf(' ') + 1))
              }
            } else if (req.body.message.text.substring(0, req.body.message.text.indexOf(' ')) == "/product") {
              if (ship._id == MYSHIP) {
                var product = req.body.message.text.substring(req.body.message.text.indexOf(' ') + 1)
                Product.create({
                  name: product,

                })
              }
            } else if (req.body.message.text == "/removeGuest") {
              var removedGuest = ship.guests.pop();
              ship.save();
              b.sendKeyboard(req.body.message.chat.id, removedGuest, keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == '\ud83d\udc1b BUG \ud83d\udc1b') {
              b.sendKeyboard(req.body.message.chat.id, "Oh No!!! A BUG! Quick! Kill it!\n\nGo here to report the bug\n\nhttps://t.me/joinchat/HmxycxY2tSHp_aZX4mQ9QA", keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == 'Deposit') {
              b.sendMessage(ship.id, "This feature is coming soon! \n\nIn the meantime you should look for treasure the next time you are in port.");
            } else if (req.body.message.text == '\ud83d\udc1b Suggestions \ud83d\udc1b') {
              b.sendKeyboard(req.body.message.chat.id, "Got an idea?\n\nGo here to tell us\n\nhttps://t.me/joinchat/HmxycxOCylQHWIDtPsd7pw", keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == '\ud83c\udfdd Ports of Call \ud83c\udfdd') {
              Port.find({
                id: {
                  $ne: ship.location.port
                }
              }).then(function (ports) {
                var portsInShipSector = ports.filter(function (port) {
                  return port.location.sector === ship.location.sector;
                }).length;
                if (portsInShipSector === 0) {

                  var sectors = {};
                  ports.forEach(function (port, i, array) {
                    if (!sectors[port.location.sector]) sectors[port.location.sector] = '';
                    sectors[port.location.sector] += port.name + ', ';
                  });
                  var message = "";
                  for (var i in sectors) {
                    sectors[i] = sectors[i].substring(0, sectors[i].length - 2);
                    message += constants.sectors[i] + ': ' + sectors[i] + '\n';
                  }
                  b.sendMessage(req.body.message.chat.id, 'Below are the available continents that you can travel to. The ports of call that you can visit are listed beside the respective continents.\n\n' + message);
                  setTimeout(function () {
                    b.sendKeyboard(req.body.message.chat.id, "Which continent would you like to navigate to:", {
                      inline_keyboard: Object.keys(sectors).map(function (sector) {
                        return [{
                          'text': constants.sectors[sector],
                          'callback_data': JSON.stringify({
                            action: "navigate_sector",
                            sector: sector,
                          })
                        }];
                      })
                    });
                  }, 5000);
                } else if (portsInShipSector === ports.length) {
                  sendAvailablePorts(req.body.message.chat.id, ports, ship);
                } else {
                  b.sendKeyboard(req.body.message.chat.id, "A port of call is an intermediate stop for a ship on its sailing itinerary.\n\nWhere would you like to go?", keyboards.ports);
                }
              });

            } else if (req.body.message.text == 'Same Continent') {
              Port.find({
                "location.sector": ship.location.sector,
                "id": {
                  $ne: ship.location.port
                }
              }).then(function (ports) {
                sendAvailablePorts(req.body.message.chat.id, ports, ship);
              });
            } else if (req.body.message.text === 'Change Continent') {
              Port.find({
                "location.sector": {
                  $ne: ship.location.sector
                }
              }).then(function (ports) {
                var sectors = {};
                ports.forEach(function (port, i, array) {
                  if (!sectors[port.location.sector]) sectors[port.location.sector] = '';
                  sectors[port.location.sector] += port.name + ', ';
                });
                var message = "";
                for (var i in sectors) {
                  sectors[i] = sectors[i].substring(0, sectors[i].length - 2);
                  message += constants.sectors[i] + ': ' + sectors[i] + '\n';
                }
                b.sendMessage(req.body.message.chat.id, 'Below are the available continents that you can travel to. The ports of call that you can visit are listed beside the respective continents.\n\n' + message);
                setTimeout(function () {
                  b.sendKeyboard(req.body.message.chat.id, "Which continent would you like to navigate to:", {
                    inline_keyboard: Object.keys(sectors).map(function (sector) {
                      return [{
                        'text': constants.sectors[sector],
                        'callback_data': JSON.stringify({
                          action: "navigate_sector",
                          sector: sector,
                        })
                      }];
                    })
                  });
                }, 5000);
              });

            } else if (req.body.message.text == '\ud83d\udcb0 Purser \ud83d\udcb0') {
              b.sendKeyboard(req.body.message.chat.id, "A ship's purser is the person on a ship principally responsible for the handling of money on board.\n\nThe currency is Korona or " + KORONA + " for short. \n\n How may I help you today?", keyboards.purser);
            } else if (req.body.message.text == '\ud83d\udcb0 Casino \ud83d\udcb0') {
              b.sendKeyboard(req.body.message.chat.id, "A ship's casino is a place where you can spend your " + KORONA + " for chance to win.", keyboards.casino);
            } else if (req.body.message.text == '\u2195 Lowest Highest \u2195') {
              LowestHighest.find({ jackpotPaid: false }).then(games => {
                b.sendKeyboard(req.body.message.chat.id, "This game cost " + KORONA + "5 to play\n" + "Your current balance is " + KORONA + ship.purse.balance + "\n" + KORONA + "10 is awarded to the winner" + "\n\nSelect a number higher than your opponent but lower than the House to win.\nTo win the jackpot, you must guess the same number as the House.\n\n" + "Current jackpot is " + KORONA + 4 * games.length, keyboards.decision(LOWESTHIGHEST));
              })
            } else if (req.body.message.text == '\ud83d\udc65 Manifest \ud83d\udc65') {
              b.sendKeyboard(req.body.message.chat.id, "A document giving comprehensive details of a ship and its cargo and other contents, passengers, and crew for the use of customs officers.", keyboards.manifest);
            } else if (req.body.message.text == '\ud83d\udc65 Guest Manifest \ud83d\udc65') {
              var guestList = {};
              ship.guests.forEach(function (guest) {
                if (!guestList[guest.type]) {
                  guestList[guest.type] = 0;

                }
                guestList[guest.type]++;
              });
              var message1 = '';
              for (var i in guestList) {
                message1 += guest.getType(i) + ": " + guestList[i] + "\n";
              }
              b.sendKeyboard(req.body.message.chat.id, "The Guest Manifest:\n" + message1, keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == '\ud83c\udf87 Achievements \ud83c\udf87') {
              Ship.findOne({
                id: ship.id
              }).populate("portHistory.port").then(function (sameShip) {
                var message = "<b>Your Port History:</b>";
                sameShip.portHistory.forEach(function (stop) {
                  var arrivalDate = moment(stop.arrivalDate);
                  var departureDate = moment(stop.departureDate);
                  message += "\n" + stop.port.name + " | " + arrivalDate.diff(departureDate, "days");
                });
                b.sendMessage(req.body.message.chat.id, message);
              });

            } else if (req.body.message.text == 'Port \ud83d\udea2') {
              console.log("log here");
              b.exportChatInviteLink('-1001399879250').then(function (link) {
                console.log(link);
                b.sendMessage(req.body.message.chat.id, link);
              });
            }
          }
          //res.sendStatus(200);

        }
        );
    } else {
      Port.findOne({
        id: req.body.message.chat.id
      })
        .then(function (port) {
          if (!port) {
            if (req.body.message.chat.id == MYSHIP) {
              b.getChat(req.body.message.chat.id).then(function (chat) {
                console.log(chat);
                var newPort = new Port({
                  id: req.body.message.chat.id,
                  name: chat.title,
                  description: chat.description
                });
                newPort.save();
              });
            }
          } else {
            if (req.body.message.text == "/start") {
              //    b.sendMessage(req.body.message.chat.id, welcomeMessage);
              b.sendKeyboard(req.body.message.chat.id, WELCOME, keyboards.home(ship.nextLocation.port));
            } else if (req.body.message.text == "/kick") {
              //    b.sendMessage(req.body.message.chat.id, welcomeMessage);
              b.kick(req.body.message.chat.id, req.body.message.from.id, 1);
              Ship.findOne({
                "user.id": req.body.message.from.id
              }).then(function (ship) {
                b.sendMessage(ship.id, "You've been kicked from " + port.name);
              });
            } else if (req.body.message.new_chat_participant) {
              Ship.findOne({
                "user.id": req.body.message.new_chat_participant.id
              }).then(function (ship) {
                port.ships.push(ship._id);
                port.save();
              });

            } else if (req.body.message.left_chat_participant) {
              Ship.findOne({
                "user.id": req.body.message.left_chat_participant.id
              }).then(function (ship) {
                port.ships = port.ships.filter(function (portShip) {
                  return portShip != ship._id;
                });
                port.save();
              });
            } else {
              Ship.findOne({
                "user.id": req.body.message.from.id
              }).then(function (ship) {
                var found = false;
                for (var i in port.ships) {
                  if (port.ships[i] == ship._id) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  port.ships.push(ship._id);
                  port.save();
                }
                ship.location = port.location;
                ship.location.port = port.id;
                ship.save();
              });

            }


          }
        });
    }
    res.sendStatus(200);



  }

});

router.get('/', function (req, res, next) {
  b.sendMessage('510423667', 'Received Get');
  res.json({
    message: 'get ok'
  });
});
b.sendKeyboard('510423667', 'Server Restarted', keyboards.home(false));

module.exports = router;

function calculateTime(arrival) {
  return Math.abs(moment().diff(arrival, 'hours')) + " hours " + Math.abs(moment().diff(arrival, 'minutes') % 60) + " minutes";
}

function calculateDistance(portLocation, shipLocation) {
  if (portLocation.sector === shipLocation.sector) {
    var distance = Math.abs(portLocation.x - shipLocation.x) + Math.abs(portLocation.y - shipLocation.y);
    return (distance + 1) * 3;
  } else {
    var portSector = {
      x: portLocation.sector % HSECTORS,
      y: Math.floor(portLocation.sector / HSECTORS)
    };
    var shipSector = {
      x: shipLocation.sector % HSECTORS,
      y: Math.floor(shipLocation.sector / HSECTORS)
    };
    var x = Math.abs(portSector.x - shipSector.x) > HSECTORS - Math.abs(portSector.x - shipSector.x) ? HSECTORS - Math.abs(portSector.x - shipSector.x) : Math.abs(portSector.x - shipSector.x);
    var y = Math.abs(portSector.y - shipSector.y) > VSECTORS - Math.abs(portSector.y - shipSector.y) ? VSECTORS - Math.abs(portSector.y - shipSector.y) : Math.abs(portSector.y - shipSector.y);
    return Math.abs((x + y) * 24);
  }
}
function broadcast(message) {
  Ship.find({}).then(function (ships) {
    b.broadcast(ships.map(function (ship) {
      return ship.id;
    }), message);
  });
}


function sendAvailablePorts(chat_id, ports, ship) {
  b.sendMessage(chat_id, ports.reduce(function (message, port) {
    message += '<b>' + port.name + "</b>\n";
    message += port.description + "\n\n";
    message += "Distance to port <b>" + calculateDistance(port.location, ship.location) + "</b> hours\n";
    message += "Ships in port <b>" + port.ships.length + "</b>\n\n";
    return message;
  }, ''));
  setTimeout(function () {
    var keyboard = ports.map(function (port) {
      return {
        'text': port.name,
        'callback_data': JSON.stringify({
          action: "navigate",
          port: port.id,
          ship: ship.id,
        })
      };
    });
    console.log(keyboard);
    b.sendKeyboard(chat_id, "Navigate to:", {
      inline_keyboard: [keyboard]
    });
  }, 3000);

}
