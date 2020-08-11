const request = require("request");
require("dotenv").config();

function TelegramBot() {
  const bot = this;

  bot.lastMsgId = 69;

  bot.notifyAdmin = (message) => {
    bot.sendMessage("510423667", message);
  };

  bot.init = (TOKEN) => {
    bot.token = TOKEN;
    return new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/getMe`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        if (error) return;
        if (!response) return;
        bot.id = response.id || "";
        bot.first_name = response.first_name || "";
        bot.last_name = response.last_name || "";
        bot.username = response.username || "";
        bot.language_code = response.language_code || "";
        resolve();
      });
    });
  };
  bot.deleteWebhook = (api) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/deleteWebhook`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        if (error) return;
        if (!response) return;
        resolve();
      });
    });
  bot.getChatMember = (chat_id, user_id) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/getChatMember?chat_id=${chat_id}&user_id=${user_id}`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        console.log(response);
        if (error) return;
        if (!response) return reject();
        if (response.status == "restricted" || response.status == "left" || response.status == "kicked")
          return reject();
        resolve(response);
      });
    });
  bot.setWebhook = (api) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/setWebhook?url=https://booze-cruise.herokuapp.com/bots/${api}`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        if (error) return;
        if (!response) return;
        resolve();
      });
    });
  bot.getWebhook = () =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/getWebhookInfo`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        if (error) return;
        if (!response) return;
        resolve();
      });
    });
  bot.sendPhoto = (channel, photo, caption) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${
        bot.token
      }/sendPhoto?chat_id=${channel}&disable_notification=true&parse_mode=html&photo=${encodeURIComponent(
        photo
      )}&caption=${encodeURIComponent(caption)}`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        //console.log(response);
        if (error) return;
        if (!response) return;
        resolve();
      });
    });
  bot.sendMessage = (channel, message) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${
        bot.token
      }/sendMessage?chat_id=${channel}&disable_notification=true&parse_mode=html&text=${encodeURIComponent(message)}`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        if (error) return;
        if (!response) return;
        resolve(response.message_id);
      });
    });

  bot.editMessageText = (channel, messageID, message) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${
        bot.token
      }/editMessageText?chat_id=${channel}&message_id=${messageID}&parse_mode=html&text=${encodeURIComponent(message)}`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        //console.log(response);
        if (error) return;
        if (!response) return;
        resolve();
      });
    });

  bot.editMessageMedia = (channel, messageID, media, reply_markup) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${
        bot.token
      }/editMessageMedia?chat_id=${channel}&message_id=${messageID}&parse_mode=html&text=${encodeURIComponent(media)}`;
      request(url, (error, r, body) => {
        const response = JSON.parse(body).result;
        //console.log(response);
        if (error) return;
        if (!response) return;
        resolve();
      });
    });

  bot.broadcast = (channels, message) => Promise.all(channels.map((channel) => bot.sendMessage(channel, message)));

  bot.answerCallback = (callback_query_id, text) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/answerCallbackQuery?callback_query_id=${callback_query_id}&text=${text}`;
      request(encodeURI(url), (error, r, body) => {
        if (error) return;
        resolve();
      });
    });

  bot.sendKeyboard = (channel, message, keyboard) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${
        bot.token
      }/sendMessage?chat_id=${channel}&disable_notification=true&parse_mode=html&text=${message}&reply_markup=${JSON.stringify(
        keyboard
      )}`; // this line need to be parsed for mixology to function correctly. ( .replace(/[^\w\s]/gi,"")  )
      request(encodeURI(url), (error, r, body) => {
        const response = JSON.parse(body).result;
        console.log(keyboard);
        console.log(JSON.parse(body));
        if (error) reject(error);
        if (!response) reject("No response");
        resolve(`Keyboard sent to ${channel}`);
      });
    });

  bot.broadcastKeyboard = (channels, message, keyboard) =>
    Promise.all(channels.map((channel) => bot.sendKeyboard(channel, message, keyboard)));

  bot.exportChatInviteLink = (channel) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/exportChatInviteLink?chat_id=${channel}`;
      request(encodeURI(url), (error, r, body) => {
        if (error) reject(error);
        const response = JSON.parse(body);
        if (!response || !response.ok || !response.result) reject(response);
        resolve(response.result);
      });
    });
  bot.getChat = (channel) =>
    new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/getChat?chat_id=${channel}`;
      request(encodeURI(url), (error, r, body) => {
        const response = JSON.parse(body).result;
        //console.log(response);
        if (error) return;
        if (!response) return;
        resolve(response);
      });
    });
  bot.kick = (channel, user, minutes) => {
    if (!minutes) minutes = 1;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    date = Math.floor(date / 1000);
    return new Promise((resolve, reject) => {
      const url = `https://api.telegram.org/bot${bot.token}/kickChatMember?chat_id=${channel}&user_id=${user}&until_date=${date}`;
      request(url, (error, r, body) => {
        if (error) return;
        resolve();
      });
    });
  };
  bot.getName = () => {
    if (bot.last_name) {
      return `${bot.first_name} ${bot.last_name}`;
    } else {
      return bot.first_name;
    }
  };

  bot.introduceYourself = () => {
    console.log(`Hello, my name is ${bot.getName()}. You can talk to me through my username: @${bot.username}`);
  };
}

const boozecruiseBot = new TelegramBot();
boozecruiseBot.init(process.env.BOOZECRUISE).then(() => {
  boozecruiseBot.introduceYourself();
  //b.deleteWebhook();
  boozecruiseBot.setWebhook("BoozeCruise");
});

exports.boozecruiseBot = boozecruiseBot;
