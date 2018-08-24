var router = require('express').Router();
var config = require('../../config');
var TelegramBot = require('../../bots/telegram');
var TOKEN = config.tokens.telegram.BoozeCruise;
var b = new TelegramBot();
b.init(TOKEN).then(function() {
  b.introduceYourself();
  b.deleteWebhook();
  //b.setWebhook('BoozeCruise');
});
router.post('/', function (req, res, next) {
  console.log(req.body.message);
});
module.exports = router;
