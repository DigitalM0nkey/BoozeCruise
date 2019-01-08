var router = require('express').Router();
var schedule = require('node-schedule');
var config = require('../../config');
var TelegramBot = require('../../bots/telegram');
var keyboards = require('../../constants/keyboards')
var TOKEN = config.tokens.telegram.BoozeCruise;
var HSECTORS = 3;
var VSECTORS = 2;
var Port = require('../../models/port');
var Ship = require('../../models/ship');
var guest = require('../../types/guest');
//console.log(Chat)
var b = new TelegramBot();
b.init(TOKEN).then(function() {
  b.introduceYourself();
  //b.deleteWebhook();
  b.setWebhook('BoozeCruise');
});

console.log(guest.pick());

//var dailyEvent = schedule.scheduleJob('30 * * * * *', function(){
var dailyEvent = schedule.scheduleJob('0 0 8 * * *', function() {
  console.log('The answer to life, the universe, and everything!');
  var randomEvent = events[Math.floor(Math.random() * events.length)]
  Ship.find({})
    .then(function(ships) {
      ships.forEach(function(ship) {
        b.sendKeyboard(ship.id, '<b>' + randomEvent.name + '</b> - ' + randomEvent.description, randomEvent.keyboard)
      });
    });
});

// Global Variables

var events = [{
    name: "Embarcation / Debarcation Day",
    description: "<b>Your Cruise is over.</b> Your current Guests will disembark your ship this morning, bringing with them stories from their cruise, the happier they are, the more more likley they will cruise again and the more likley they will tell their friends to cruise. Guests that have had a negitive experence are not likley to cruise again and are more than likley to discourage future guests from cruising. Use the time that your ship has no guests, to clean it and prepare it for the next cruise, which departs tonight.",
    keyboard: keyboards.event1
  },
  {
    name: "Deck Party",
    description: "It's party time.",
    keyboard: keyboards.event2
  },
  {
    name: "Formal Night",
    description: "Put on your glad rags and do your hair because tonight is formal night. That means it steak and lobster in the main dining room and a las Vegas style show in the Show Lounge.",
    keyboard: keyboards.event3
  },
  {
    name: "Sea Day",
    description: "<b>Look around.... Nothing but ocean.</b> That doesn't mean there is nothing to do, the Cruise Director has orginazed a bunch of activties for your guests to take part in. activties include: The Men's Hairy Chest Competition, BINGO, Scavenger Hunt, etc",
    keyboard: keyboards.event4
  },
  {
    name: "Port Day",
    description: "It's time to get off the ship and explore these strange and wonderful lands",
    keyboard: keyboards.home
  },
  {
    name: "Hurricane",
    description: "This is your Captin speaking.... Due to some severe weather patterns, we will unfortunately be skipping our next port of call.",
    keyboard: keyboards.home
  },
  {
    name: "Booze Cruise Update #1",
    description: "Have you noticed anything different with Booze Cruise? Probly not ",
    keyboard: keyboards.home
  },
];

// Moves

var moves = {
  cocktailLounge: {
    guests: function() {
      guest.pick();
    }
  },
}

//b.exportChatInviteLink('')


