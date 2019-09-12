
const moment = require("moment");

var HSECTORS = 4;
var VSECTORS = 3;
var TelegramBot = require('../bots/telegram');
var b = TelegramBot.boozecruiseBot;


exports.calculateTime = (arrival) => {
  return Math.abs(moment().diff(arrival, 'hours')) + " hours " + Math.abs(moment().diff(arrival, 'minutes') % 60) + " minutes";
}
function calculateDistance(portLocation, shipLocation) {
  if (portLocation.sector === shipLocation.sector) {
    var distance = Math.abs(portLocation.x - shipLocation.x) + Math.abs(portLocation.y - shipLocation.y);
    return (distance + 1) * 3;
  } else {
    var portSector = {
      x: portLocation.sector % HSECTORS,
      y: Math.floor(portLocation.sector / HSECTORS)
    };
    var shipSector = {
      x: shipLocation.sector % HSECTORS,
      y: Math.floor(shipLocation.sector / HSECTORS)
    };
    var x = Math.abs(portSector.x - shipSector.x) > HSECTORS - Math.abs(portSector.x - shipSector.x) ? HSECTORS - Math.abs(portSector.x - shipSector.x) : Math.abs(portSector.x - shipSector.x);
    var y = Math.abs(portSector.y - shipSector.y) > VSECTORS - Math.abs(portSector.y - shipSector.y) ? VSECTORS - Math.abs(portSector.y - shipSector.y) : Math.abs(portSector.y - shipSector.y);
    return Math.abs((x + y) * 24);
  }
}

exports.calculateDistance = calculateDistance;

exports.sendAvailablePorts = (chat_id, ports, ship) => {
  b.sendMessage(chat_id, ports.reduce(function (message, port) {
    message += '<b>' + port.name + "</b>\n";
    message += port.description + "\n\n";
    message += "Distance to port <b>" + calculateDistance(port.location, ship.location) + "</b> hours\n";
    message += "Ships in port <b>" + port.ships.length + "</b>\n\n";
    return message;
  }, ''));
  setTimeout(function () {
    var keyboard = ports.map(function (port) {
      return {
        'text': port.name,
        'callback_data': JSON.stringify({
          action: "navigate",
          port: port.id,
          ship: ship.id,
        })
      };
    });
    console.log(keyboard);
    b.sendKeyboard(chat_id, "Navigate to:", {
      inline_keyboard: [keyboard]
    });
  }, 3000);

}