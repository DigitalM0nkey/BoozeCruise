const emoji = require('./emoji');

module.exports = {
  home: function (seaDay) {
    return {
      keyboard: [
        [{
          'text': emoji.navigation
        },
        {
          'text': emoji.people + 'Manifest' + emoji.people
        }],
        [{
          'text': emoji.fireworks + 'Achievements' + emoji.fireworks
        }, {
          'text': emoji.cocktail + 'Lounge' + emoji.cocktail
        }
        ],
        seaDay ? [
          { 'text': emoji.moneyBag + 'Purser' + emoji.moneyBag },
          { 'text': emoji.moneyBag + 'Casino' + emoji.moneyBag },
          { 'text': emoji.moneyBag + 'Shop' + emoji.moneyBag }
        ] : [
            { 'text': emoji.moneyBag + 'Purser' + emoji.moneyBag },
            { 'text': emoji.moneyBag + 'Treasure' + emoji.moneyBag }
          ],
        [
          { 'text': emoji.bug + 'Maintenance' + emoji.bug },
          { 'text': emoji.helm + "Capt's Log" + emoji.helm }
        ],
      ],
      resize_keyboard: true
    };
  },
  manifest: {
    keyboard: [
      [{
        'text': emoji.people + 'Guest Manifest' + emoji.people
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
  lounge: {
    keyboard: [
      [{
        'text': emoji.cocktail + 'Cocktail' + emoji.cocktail
      }],
      [{
        'text': '\u2630 Main Menu \u2630'
      }]
    ],
    resize_keyboard: true
  },
  shop: {
    keyboard: [
      [{
        'text': "Products"
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
        'text': emoji.bug + 'BUG' + emoji.bug
      }],
      [{
        'text': emoji.bug + 'Suggestions' + emoji.bug
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
        'text': emoji.upDown + 'Lowest Highest' + emoji.upDown
      }],
      [{
        'text': emoji.cocktail + 'Mixology' + emoji.cocktail
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
          'text': 'Yes,\n' + message
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
        'text': emoji.anchor + 'Dock' + emoji.anchor
      },],
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
  numbers: function (gameId) {
    let keyboard = { inline_keyboard: [] };
    for (let i = 0; i < 20; i++) {
      keyboard.inline_keyboard.push([]);
      for (let j = 1; j <= 5; j++) {
        keyboard.inline_keyboard[keyboard.inline_keyboard.length - 1].push({
          text: i * 5 + j,
          callback_data: JSON.stringify({
            action: "LH_" + gameId,
            num: i * 5 + j
          })
        });
      }
    }
    return keyboard;
  },
  // PRODUCT KEYBOARD
  products: function (products) {
    let keyboard = { inline_keyboard: [] };
    for (let i = 0; i < products.length; i++) {
      keyboard.inline_keyboard.push([]);
      keyboard.inline_keyboard[keyboard.inline_keyboard.length - 1].push({
        text: products[i].name,
        callback_data: JSON.stringify({
          action: "product",
          product: products[i]._id
        })
      });

    }
    return keyboard;
  },
  product: function (product) {
    return {
      inline_keyboard: [
        [{
          'text': 'BUY',
          callback_data: JSON.stringify({
            action: "buy",
            id: product._id
          })
        }
          // {
          //   'text': 'SELL',
          //   callback_data: JSON.stringify({
          //     action: "sell",
          //     id: product._id
          //   })
          // },
        ]
      ]
    }

  }
};
