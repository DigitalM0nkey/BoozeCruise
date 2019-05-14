module.exports = {
  home: function(seaDay) {
    return {
      keyboard: [
        [{
          'text': '\ud83d\uddfa Navigation \ud83d\uddfa'
        }],
        [{
          'text': '\ud83d\udc65 Manifest \ud83d\udc65'
        }],
        [{
          'text': '\ud83c\udf87 Achievements \ud83c\udf87'
        }],
        seaDay ? [{
            'text': '\ud83d\udcb0 Purser \ud83d\udcb0'
          },
          {
            'text': '\ud83d\udc1b BUG \ud83d\udc1b'
          }
        ] : [{
            'text': '\ud83d\udcb0 Purser \ud83d\udcb0'
          },
          {
            'text': '\ud83d\udcb0 Treasure \ud83d\udcb0'
          },
          {
            'text': '\ud83d\udc1b BUG \ud83d\udc1b'
          }
        ],
      ],
      resize_keyboard: true
    };
  },
  manifest: {
    keyboard: [
      [{
          'text': '\ud83d\udc65 Guest Manifest \ud83d\udc65'
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
  atSea: {
    keyboard: [
      [{
        'text': '\ud83d\udccd Current Location \ud83d\udccd'
      }, ],
      [{
        'text': '\u2630 Main Menu \u2630'
      }, ]
    ],
    resize_keyboard: true
  },
  navigation: {
    keyboard: [
      [{
        'text': '\ud83d\udea2 Home Port \ud83d\udea2'
      }, ],
      [{
        'text': '\ud83c\udfdd Ports of Call \ud83c\udfdd'
      }, ],
      [{
        'text': '\u2630 Main Menu \u2630'
      }, ]
    ],
    resize_keyboard: true
  },
  purser: {
    keyboard: [
      [{
        'text': 'Check Balance'
      }, ],
      [{
        'text': 'Deposit'
      }, ],
      [{
        'text': '\u2630 Main Menu \u2630'
      }, ]
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
      }, ]
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
      }, ]
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
      }, ]
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
      }, ]
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
      }, ]
    ],
    resize_keyboard: true
  },
};
