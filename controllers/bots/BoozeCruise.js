var router = require('express').Router();
var config = require('../../config');
var TelegramBot = require('../../bots/telegram');
var TOKEN = config.tokens.telegram.BoozeCruise;
var b = new TelegramBot();
b.init(TOKEN).then(function() {
  b.introduceYourself();
  //b.deleteWebhook();
  b.setWebhook('BoozeCruise');
});

var keyboards = {
  home: {
      keyboard: [[
        { 'text': 'Cocktail Lounge \ud83c\udf78'},
        { 'text': 'The City \ud83c\udf06'},
        { 'text': 'Achievements \ud83c\udf87'},
      ]],
      resize_keyboard:true
  }
}

router.post('/', function (req, res, next) {
  console.log(req.body);
  if (req.body.message.text == "/start") {
//    b.sendMessage(req.body.message.chat.id, 'Welcome To Booze Cruise!\nWhere would you like to go?');
    b.sendKeyboard(req.body.message.chat.id, "Welcome To Booze Cruise!\nWhere would you like to go?", keyboards.home);
  }
if (req.body.message.text == 'The City \ud83c\udf06' ) {
  b.sendKeyboard(req.body.message.chat.id, "Welcome To The City", {
      keyboard: [[
        { 'text': 'Good \ud83d\udc4d'},
      ]],
      resize_keyboard:true
  });
} else if (req.body.message.text == 'Cocktail Lounge \ud83c\udf78') {
  b.sendKeyboard(req.body.message.chat.id, "Welcome To The Cocktail Lounge", {
      keyboard: [[
        { 'text': 'Cat \ud83d\udc08'},
      ]],
      resize_keyboard:true
  });
} else if (req.body.message.text == 'Achievements \ud83c\udf87') {
  b.sendKeyboard(req.body.message.chat.id, "Welcome To Achievements", {
      keyboard: [[
        { 'text': 'Bad \ud83d\udc4e'},
      ]],
      resize_keyboard:true
  });
}
  res.sendStatus(200);
});
router.get('/', function (req, res, next) {
  b.sendMessage('510423667', 'Received Get');
  res.json({ message: 'get ok'});
});
b.sendKeyboard('510423667', 'test', {
    keyboard: [[
      { 'text': 'Good \ud83d\udc4d'},
      { 'text': 'Bad \ud83d\udc4e'},
      { 'text': 'Cat \ud83d\udc08'},
    ]],
    resize_keyboard:true
});
module.exports = router;
