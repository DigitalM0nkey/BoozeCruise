const mixology = require("../../mini-game/mixology");
const bingo = require("../../mini-game/bingo/bingo");
const router = require("express").Router();
const moment = require("moment");
const globalSectors = require("../../constants/sectors");
const _ = require("underscore");
const TelegramBot = require("../../bots/telegram");
const keyboards = require("../../constants/keyboards");
const emoji = require("../../constants/emoji");
const callbackQueries = require("../../constants/callbackQueries");
const globalFunctions = require("../../constants/globalFunctions");
const log = globalFunctions.log;

const MYSHIP = "5be3d50298ae6843394411ee";
const MIXOLOGYPORT = -1001216326021; //Caspian
const KORONA = "\u24C0";
const WELCOME =
  "Welcome To Booze Cruise!\n\nThis is your ship, go ahead and look around.\nWhen you are ready, go to 'Navigation', pick a port to trave to and set sail. In each port you will meet other sailors like yourself, go ahead introduce yourself.\n\nThere is treasure hidden in one of the ports, make sure you look for teasure once you dock. You could dig up some Korona.\n\nWhere would you like to go?\n(Click <b>Navigation</b> below to decide)";
const LOWESTHIGHEST = `Play Lowest-Highest - ${KORONA}5`;
const BITCOINADDRESS = "15t1A5qEwSKNtEWNpANdivZeeXp7SGDvqB";

const Port = require("../../models/port");
const Ship = require("../../models/ship");
const Product = require("../../models/product");
const guest = require("../../types/guest");
const crew = require("../../types/crew");
const LowestHighest = require("../../models/mini-games/lowestHighest/lowestHighest");
//let articles = [];
//const cruiseLawNewsArticles = require("../../scrapers/cruiseLawNews_scraper");
//const iLikeCruiseShipsArticles = require("../../scrapers/iLikeCruiseShips_scraper");
const scrapers = require("../../scrapers/allScrapers");

const b = TelegramBot.boozecruiseBot;

//TODO -- Add 'Get back to ship' command in port.
//TODO -- comment out keyboard keys that are not currently in use.
//TODO -- When a ship arrives in port, a meassage is sent to the ship. The message should include information about acheivement, stats, other ships in port, etc.

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

const moves = {
  cocktailLounge: {
    guests() {
      guest.pick();
    },
  },
};

//b.exportChatInviteLink('')

// This post is everytime someone says something to the bot.

