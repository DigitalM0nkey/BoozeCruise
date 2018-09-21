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
  console.log(req.body.message);
  res.sendStatus(200);
});
router.get('/', function (req, res, next) {
  b.sendMessage('510423667', 'Received Get');
  res.json({ message: 'get ok'});
});
b.sendKeyboard('510423667', 'test', {
  //reply_to_message_id: '32936',
  //reply_markup: {
    keyboard: [[
      { 'text': '\ud83d\udc4d'},
      { 'text': '\ud83d\udc4e'}
    ]]
  //}
});
module.exports = router;
