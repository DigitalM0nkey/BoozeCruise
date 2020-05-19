const moment = require("moment");
const guest = require("../types/guest");
const keyboards = require("./keyboards");

var HSECTORS = 4;
var VSECTORS = 3;
var TelegramBot = require("../bots/telegram");
var b = TelegramBot.boozecruiseBot;
const TREASURE = 500;

const Port = require("../models/port");

exports.calculateTime = (arrival) => {
  return (
    Math.abs(moment().diff(arrival, "hours")) +
    " hours " +
    Math.abs(moment().diff(arrival, "minutes") % 60) +
    " minutes"
  );
};

function calculateDistance(portLocation, shipLocation) {
  if (portLocation.sector === shipLocation.sector) {
    var distance = Math.abs(portLocation.x - shipLocation.x) + Math.abs(portLocation.y - shipLocation.y);
    return (distance + 1) * 3;
  } else {
    var portSector = {
      x: portLocation.sector % HSECTORS,
      y: Math.floor(portLocation.sector / HSECTORS),
    };
    var shipSector = {
      x: shipLocation.sector % HSECTORS,
      y: Math.floor(shipLocation.sector / HSECTORS),
    };
    var x =
      Math.abs(portSector.x - shipSector.x) > HSECTORS - Math.abs(portSector.x - shipSector.x)
        ? HSECTORS - Math.abs(portSector.x - shipSector.x)
        : Math.abs(portSector.x - shipSector.x);
    var y =
      Math.abs(portSector.y - shipSector.y) > VSECTORS - Math.abs(portSector.y - shipSector.y)
        ? VSECTORS - Math.abs(portSector.y - shipSector.y)
        : Math.abs(portSector.y - shipSector.y);
    return Math.abs((x + y) * 24);
  }
}

exports.calculateDistance = calculateDistance;

exports.sendAvailablePorts = (chat_id, ports, ship) => {
  b.sendMessage(
    chat_id,
    ports.reduce(function (message, port) {
      message += "<b>" + port.name + "</b>\n";
      message += port.description + "\n\n";
      message += "Distance to port <b>" + calculateDistance(port.location, ship.location) + "</b> hours\n";
      message += "Ships in port <b>" + port.ships.length + "</b>\n\n";
      return message;
    }, "")
  );
  setTimeout(function () {
    var keyboard = ports.map(function (port) {
      return {
        text: port.name,
        callback_data: JSON.stringify({
          action: "navigate",
          port: port.id,
          ship: ship.id,
        }),
      };
    });
    //console.log(keyboard);
    b.sendKeyboard(chat_id, "Navigate to:", {
      inline_keyboard: [keyboard],
    });
  }, 3000);
};

exports.generateManifest = (guests) => {
  const guestList = {};
  guests.forEach(({ type }) => {
    if (!guestList[type]) {
      guestList[type] = 0;
    }
    guestList[type]++;
  });
  let message = "";
  for (const i in guestList) {
    message += `${guest.getType(i)}: ${guestList[i]}\n`;
  }
  return message;
};

exports.log = (user, action) => {
  return b.sendMessage("-1001289301939", `${user}: ${action}`);
};

exports.lookForTreasure = (ship) => {
  b.getChatMember(ship.location.port, ship.id).then(
    (chatMember) => {
      Port.findOne({
        id: ship.location.port,
        treasure: {
          $gt: 0,
        },
      }).then((port) => {
        if (port) {
          b.sendKeyboard(
            ship.id,
            `You found ${port.treasure} Korona in the buried treasure`,
            keyboards.home(ship.nextLocation.port)
          );
          b.sendMessage(port.id, `${ship.user.first_name} just found ${port.treasure} Korona here.`);
          ship.purse.balance += port.treasure;
          ship.purse.transactions.push({
            date: new Date(),
            type: "Treasure",
            amount: port.treasure,
          });
          ship.save();
          port.treasure = 0;
          port.save();
          Port.find({
            id: {
              $ne: ship.location.port,
            },
          }).then((ports) => {
            const randomPort = Math.floor(Math.random() * ports.length);
            ports[randomPort].treasure = Math.round(Math.random() * TREASURE + 1);
            ports[randomPort].save();
          });
        } else {
          b.sendKeyboard(ship.id, "No treasure here, keep searching", keyboards.home(ship.nextLocation.port));
        }
      });
    },
    () => {
      b.exportChatInviteLink(ship.location.port).then((link) => {
        b.sendMessage(
          ship.id,
          `You have arrived in port. However, you have not docked, you can only search for treasure once you have docked in port.\n${link}`
        );
      });
    }
  );
};
