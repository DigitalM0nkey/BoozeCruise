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
router.post('/', function (req, res, next) {
  console.log(req.body);
  if (req.body.message.text == "/start") {
    b.sendKeyboard(req.body.message.chat.id,'Welcome. Where do you want to go?', {
        keyboard: [[
          { 'text': 'Coctail Lounge \ud83c\udf78'},
          { 'text': 'The City \ud83c\udf06'},
          { 'text': 'Achievements \ud83c\udf87'},
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
