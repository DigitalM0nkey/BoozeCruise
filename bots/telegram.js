var request = require('request');
module.exports = function() {
  var bot = this;

  bot.lastMsgId = 69;

  bot.init = function(TOKEN) {
    bot.token = TOKEN;
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/getMe';
      request(url, function (error, r, body) {
        var response = JSON.parse(body).result;
        if(error) return;
        if(!response) return;
        bot.id = response.id || '';
        bot.first_name = response.first_name || '';
        bot.last_name = response.last_name || '';
        bot.username = response.username || '';
        bot.language_code = response.language_code || '';
        resolve();
      });
    });
  };
  bot.deleteWebhook = function(api) {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/deleteWebhook';
      request(url, function (error, r, body) {
        var response = JSON.parse(body).result;
        if(error) return;
        if(!response) return;
        resolve();
      });
    });
  };
  bot.setWebhook = function(api) {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/setWebhook?url=https://boozecruise.punchmonkeyproductions.com/bots/' + api;
      request(url, function (error, r, body) {
        var response = JSON.parse(body).result;
        if(error) return;
        if(!response) return;
        resolve();
      });
    });
  };
  bot.getWebhook = function() {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/getWebhookInfo';
      request(url, function (error, r, body) {
        var response = JSON.parse(body).result;
        if(error) return;
        if(!response) return;
        resolve();
      });
    });
  };

  bot.sendMessage = function(channel, message) {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/sendMessage?chat_id=' + channel + '&disable_notification=true&parse_mode=html&text=' + message;
      request(encodeURI(url), function (error, r, body) {
        var response = JSON.parse(body).result;
        //console.log(response);
        if(error) return;
        if(!response) return;
        resolve();
      });
    });
  };
  bot.sendKeyboard = function(channel, message, keyboard) {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/sendMessage?chat_id=' + channel + '&disable_notification=true&parse_mode=html&text=' + message + '&reply_markup=' + JSON.stringify(keyboard);
      request(encodeURI(url), function (error, r, body) {
        var response = JSON.parse(body).result;
        //console.log(response);
        if(error) return;
        if(!response) return;
        resolve();
      });
    });
  };
  bot.exportChatInviteLink = function(channel) {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/exportChatInviteLink?chat_id=' + channel;
      request(encodeURI(url), function (error, r, body) {
        console.log(body);
        var response = JSON.parse(body).result;
        //console.log(response);
        if(error) return;
        if(!response) return;
        resolve(response);
      });
    });
  };
  bot.getChat = function(channel) {
    return new Promise(function (resolve, reject) {
      var url = 'https://api.telegram.org/bot' + bot.token + '/getChat?chat_id=' + channel;
      request(encodeURI(url), function (error, r, body) {
        var response = JSON.parse(body).result;
        //console.log(response);
        if(error) return;
        if(!response) return;
        resolve(response);
      });
    });
  };
  bot.kick = function(channel, user, minutes) {
    if (!minutes) minutes = 1;
      var date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      date = Math.floor(date / 1000);
      return new Promise(function (resolve, reject) {
        var url = 'https://api.telegram.org/bot' + bot.token + '/kickChatMember?chat_id=' + channel + '&user_id=' + user + '&until_date=' + date;
        request(url, function (error, r, body) {
          if(error) return;
          resolve();
        });
      });
    };
  bot.getName = function() {
    if (bot.last_name) {
      return bot.first_name + ' ' + bot.last_name;
    } else {
      return bot.first_name;
    }
  };

  bot.introduceYourself = function() {
    console.log('Hello, my name is ' + bot.getName() + '. You can talk to me through my username: @' + bot.username);
  };

};