router.post("/", ({ body }, res, next) => {
  if (body.callback_query) {
    if (parseInt(body.callback_query.from.id) > 0) {
      Ship.findOne({
        id: body.callback_query.from.id,
      }).then((ship) => {
        const data = JSON.parse(body.callback_query.data);
        callbackQueries(body.callback_query, ship, data);
      });
    } else {
      Port.findOne({
        id: body.callback_query.message.chat.id,
      }).then((ports) => {
        // console.log(body.callback_query.message.chat.id);
        //console.log("ports => ", ports);
        const data = JSON.parse(body.callback_query.data);
        callbackQueries(body.callback_query, ports, data);
      });
    }
    return res.sendStatus(200);
  } else if (body.edited_message) {
    //Ignore these messages as they're just chat interactions
    return res.sendStatus(200);
  } else if (
    body.channel_post ||
    body.edited_message ||
    body.message.photo ||
    body.message.game ||
    body.message.emoji ||
    body.message.voice ||
    body.message.animation ||
    body.message.sticker /*|| req.body.message.reply_to_message*/
  ) {
    //Ignore these messages as they're just chat interactions
    return res.sendStatus(200);
  } else {
    if (parseInt(body.message.chat.id) > 0) {
      Ship.findOne({
        id: body.message.chat.id,
      }).then((ship) => {
        if (!ship) {
          Port.find({}).then((ports) => {
            // console.log(ports);
            const randomPort = ports[Math.floor(Math.random() * ports.length)];
            const newShip = new Ship({
              id: body.message.chat.id,
              user: {
                id: body.message.from.id,
                first_name: body.message.from.first_name,
                last_name: body.message.from.last_name,
                username: body.message.from.username,
              },
              location: {
                sector: randomPort.location.sector,
                x: randomPort.location.x,
                y: randomPort.location.y,
                port: randomPort.id,
                homePort: randomPort.id,
              },
            });
            newShip.save();
            log(body.message.from.first_name, `Just christened a new ship!`);
            b.sendKeyboard(body.message.chat.id, WELCOME, keyboards.welcome());
          });
        } else {
          const player = ship.user.first_name;
          if (body.message.text == "/start") {
            //    b.sendMessage(req.body.message.chat.id, welcomeMessage);
            b.sendKeyboard(body.message.chat.id, WELCOME, keyboards.welcome);
            log(player, `Having engine troubles. Attempting to restart their ship.`);
          } else if (body.message.text == "Check Balance") {
            b.sendMessage(ship.id, `Your balance is ${KORONA}${ship.purse.balance}`);
            log(player, `Checking if they have enough ${KORONA} for another cocktail.`);
          } else if (body.message.text == "\ud83c\udf87 Achievements \ud83c\udf87") {
            log(player, `Checking out their stats.`);
            const portIds = ship.portHistory.map((port) => {
              return port.port;
            });
            Port.find({
              id: portIds,
            }).then((ports) => {
              const count = ship.portHistory.reduce((portCount, port) => {
                if (!portCount[port.port]) {
                  portCount[port.port] = {
                    name: ports.find(({ id }) => {
                      return id == port.port;
                    }).name,
                    count: 0,
                  };
                }
                portCount[port.port].count++;
                return portCount;
              }, {});

              let message = "";
              for (const key in count) {
                message += `\n${count[key].name} (${count[key].count})`;
              }
              b.sendMessage(ship.id, `You have been to the following ports: ${message}`);
            });
          } else if (body.message.text == "\ud83d\udc1b Maintenance \ud83d\udc1b") {
            log(player, `is waving frantically, tring to get the maintenance department to assist`);
            b.sendKeyboard(body.message.chat.id, "\ud83d\udc1b Maintenance \ud83d\udc1b", keyboards.maintenance);
          } else if (body.message.text == "/return") {
            b.sendKeyboard(body.message.chat.id, "@BoozeCruise_bot", keyboards.port);
          } else if (body.message.text == "Return to Ship") {
            b.sendKeyboard(body.message.chat.id, "@BoozeCruise_bot", keyboards.port);
          } else if (body.message.text == "\ud83d\udc81 Crew Manifest \ud83d\udc81") {
            log(player, `making the rounds, checking in on the crew.`);
            b.sendMessage(ship.id, "There are plenty of crew on your ship. You'll meet them when the time is right.");
          } else if (body.message.text == "\u2630 Main Menu \u2630") {
            log(player, `Just requested the main menu`);
            b.sendKeyboard(body.message.chat.id, "\u2630 Main Menu \u2630", keyboards.home(ship.nextLocation.port));
          } else if (
            body.message.text == "\ud83d\uddfa Navigation \ud83d\uddfa" ||
            body.message.text == "\ud83d\udccd Current Location \ud83d\udccd"
          ) {
            if (ship.nextLocation.port) {
              Port.findOne({
                id: ship.nextLocation.port,
              }).then(({ name }) => {
                b.sendMessage(
                  ship.id,
                  `You will arrive in ${globalFunctions.calculateTime(ship.nextLocation.arrival)}`
                );
                b.sendKeyboard(ship.id, `Your ship is currently en route to ${name}`, keyboards.atSea);
                log(
                  player,
                  `Set sail to ${name}. In fine weather they should arrive in ${globalFunctions.calculateTime(
                    ship.nextLocation.arrival
                  )}`
                );
              });
            } else {
              Port.findOne({
                id: ship.location.port,
              }).then(({ id, name }) => {
                b.exportChatInviteLink(id).then((link) => {
                  b.sendKeyboard(ship.id, `You are currently in the ${name} harbour.`, keyboards.navigation);
                  log(player, `Currently in the ${name} harbour.`);
                  /* setTimeout(function () {

                  }, 5000);
                  */
                });
              });
            }

            // Start Mini-game Lowest-Highest
            // } else if (body.message.text == `${LOWESTHIGHEST}`) {
            // if (ship.purse.balance >= 5) {
            //   ship.purse.balance -= 5;
            //   ship.save((err, saved, rows) => {
            //     if (err) console.error(err);
            //     LowestHighest.findOne({ inProgress: true }).then((game) => {
            //       if (game) {
            //         b.sendKeyboard(ship.id, "Pick a number", keyboards.numbers(game._id, "LH"));
            //       } else {
            //         LowestHighest.create({}, (err, game) => {
            //           b.sendKeyboard(ship.id, "Pick a number", keyboards.numbers(game._id, "LH"));
            //         });
            //       }
            //     });
            //   });
            // }
            // End Mini-game Lowest-Highest
            // b.sendKeyboard(
            //   ship.id,
            //   `This is the ${nextPort.name} port authority \nUse this link to dock.\n`,
            //   {
            //     inline_keyboard: [
            //       [
            //         {
            //           text: nextPort.name,
            //           url: link,
            //         },
            //       ],
            //     ],
            //   }
          } else if (body.message.text == `${emoji.books} Library ${emoji.books}`) {
            log(player, "In the library...with Colonel Mustard?");

            b.sendKeyboard(ship.id, `Welcome to the Library`, {
              inline_keyboard: [
                [
                  {
                    text: `NEWS`,
                    callback_data: JSON.stringify({
                      action: "news",
                    }),
                  },
                ],
              ],
            });

            scrapers.cleanData().then((article) => {
              //article = await scrapers.cleanData();
              //console.log("------", article);

              b.sendPhoto(
                ship.id,
                article.image,
                `${article.date}\n<pre>${article.title}</pre>\n<i>Source: <b>${article.source}</b></i>`
              );
              setTimeout(function () {
                b.sendMessage(ship.id, article.body);
              }, 2000);
              //return article;
            });

            //getArticle();
          } else if (body.message.text == `${emoji.radio} BINGO ${emoji.radio}`) {
            log(player, "Playing bingo");
            bingo.getBoard(ship).then((game) => {
              console.log(game);
              b.sendKeyboard(ship.id, `BINGO - ${game.code}`, keyboards.bingo(game.code, game.board));
            }, console.error);
          } else if (body.message.text == `${emoji.slots} Slots ${emoji.slots}`) {
            log(player, "Playing the slots");
            // console.log(keyboards.numbers("", "SL"));
            b.sendKeyboard(ship.id, `Less is more, more or less... How much will you bet?`, keyboards.slots("", "SL"));
          } else if (body.message.text == `/beta`) {
            b.sendKeyboard(ship.id, "Your testing beta features! Things may break", keyboards.beta);
            log(player, "Testing beta features");
          } else if (body.message.text == "\u2693 Dock \u2693") {
            log(player, `Trying to dock`);
            Port.findOne({
              id: ship.location.port,
            }).then(({ id }) => {
              b.exportChatInviteLink(id).then((link) => {
                // b.sendKeyboard(ship.id, link, { inline_keyboard: ["Dock", link] });
                b.sendKeyboard(ship.id, link, keyboards.navigation);
              });
            });
          } else if (body.message.text == "/nav") {
            log(player, "Navigating");
            b.sendKeyboard(
              body.message.chat.id,
              "This is the ship's bridge.\n\nFrom here you can control which port of call you will visit next.",
              keyboards.navigation
            );
          } else if (body.message.text == "/cd") {
            log(player, "Starting a chat with the Cruise Director");
            b.sendMessage(body.message.chat.id, crew("cruiseDirector").conversation());
            ship.selectedCrew = "cruiseDirector";
            ship.save();
          } else if (body.message.text == "\ud83d\udea2 Home Port \ud83d\udea2" || body.message.text == "/addGuest") {
            const newGuest = guest.pick();
            ship.guests.push(newGuest);
            ship.save();
            b.sendKeyboard(
              body.message.chat.id,
              `A ${guest.getType(newGuest.type)} guest just boarded your vessel`,
              keyboards.navigation
            );
          } else if (body.message.text == "\ud83d\udcb0 Treasure \ud83d\udcb0") {
            log(player, "Looking for Treasure");
            globalFunctions.lookForTreasure(ship);
            // Captains Log:
          } else if (body.message.text.substring(0, body.message.text.indexOf(" ")) == "/log") {
            log(player, "Wrote a Capt's log");
            const message = body.message.text.substring(body.message.text.indexOf(" ") + 1);
            b.sendMessage(ship.id, `Captain's Log: ${message}`);
            Ship.findOne({
              id: ship.id,
            }).then((ship) => {
              ship.communication.push({
                date: new Date(),
                type: "log",
                transcript: message,
              });
              ship.save();
            });

            // GIFT SHOP
          } else if (body.message.text.includes("Shop")) {
            log(player, "Entered the gift shop");
            b.sendKeyboard(
              body.message.chat.id,
              "This is the ship's gift shop.\n\nFrom here you can buy trinkets and whositswhatsits that will benefit you in the game",
              keyboards.shop
            );
          } else if (body.message.text == "Products") {
            log(player, "Perusing products in the gift shop");
            Product.find({}).then((products) => {
              b.sendKeyboard(body.message.chat.id, "Buy something.", keyboards.products(products));
            });
          } else if (body.message.text == "\u2388 Capt's Log \u2388") {
            b.sendMessage(
              ship.id,
              "The Captian's Log is a place for you to keep notes or other information. Each entry will be date stamped and displayed below. \nTo create a new entry, type /log followed by your message. \n\neg. /log This is my first Captians Log."
            );
            let logReport = "<b>Captain's Log:</b>\n";
            ship.communication.forEach(({ date, transcript }) => {
              logReport += `${moment(date).format("LL")} | ${transcript}\n\n`;
            });
            log(player, "Viewing the Capt's log");
            setTimeout(() => {
              globalFunctions.partitionMessage(logReport).forEach((element) => {
                setTimeout(() => {
                  b.sendMessage(ship.id, element);
                }, 2000);
              }, 1000);
            });

            // Broadcast
          } else if (body.message.text.substring(0, body.message.text.indexOf(" ")) == "/broadcast") {
            if (ship._id == MYSHIP) {
              broadcast(body.message.text.substring(body.message.text.indexOf(" ") + 1));
            }
          } else if (body.message.text.substring(0, body.message.text.indexOf(" ")) == "/product") {
            if (ship._id == MYSHIP) {
              const product = body.message.text.substring(body.message.text.indexOf(" ") + 1);
              Product.create({
                name: product,
              });
            }
          } else if (body.message.text == "/admin") {
            //if (ship._id == MYSHIP) {
            log(player, "Tinkering in Admin");
            b.sendKeyboard(body.message.chat.id, "Welcome to the admin panel", keyboards.admin);

            //}
          } else if (body.message.text == "/dock") {
            log(player, "Insta-docked... Pretty sure that is cheating.");
            ship.nextLocation.arrival = new Date();
            ship.save();
            b.sendMessage(body.message.chat.id, "Now Docking... Please stand by!");
          } else if (body.message.text == "/removeGuest") {
            const removedGuest = ship.guests.pop();
            ship.save();
            b.sendKeyboard(body.message.chat.id, removedGuest, keyboards.home(ship.nextLocation.port));
          } else if (body.message.text == `${emoji.helm} Bridge ${emoji.helm}`) {
            b.sendKeyboard(
              body.message.chat.id,
              `Welcome to the ship's Bridge, From here you can view all the logs`,
              keyboards.bridge
            );
          } else if (body.message.text == `${emoji.world} Global Logs ${emoji.world}`) {
            b.sendKeyboard(
              body.message.chat.id,
              "Not to be confused with the Captins Log, the Global Logs allow you to view what other ships a currently doing.\n\nhttps://t.me/joinchat/AAAAAEzZL7OHC6BHdyzbLw",
              keyboards.bridge
            );
          } else if (body.message.text == "\ud83d\udc1b BUG \ud83d\udc1b") {
            b.sendKeyboard(
              body.message.chat.id,
              "Oh No!!! A BUG! Quick! Kill it!\n\nGo here to report the bug\n\nhttps://t.me/joinchat/HmxycxY2tSHp_aZX4mQ9QA",
              keyboards.home(ship.nextLocation.port)
            );
          } else if (body.message.text == `${emoji.cocktail} Cocktail ${emoji.cocktail}`) {
            log(player, "Ordered a cocktail. Stay classy baby!");
            mixology.getCocktail().then((cocktail) => {
              b.sendPhoto(
                ship.id,
                cocktail.image,
                `<pre>${cocktail.name}</pre>\n${cocktail.instructions}<code>${cocktail.ingredients.map(
                  (ingredient) => `\n- ${ingredient}`
                )}</code>`
              );
            });
          } else if (body.message.text.includes("Lounge")) {
            log(player, "Entered the lounge.");
            b.sendKeyboard(
              body.message.chat.id,
              "Welcome to the ships cocktail lounge. Stay a while, order a drink.",
              keyboards.lounge
            );
          } else if (body.message.text == "Deposit") {
            log(player, "<b>Wants to deposit money</b>");
            b.sendMessage(
              ship.id,
              `Send BTC to this address: ${BITCOINADDRESS}\n Your BTC will be converted into ${KORONA}\n\nCurrent exchange rate: 0.00001 BTC = ${KORONA}10.00 \n\nRemember, you should look for treasure the next time you are in port.`
            );
          } else if (body.message.text == "\ud83d\udc1b Suggestions \ud83d\udc1b") {
            log(player, "Excuse me... I have a suggestion");
            b.sendKeyboard(
              body.message.chat.id,
              "Got an idea?\n\nGo here to tell us\n\nhttps://t.me/joinchat/HmxycxOCylQHWIDtPsd7pw",
              keyboards.home(ship.nextLocation.port)
            );
          } else if (body.message.text == "\ud83c\udfdd Ports of Call \ud83c\udfdd") {
            log(player, "Deciding where to go next");
            Port.find({
              id: {
                $ne: ship.location.port,
              },
            }).then((ports) => {
              const portsInShipSector = ports.filter(({ location }) => {
                return location.sector === ship.location.sector;
              }).length;
              if (portsInShipSector === 0) {
                const sectors = {};
                ports.forEach(({ location, name }, i, array) => {
                  if (!sectors[location.sector]) sectors[location.sector] = "";
                  sectors[location.sector] += `${name}, `;
                });
                let message = "";
                for (const i in sectors) {
                  sectors[i] = sectors[i].substring(0, sectors[i].length - 2);
                  message += `${globalSectors[i]}: ${sectors[i]}\n`;
                }
                b.sendMessage(
                  body.message.chat.id,
                  `Below are the available continents that you can travel to. The ports of call that you can visit are listed beside the respective continents.\n\n${message}`
                );
                setTimeout(() => {
                  b.sendKeyboard(body.message.chat.id, "Which continent would you like to navigate to:", {
                    inline_keyboard: Object.keys(sectors).map((sector) => {
                      return [
                        {
                          text: globalSectors[sector],
                          callback_data: JSON.stringify({
                            action: "navigate_sector",
                            sector,
                          }),
                        },
                      ];
                    }),
                  });
                }, 5000);
              } else if (portsInShipSector === ports.length) {
                globalFunctions.sendAvailablePorts(body.message.chat.id, ports, ship);
              } else {
                b.sendKeyboard(
                  body.message.chat.id,
                  "A port of call is an intermediate stop for a ship on its sailing itinerary.\n\nWhere would you like to go?",
                  keyboards.ports
                );
              }
            });
          } else if (body.message.text == "Same Continent") {
            Port.find({
              "location.sector": ship.location.sector,
              id: {
                $ne: ship.location.port,
              },
            }).then((ports) => {
              globalFunctions.sendAvailablePorts(body.message.chat.id, ports, ship);
            });
          } else if (body.message.text === "Change Continent") {
            Port.find({
              "location.sector": {
                $ne: ship.location.sector,
              },
            }).then((ports) => {
              const sectors = {};
              ports.forEach(({ location, name }) => {
                if (!sectors[location.sector]) sectors[location.sector] = "";
                sectors[location.sector] += `${name}, `;
              });
              let message = "";
              for (const i in sectors) {
                sectors[i] = sectors[i].substring(0, sectors[i].length - 2);
                message += `${globalSectors[i]}: ${sectors[i]}\n`;
              }
              b.sendMessage(
                body.message.chat.id,
                `Below are the available continents that you can travel to. The ports of call that you can visit are listed beside the respective continents.\n\n${message}`
              );
              setTimeout(() => {
                b.sendKeyboard(body.message.chat.id, "Which continent would you like to navigate to:", {
                  inline_keyboard: Object.keys(sectors).map((sector) => {
                    return [
                      {
                        text: globalSectors[sector],
                        callback_data: JSON.stringify({
                          action: "navigate_sector",
                          sector,
                        }),
                      },
                    ];
                  }),
                });
              }, 5000);
            });
          } else if (body.message.text == "\ud83d\udcb0 Purser \ud83d\udcb0") {
            log(player, "At the Pursers desk.");
            b.sendKeyboard(
              body.message.chat.id,
              `A ship's purser is the person on a ship principally responsible for the handling of money on board.\n\nThe currency is Korona or ${KORONA} for short. \n\nHow may I help you today?`,
              keyboards.purser
            );
          } else if (body.message.text.includes("Casino")) {
            log(player, "Entered the Casino. ");
            b.sendKeyboard(
              body.message.chat.id,
              `A ship's casino is a place where you can spend your ${KORONA} for chance to win.`,
              keyboards.casino
            );
          } else if (body.message.text == "\u2195 Lowest Highest \u2195") {
            log(player, "Playing Lowest-Highest");
            LowestHighest.find({
              jackpotPaid: false,
            }).then(({ length }) => {
              b.sendKeyboard(
                body.message.chat.id,
                `This game cost ${KORONA}5 to play.\nYour current balance is ${KORONA}${
                  ship.purse.balance
                }.\n${KORONA}10 is awarded to the winner.\n\n<pre>INSTRUCTIONS</pre>\nSelect a number higher than your opponent but lower than the House to win.\n\nThe jackpot is awarded to the player which picks the same number as the House.\n\n<code>Current jackpot is ${KORONA}${
                  4 * length
                }</code>`,
                {
                  inline_keyboard: [
                    [
                      {
                        text: `${LOWESTHIGHEST}`,
                        callback_data: JSON.stringify({
                          action: "lowest-highest",
                        }),
                      },
                    ],
                  ],
                }

                //keyboards.decision(LOWESTHIGHEST)
              );
            });
          } else if (body.message.text == `${emoji.cocktail} Mixology ${emoji.cocktail}`) {
            mixology.getFakeCocktail().then((cocktail) => {
              //console.log(cocktail);
              b.sendPhoto(body.message.chat.id, cocktail.image, `<pre>${cocktail.name}</pre>`);
              setTimeout(() => {
                //console.log(keyboards.mixologyIngredients(cocktail.ingredients.concat(cocktail.fakeIngredients)));
                b.sendKeyboard(
                  body.message.chat.id,
                  `Which ingredients are part of ${cocktail.name}`,
                  keyboards.mixologyIngredients(cocktail.ingredients.concat(cocktail.fakeIngredients))
                );
              }, 500);
            });
          } else if (body.message.text == "\ud83d\udc65 Manifest \ud83d\udc65") {
            log(player, "Looking into the ships records.");
            b.sendKeyboard(
              body.message.chat.id,
              "A document giving comprehensive details of a ship and its cargo and other contents, passengers, and crew for the use of customs officers.",
              keyboards.manifest
            );
          } else if (body.message.text == "\ud83d\udc65 Guest Manifest \ud83d\udc65") {
            log(player, "Inspecting the Guest Manifest.");
            b.sendKeyboard(
              body.message.chat.id,
              `<u>The Guest Manifest:</u>\n${globalFunctions.generateManifest(ship.guests)}<pre>Total Guests: ${
                ship.guests.length
              }</pre>\n<code>Total Guest Value: ${ship.guests.reduce((total, guest) => total + guest.purse, 0)}</code>`,
              keyboards.home(ship.nextLocation.port)
            );
          } else if (body.message.text == "\ud83c\udf87 Achievements \ud83c\udf87") {
            log(player, "Looking in the mirror and telling themself.. Man I look good!");
            Ship.findOne({
              id: ship.id,
            })
              .populate("portHistory.port")
              .then(({ portHistory }) => {
                let message = "<b>Your Port History:</b>";
                portHistory.forEach((stop) => {
                  const arrivalDate = moment(stop.arrivalDate);
                  const departureDate = moment(stop.departureDate);
                  message += `\n${stop.port.name} | ${arrivalDate.diff(departureDate, "days")}`;
                });
                b.sendMessage(body.message.chat.id, message);
              });
          } else if (body.message.text == "Port \ud83d\udea2") {
            b.exportChatInviteLink("-1001399879250").then((link) => {
              b.sendMessage(body.message.chat.id, link);
            });
          } else {
            b.sendMessage(body.message.chat.id, crew(ship.selectedCrew).conversation(body.message.text));
          }
        }
        //res.sendStatus(200);
      });
    } else {
      Port.findOne({
        id: body.message.chat.id,
      }).then((port) => {
        if (!port) {
          if (body.message.chat.id == MYSHIP) {
            b.getChat(body.message.chat.id).then((chat) => {
              const newPort = new Port({
                id: body.message.chat.id,
                name: chat.title,
                description: chat.description,
              });
              newPort.save();
            });
          }
        } else {
          if (body.message.text == "/start") {
            //    b.sendMessage(req.body.message.chat.id, welcomeMessage);
            b.sendKeyboard(body.message.chat.id, WELCOME, keyboards.welcome);
          } else if (body.message.text == "/return") {
            if (body.message.chat.id === MIXOLOGYPORT) {
              b.sendKeyboard(body.message.chat.id, "Click Here => @BoozeCruise_bot", keyboards.mixology);
            }
            b.sendKeyboard(body.message.chat.id, "Click Here => @BoozeCruise_bot", keyboards.port);
          } else if (body.message.text == "Return to Ship") {
            b.sendMessage(body.message.chat.id, "Click Here => @BoozeCruise_bot");
            // b.sendKeyboard(req.body.message.chat.id, "@BoozeCruise_bot", keyboards.port);
          } else if (body.message.text == "/kick") {
            //    b.sendMessage(req.body.message.chat.id, welcomeMessage);
            b.kick(body.message.chat.id, body.message.from.id, 1);
            Ship.findOne({
              "user.id": body.message.from.id,
            }).then(({ id }) => {
              b.sendMessage(id, `You've been kicked from ${port.name}`);
            });
          } else if (body.message.new_chat_participant) {
            //PORTENTRY
            Ship.findOne({
              "user.id": body.message.new_chat_participant.id,
            })
              .populate("products.product")
              .then((ship) => {
                const player = ship.user.first_name;
                const perks = ship.products
                  .filter((product) => {
                    //console.log(product);
                    return product.product.perk.code.indexOf("PORTENTRY") === 0 && product.expiry > moment();
                  })
                  .map((product) => product.product.perk);
                port.ships.push(ship._id);
                port.save();
                let newGuests = [];
                const embarkationBoost = perks.reduce((boost, perk) => {
                  boost += perk.code === "PORTENTRY_EMBARKATION" ? perk.amount : 0;
                  return boost > 100 ? 100 : boost;
                }, 0);
                const spaceAvailable = ship.capacity - ship.guests.length;
                const embarkationGuarantee = Math.floor((spaceAvailable * embarkationBoost) / 100);
                let i = Math.floor(Math.random() * (spaceAvailable - embarkationGuarantee)) + embarkationGuarantee;
                while (i--) {
                  newGuests.push(guest.pick());
                }
                let leavingGuests = [];
                i = Math.floor(Math.random() * ship.guests.length);
                while (i--) {
                  leavingGuests.push(ship.guests.splice(Math.floor(Math.random() * ship.guests.length), 1)[0]);
                }
                ship.guests = ship.guests.concat(newGuests);
                let income = 0;
                newGuests.forEach((guest) => {
                  if (guest.type === 0) {
                    income += 1;
                  } else if (guest.type === 1) {
                    income += 2;
                  } else {
                    income += 3;
                  }
                  return income;
                });
                // console.log("INCOME FROM NEW GUESTS =>", income);
                log(player, `Docked in ${port.name}`);
                log(player, `Received ${KORONA}${income} from \n${globalFunctions.generateManifest(newGuests)}`);
                ship.purse.balance += income;

                ship.save();
                let perkMessage = "";
                if (embarkationGuarantee > 0) {
                  perkMessage = `<code>** An additional ${embarkationGuarantee} guests boarded your vessel because of your ${embarkationBoost}% boost.</code>\n\n`;
                }
                b.sendKeyboard(
                  ship.id,
                  `<b>You have just docked in ${
                    port.name
                  }</b>\n\nDebarkation Guest Manifest:\n${globalFunctions.generateManifest(
                    leavingGuests
                  )}\nEmbarkation Guest Manifest:\n${globalFunctions.generateManifest(
                    newGuests
                  )}Income from new guests: ${KORONA}${income}\n\n<i><b>Updated Guest Manifest:</b></i>\n${globalFunctions.generateManifest(
                    ship.guests
                  )}<pre>Total Guests: ${ship.guests.length}\nCapacity: ${ship.capacity}\nBalance: ${KORONA}${
                    ship.purse.balance
                  }</pre>\n\n${perkMessage}`,
                  {
                    inline_keyboard: [
                      [
                        {
                          text: `💰Look for treasure💰`,
                          callback_data: JSON.stringify({
                            action: "treasure",
                          }),
                        },
                      ],
                    ],
                  }
                );
              });
            // you are here bro!
          } else if (body.message.left_chat_participant) {
            Ship.findOne({
              "user.id": body.message.left_chat_participant.id,
            }).then(({ _id }) => {
              port.ships = port.ships.filter((portShip) => {
                return portShip != _id;
              });
              port.save();
            });
          } else {
            Ship.findOne({
              "user.id": body.message.from.id,
            }).then((ship) => {
              let found = false;
              for (const i in port.ships) {
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

// Positive quotes on server restart.
const quotes = [
  "Age is an issue of mind over matter. If you don't mind, it doesn't matter.",
  "Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young. The greatest thing in life is to keep your mind young.",
  "Wrinkles should merely indicate where smiles have been.",
  "True terror is to wake up one morning and discover that your high school class is running the country.",
  "A diplomat is a man who always remembers a woman's birthday but never remembers her age.",
  "As I grow older, I pay less attention to what men say. I just watch what they do.",
  "How incessant and great are the ills with which a prolonged old age is replete.",
  "Old age, believe me, is a good and pleasant thing. It is true you are gently shouldered off the stage, but then you are given such a comfortable front stall as spectator.",
  "Genius is one percent inspiration and ninety-nine percent perspiration.",
  "You can observe a lot just by watching.",
  "A house divided against itself cannot stand.",
  "Difficulties increase the nearer we get to the goal.",
  "Fate is in your hands and no one elses.",
  "Be the chief but never the lord.",
  "Nothing happens unless first we dream.",
  "Well begun is half done.",
  "Life is a learning experience, only if you learn.",
  "Self-complacency is fatal to progress.",
  "Peace comes from within. Do not seek it without.",
  "What you give is what you get.",
  "We can only learn to love by loving.",
  "Life is change. Growth is optional. Choose wisely.",
  "You'll see it when you believe it.",
  "Today is the tomorrow we worried about yesterday.",
  "It's easier to see the mistakes on someone else's paper.",
  "Every man dies. Not every man really lives.",
  "To lead people walk behind them.",
  "Having nothing, nothing can he lose.",
  "Trouble is only opportunity in work clothes.",
  "A rolling stone gathers no moss.",
  "Ideas are the beginning points of all fortunes.",
  "Everything in life is luck.",
  "Doing nothing is better than being busy doing nothing.",
  "Trust yourself. You know more than you think you do.",
  "Study the past, if you would divine the future.",
  "The day is already blessed, find peace within it.",
  "From error to error one discovers the entire truth.",
  "Well done is better than well said.",
  "Bite off more than you can chew, then chew it.",
  "Work out your own salvation. Do not depend on others.",
  "One today is worth two tomorrows.",
  "Once you choose hope, anythings possible.",
  "God always takes the simplest way.",
  "One fails forward toward success.",
];

const randomQuote = (quotes) => {
  let randomNum = Math.floor(Math.random() * quotes.length);
  let output = quotes[randomNum];
  return output;
};

router.get("/", (req, res, next) => {
  b.sendMessage("510423667", "Received Get");
  res.json({
    message: "get ok",
  });
});

// cash articles on restart.
scrapers.cleanData();

b.sendKeyboard("510423667", `${randomQuote(quotes)} \n\n<pre>Also the server restarted</pre>`, keyboards.admin);
// b.sendMessage("-1001473681735", "Server Restarted"); not in use right now
log("Server", "Restart");
module.exports = router;

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
