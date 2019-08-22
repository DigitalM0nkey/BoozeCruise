//image/emoji/Unicode Character varaibles
var map = " \ud83d\uddfa ";
var people = " \ud83d\udc65 ";
var fireworks = " \ud83c\udf87 ";
var moneyBag = " \ud83d\udcb0 ";
var bug = " \ud83d\udc1b ";
var korona = " \u24C0 ";
var mainMenu = "\u2630 Main Menu \u2630";
var navigation = map + 'Navigation' + map;
var upDown = " \u2195 "
module.exports = {
  home: function (seaDay) {
    return {
      keyboard: [
        [{
          'text': navigation
        },
        {
          'text': people + 'Manifest' + people
        }],
        [{
          'text': fireworks + 'Achievements' + fireworks
        },
        {
          'text': moneyBag + 'Casino' + moneyBag
        }],
        seaDay ? [{
          'text': moneyBag + 'Purser' + moneyBag
        }
        ] : [{
          'text': moneyBag + 'Purser' + moneyBag
        },
        {
          'text': moneyBag + 'Treasure' + moneyBag
        }],
        [{
          'text': bug + 'Maintenance' + bug
        }
        ],
      ],
      resize_keyboard: true
    };
  },
  manifest: {
    keyboard: [
      [{
        'text': people + 'Guest Manifest' + people
      },
      {
        'text': '\ud83d\udc81 Crew Manifest \ud83d\udc81'
      }
      ],
      [{
        'text': '\u2630 Main Menu \u2630'
      }]
    ],
    resize_keyboard: true
  },
  maintenance: {
    keyboard: [
      [{
        'text': bug + 'BUG' + bug
      }],
      [{
        'text': bug + 'Suggestions' + bug
      }],
      [{
        'text': '\u2630 Main Menu \u2630'
      }]
    ],
    resize_keyboard: true
  },
  casino: {
    keyboard: [
      [{
        'text': upDown + 'Lowest Highest' + upDown
      }],
      [{
        'text': 'Mixology'
      }],
      [{
        'text': '\u2630 Main Menu \u2630'
      }]
    ],
    resize_keyboard: true
  },
  decision: function (message) {
    return {
      keyboard: [
        [{
          'text': 'Yes\n' + message
        }],
        [{
          'text': 'No'
        }],
        [{
          'text': '\u2630 Main Menu \u2630'
        }]
      ],
      resize_keyboard: true
    }
  },
  atSea: {
    keyboard: [
      [{
        'text': '\ud83d\udccd Current Location \ud83d\udccd'
      },],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
    ],
    resize_keyboard: true
  },
  navigation: {
    keyboard: [
      [{
        'text': '\ud83d\udea2 Home Port \ud83d\udea2'
      },],
      [{
        'text': '\ud83c\udfdd Ports of Call \ud83c\udfdd'
      },],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
    ],
    resize_keyboard: true
  },
  purser: {
    keyboard: [
      [{
        'text': 'Check Balance'
      },],
      [{
        'text': 'Deposit'
      },],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
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
      ],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
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
      ],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
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
      ],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
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
      ],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
    ],
    resize_keyboard: true
  },
  ports: {
    keyboard: [
      [{
        'text': 'Same Continent'
      },
      {
        'text': 'Change Continent'
      },
      ],
      [{
        'text': '\u2630 Main Menu \u2630'
      },]
    ],
    resize_keyboard: true
  },
};