// This post is everytime someone says something to the bot.

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (parseInt(req.body.message.chat.id) > 0) {
    Ship.findOne({
        id: req.body.message.chat.id
      })
      .then(function(ship) {
        console.log(ship);
        if (!ship) {
          var newShip = new Ship({
            id: req.body.message.chat.id,
            user: {
              id: req.body.message.from.id,
              first_name: req.body.message.from.first_name,
              last_name: req.body.message.from.last_name,
              username: req.body.message.from.username,
            }
          });
          newShip.save();
        } else {

if (req.body.callback_query) {
    var data = JSON.parse(req.body.callback_query.data);
    if (data.action === 'navigate') {
      console.log(data);
    }
    return res.sendStatus(200);

  } else if (req.body.message.text == "/start") {
            //    b.sendMessage(req.body.message.chat.id, 'Welcome To Booze Cruise!\nWhere would you like to go?');
            b.sendKeyboard(req.body.message.chat.id, "Welcome To Booze Cruise!\nWhere would you like to go?", keyboards.home);
          } else if (req.body.message.text == "/addGuest") {
            var newGuest = guest.pick()
            ship.guests.push({
              type: newGuest
            });
            ship.save();
            b.sendKeyboard(req.body.message.chat.id, newGuest, keyboards.home);
          } else if (req.body.message.text == "/removeGuest") {
            var removedGuest = ship.guests.pop();
            ship.save();
            b.sendKeyboard(req.body.message.chat.id, removedGuest, keyboards.home);
          }else if (req.body.message.text == 'Ports') {
            b.sendKeyboard(req.body.message.chat.id, "Which Continent?", keyboards.ports);
          console.log(keyboards.ports);
          }else if (req.body.message.text == 'Same Continent') {
            Port.find({
              "location.sector": ship.location.sector
            }).then(function(ports){
              sendAvailablePorts(req.body.message.chat.id, ports, ship);
            })
          } else if (req.body.message.text == 'The City \ud83c\udf06') {
            b.sendKeyboard(req.body.message.chat.id, "Welcome To The City", {
              keyboard: [
                [{
                  'text': 'Good \ud83d\udc4d'
                }, ]
              ],
              resize_keyboard: true
            });
          } else if (req.body.message.text == 'Cocktail Lounge \ud83c\udf78') {
            b.sendKeyboard(req.body.message.chat.id, "Welcome To The Cocktail Lounge", {
              keyboard: [
                [{
                    'text': 'Cat \ud83d\udc08'
                  },
                  {
                    'text': 'Guest List \ud83d\udcc4'
                  },
                ]
              ],
              resize_keyboard: true
            });
          } else if (req.body.message.text == 'Achievements \ud83c\udf87') {
            b.sendKeyboard(req.body.message.chat.id, "Welcome To Achievements", {
              keyboard: [
                [{
                  'text': 'Bad \ud83d\udc4e'
                }, ]
              ],
              resize_keyboard: true
            });
          } else if (req.body.message.text == 'Guest List \ud83d\udcc4') {
            b.sendKeyboard(req.body.message.chat.id, "The Guest Manifest: " + ship.guests, keyboards.home);
          } else if (req.body.message.text == 'Port \ud83d\udea2') {
            console.log("log here");
            b.exportChatInviteLink('-1001399879250').then(function(link) {
              console.log(link);
              b.sendMessage(req.body.message.chat.id, link);
            });
          }
        }
        res.sendStatus(200);
      })
  } else {
    console.log("here");
    Port.findOne({
        id: req.body.message.chat.id
      })
      .then(function(port) {
          console.log(port);
          if (!port) {
            b.getChat(req.body.message.chat.id).then(function(chat){
              console.log(chat);
              var newPort = new Port({
                id: req.body.message.chat.id,
                name: chat.title,
              });
              newPort.save();
            })

          } else {
            if (req.body.message.text == "/start") {
              //    b.sendMessage(req.body.message.chat.id, 'Welcome To Booze Cruise!\nWhere would you like to go?');
              b.sendKeyboard(req.body.message.chat.id, "Welcome To Booze Cruise!\nWhere would you like to go?", keyboards.home);
            } else if (req.body.message.text == "/kick") {
              //    b.sendMessage(req.body.message.chat.id, 'Welcome To Booze Cruise!\nWhere would you like to go?');
              b.kick(req.body.message.chat.id,req.body.message.from.id,1);
              Ship.findOne({
                "user.id": req.body.message.from.id
              }).then(function(ship) {
                b.sendMessage(ship.id,"You've been kicked from " + port.name)
              })
            }
            else if (req.body.message.new_chat_participant) {
              Ship.findOne({
                "user.id": req.body.message.new_chat_participant.id
              }).then(function(ship) {
                port.ships.push(ship._id)
                port.save()
              })

            } else if (req.body.message.left_chat_participant) {
              Ship.findOne({
                "user.id": req.body.message.left_chat_participant.id
              }).then(function(ship) {
                port.ships = port.ships.filter(function(portShip) {
                  return portShip != ship._id;
                })
                port.save()
              })
            }else {
              Ship.findOne({
                "user.id": req.body.message.from.id
              }).then(function(ship) {
                var found=false;
                for (var i in port.ships){
                  if (port.ships[i] == ship._id){
                    found=true;
                    break;
                  }
                }
                if (!found){
                  port.ships.push(ship._id)
                  port.save()
                }
                ship.location = port.location;
                ship.save();
              })

            }


          }
        });
        res.sendStatus(200);
      }





});


router.get('/', function(req, res, next) {
  b.sendMessage('510423667', 'Received Get');
  res.json({
    message: 'get ok'
  });
});
b.sendKeyboard('510423667', 'Server Restarted',keyboards.home);

module.exports = router;

function calculateDistance(portLocation, shipLocation){
  if (portLocation.sector===shipLocation.sector){
    var distance= Math.abs(portLocation.x-shipLocation.x)+Math.abs(portLocation.y-shipLocation.y);
    return distance?distance*12:6;
  } else {
    var portSector={
      x:portLocation.sector % HSECTORS,
      y:Math.floor(portLocation.sector / VSECTORS)
    };
    var shipSector={
      x:shipLocation.sector % HSECTORS,
      y:Math.floor(shipLocation.sector / VSECTORS)
    };
    var x = Math.abs(portSector.x-shipSector.x)>HSECTORS-Math.abs(portSector.x-shipSector.x)?HSECTORS-Math.abs(portSector.x-shipSector.x):Math.abs(portSector.x-shipSector.x);
    var y = Math.abs(portSector.y-shipSector.y)>VSECTORS-Math.abs(portSector.y-shipSector.y)?VSECTORS-Math.abs(portSector.y-shipSector.y):Math.abs(portSector.y-shipSector.y);
    return (x+y)*24;
  }
}

function sendAvailablePorts(chat_id, ports, ship) {
b.sendMessage(chat_id, ports.reduce(function(message, port){
  message += '<b>' + port.name + "</b>\n";
  message += "Distance to port <b>" + calculateDistance(port.location, ship.location) + "</b> hours\n"
  message += "Ships in port <b>" + port.ships.length + "</b>\n\n"
  return message;
}, ''));
setTimeout(function(){
  b.sendKeyboard(chat_id, "Navigate to:", {
    inline_keyboard: [ports.map(function(port){
      return {
        'text':port.name,
        'callback_data': JSON.stringify({
          action:"navigate",
          port:port.id,
          ship:ship.id,
        })
      }
    })]
  });
}, 1000)

}
