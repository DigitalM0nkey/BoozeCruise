var router = require('express').Router();
var schedule = require('node-schedule');
var config = require('../../config');
var TelegramBot = require('../../bots/telegram');
var TOKEN = config.tokens.telegram.BoozeCruise;
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
var dailyEvent = schedule.scheduleJob('0 0 7 * * *', function() {
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

var keyboards = {
  home: {
    keyboard: [
      [{
          'text': 'Cocktail Lounge \ud83c\udf78'
        },
        {
          'text': 'The City \ud83c\udf06'
        },
        {
          'text': 'Achievements \ud83c\udf87'
        },
        {
          'text': 'Port \ud83d\udea2'
        },
      ]
    ],
    resize_keyboard: true
  },
  event1: {
    keyboard: [
      [{
          'text': 'Debarcation \ud83c\udf05'
        },
        {
          'text': 'Clean \ud83d\udc4b'
        },
        {
          'text': 'Embarcation \ud83d\udea2'
        },
      ]
    ],
    resize_keyboard: true
  },
  event2: {
    keyboard: [
      [{
          'text': 'rando1 \ud83c\udf78'
        },
        {
          'text': 'rando2 \ud83c\udf06'
        },
        {
          'text': 'rando3 \ud83c\udf87'
        },
      ]
    ],
    resize_keyboard: true
  },
  event3: {
    keyboard: [
      [{
          'text': 'hjbsfd Lounge \ud83c\udf78'
        },
        {
          'text': 'The fdsggCity \ud83c\udf06'
        },
        {
          'text': 'Achfgdgfdievements \ud83c\udf87'
        },
      ]
    ],
    resize_keyboard: true
  },
  event4: {
    keyboard: [
      [{
          'text': 'rando4 \ud83c\udf78'
        },
        {
          'text': 'rando4 \ud83c\udf06'
        },
        {
          'text': 'rando4 \ud83c\udf87'
        },
      ]
    ],
    resize_keyboard: true
  },
}
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
    name: "Man Over Board",
    description: "Turn the ship around because someone just fell overboard",
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
            user:{
              id:req.body.message.from.id,
              first_name:req.body.message.from.first_name,
              last_name:req.body.message.from.last_name,
              username:req.body.message.from.username,
            }
          });
          newShip.save();
        } else {
          if (req.body.message.text == "/start") {
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
            b.exportChatInviteLink('-265955522').then(function(link) {
              console.log(link);
              b.sendMessage (req.body.message.chat.id, link);
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
          var newPort = new Port({
            id: req.body.message.chat.id
          });
          newPort.save();
        } else {
          if (req.body.message.text == "/start") {
            //    b.sendMessage(req.body.message.chat.id, 'Welcome To Booze Cruise!\nWhere would you like to go?');
            b.sendKeyboard(req.body.message.chat.id, "Welcome To Booze Cruise!\nWhere would you like to go?", keyboards.home);
          }
        }
        res.sendStatus(200);
      });
  }




});


router.get('/', function(req, res, next) {
  b.sendMessage('510423667', 'Received Get');
  res.json({
    message: 'get ok'
  });
});
b.sendKeyboard('510423667', 'Server Restarted', {
  keyboard: [
    [{
        'text': 'Good \ud83d\udc4d'
      },
      {
        'text': 'Bad \ud83d\udc4e'
      },
      {
        'text': 'Cat \ud83d\udc08'
      },
    ]
  ],
  resize_keyboard: true
});
module.exports = router;
