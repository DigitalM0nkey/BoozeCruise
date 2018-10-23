var router = require('express').Router();
var schedule = require('node-schedule');
var config = require('../../config');
var TelegramBot = require('../../bots/telegram');
var TOKEN = config.tokens.telegram.BoozeCruise;
var Chat = require('../../models/chat');
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
var dailyEvent = schedule.scheduleJob('0 0 0 * * *', function() {
  console.log('The answer to life, the universe, and everything!');
  var randomEvent = events[Math.floor(Math.random() * events.length)]
  Chat.find({})
    .then(function(chats) {
      chats.forEach(function(chat) {
        b.sendKeyboard(chat.id, '<b>' + randomEvent.name + '</b> - ' + randomEvent.description, randomEvent.keyboard)
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
  }
}
var events = [{
    name: "Event 1",
    description: "this is a description",
    keyboard: keyboards.home
  },
  {
    name: "Event 2",
    keyboard: keyboards.event2
  },
  {
    name: "Event 3",
    keyboard: keyboards.event3
  },
  {
    name: "Event 4",
    keyboard: keyboards.event4
  },
  {
    name: "Event 5",
    keyboard: keyboards.home
  },
  {
    name: "Event 6",
    keyboard: keyboards.home
  },
  {
    name: "Event 7",
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

// This post is everytime someone says something to the bot.

router.post('/', function(req, res, next) {
  console.log(req.body);
  Chat.findOne({
      id: req.body.message.chat.id
    })
    .then(function(chat) {
      console.log(chat);
      if (!chat) {
        var newChat = new Chat({
          id: req.body.message.chat.id
        });
        newChat.save();
      } else {
        if (req.body.message.text == "/start") {
          //    b.sendMessage(req.body.message.chat.id, 'Welcome To Booze Cruise!\nWhere would you like to go?');
          b.sendKeyboard(req.body.message.chat.id, "Welcome To Booze Cruise!\nWhere would you like to go?", keyboards.home);
        } else if (req.body.message.text == "/addGuest") {
          var newGuest = guest.pick()
          chat.guests.push({
            type: newGuest
          });
          chat.save();
          b.sendKeyboard(req.body.message.chat.id, newGuest, keyboards.home);
        } else if (req.body.message.text == "/removeGuest") {
          var removedGuest = chat.guests.pop();
          chat.save();
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
          b.sendKeyboard(req.body.message.chat.id, "The Guest Manifest: " + chat.guests, keyboards.home);
        }
      }
      res.sendStatus(200);
    })



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
