const emoji = require("./emoji");
const _ = require("underscore");

const colors = {
  RED: "🔴",
  YELLOW: "🟡",
  GREEN: "🟢",
};

module.exports = {
  home: function (seaDay) {
    return {
      keyboard: [
        [{ text: `${emoji.helm} Bridge ${emoji.helm}` }],
        seaDay
          ? [
              {
                text: emoji.cocktail + "Lounge" + emoji.cocktail,
              },

              { text: emoji.joker + "Casino" + emoji.joker },
              // { text: emoji.gift + "Shop" + emoji.gift },
            ]
          : [
              {
                text: emoji.cocktail + "Lounge" + emoji.cocktail,
              },
            ],
        [{ text: emoji.bug + "Maintenance" + emoji.bug }, { text: emoji.moneyBag + "Purser" + emoji.moneyBag }],
      ],
      resize_keyboard: true,
    };
  },
  welcome: {
    keyboard: [[{ text: emoji.navigation }]],
    resize_keyboard: true,
  },
  bridge: {
    keyboard: [
      [
        {
          text: emoji.navigation,
        },
      ],
      [{ text: `${emoji.world} Global Logs ${emoji.world}` }, { text: `${emoji.helm} Capt's Log ${emoji.helm}` }],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
  },

  docked: {
    keyboard: [
      [
        {
          text: emoji.moneyBag + "Treasure" + emoji.moneyBag,
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },

  port: {
    keyboard: [
      [
        {
          text: "Return to Ship",
        },
      ],
    ],
    resize_keyboard: true,
  },
  admin: {
    keyboard: [
      [
        {
          text: `${emoji.slots} Slots ${emoji.slots}`,
        },
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
      [
        {
          text: "/dock",
        },
        {
          text: "/beta",
        },
      ],
    ],
  },
  manifest: {
    keyboard: [
      [
        {
          text: emoji.people + "Guest Manifest" + emoji.people,
        },
        {
          text: "\ud83d\udc81 Crew Manifest \ud83d\udc81",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  lounge: {
    keyboard: [
      [
        {
          text: `${emoji.cocktail} Cocktail ${emoji.cocktail}`,
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  shop: {
    keyboard: [
      [
        {
          text: "Products",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  maintenance: {
    keyboard: [
      [
        {
          text: emoji.bug + "BUG" + emoji.bug,
        },
      ],
      [
        {
          text: emoji.bug + "Suggestions" + emoji.bug,
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  casino: {
    keyboard: [
      [
        {
          text: emoji.upDown + "Lowest Highest" + emoji.upDown,
        },
      ],
      [
        {
          text: `${emoji.slots} Slots ${emoji.slots}`,
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  decision: function (message) {
    return {
      keyboard: [
        [
          {
            text: "Yes,\n" + message,
          },
        ],
        [
          {
            text: "No",
          },
        ],
        [
          {
            text: "\u2630 Main Menu \u2630",
          },
        ],
      ],
      resize_keyboard: true,
    };
  },
  atSea: {
    keyboard: [
      [
        {
          text: "\ud83d\udccd Current Location \ud83d\udccd",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  arrival: {
    keyboard: [
      [
        {
          text: emoji.anchor + "Dock" + emoji.anchor,
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  navigation: {
    keyboard: [
      // [
      //   {
      //     text: "\ud83d\udea2 Home Port \ud83d\udea2",
      //   },
      // ],
      // [
      //   {
      //     text: emoji.anchor + "Dock" + emoji.anchor,
      //   },
      // ],
      [
        {
          text: "\ud83c\udfdd Ports of Call \ud83c\udfdd",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  purser: {
    keyboard: [
      [
        {
          text: emoji.fireworks + "Achievements" + emoji.fireworks,
        },
        {
          text: emoji.people + "Manifest" + emoji.people,
        },
      ],
      [
        {
          text: "Check Balance",
        },
      ],
      // [
      //   {
      //     text: "Deposit",
      //   },
      // ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  event1: {
    keyboard: [
      [
        {
          text: "Debarcation \ud83c\udf05",
        },
        {
          text: "Clean \ud83d\udc4b",
        },
        {
          text: "Embarcation \ud83d\udea2",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  event2: {
    keyboard: [
      [
        {
          text: "rando1 \ud83c\udf78",
        },
        {
          text: "rando2 \ud83c\udf06",
        },
        {
          text: "rando3 \ud83c\udf87",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  event3: {
    keyboard: [
      [
        {
          text: "hjbsfd Lounge \ud83c\udf78",
        },
        {
          text: "The fdsggCity \ud83c\udf06",
        },
        {
          text: "Achfgdgfdievements \ud83c\udf87",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  event4: {
    keyboard: [
      [
        {
          text: "rando4 \ud83c\udf78",
        },
        {
          text: "rando4 \ud83c\udf06",
        },
        {
          text: "rando4 \ud83c\udf87",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  beta: {
    keyboard: [
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
      [
        {
          text: emoji.cocktail + "Mixology" + emoji.cocktail,
        },
        { text: `${emoji.books} Library ${emoji.books}` },
      ],
      [
        { text: emoji.gift + "Shop" + emoji.gift },
        {
          text: `${emoji.books} Library ${emoji.books}`,
        },
        {
          text: `${emoji.radio} BINGO ${emoji.radio}`,
        },
      ],
    ],
    resize_keyboard: true,
  },
  ports: {
    keyboard: [
      [
        {
          text: "Same Continent",
        },
        {
          text: "Change Continent",
        },
      ],
      [
        {
          text: "\u2630 Main Menu \u2630",
        },
      ],
    ],
    resize_keyboard: true,
  },
  mixology: {
    inline_keyboard: [
      [
        {
          text: "Mixology",
          callback_data: JSON.stringify({ action: `mixology` }),
        },
      ],
    ],
  },
  mixologyIngredients: (ingredients) => ({
    inline_keyboard: _.shuffle(ingredients).reduce((keyboard, ingredient, i) => {
      if (i % 2 === 0) {
        keyboard.push([
          {
            text: ingredient,
            callback_data: JSON.stringify({ action: `mix_guess`, data: ingredient }),
          },
        ]);
      } else {
        keyboard[keyboard.length - 1].push({
          text: ingredient,
          callback_data: JSON.stringify({ action: `mix_guess`, data: ingredient }),
        });
      }
      return keyboard;
    }, []),
  }),
  slots: function (gameId, type) {
    let keyboard = {
      inline_keyboard: [
        [
          {
            text: `Stats for nerds`,
            callback_data: JSON.stringify({ action: `slotStats` }),
          },
          { text: `Instructions`, callback_data: JSON.stringify({ action: `slotsInstructions` }) },
        ],
        [],
      ],
    };
    for (let i = 20; i <= 100; i += 20) {
      keyboard.inline_keyboard[1].push({
        text: `${emoji.korona}${i}`,
        callback_data: JSON.stringify({ action: `${type}_${gameId}`, num: i }),
      });
    }
    return keyboard;
  },
  bingo: function (code, board) {
    console.log(JSON.stringify(board));
    let keyboard = {
      inline_keyboard: [
        [],
        [],
        [],
        [],
        [],
        [
          {
            text: "\nB I N G O\n",
            callback_data: JSON.stringify({
              action: `bingo`,
              code,
              loc: `bingo`,
            }),
          },
        ],
      ],
    };
    console.log(board);

    for (const i in board) {
      for (const j in board[i]) {
        keyboard.inline_keyboard[i].push({
          text: board[i][j].status ? colors[board[i][j].status] : board[i][j].name,
          callback_data: JSON.stringify({
            action: `bingo`,
            code,
            loc: `${i}_${j}`,
          }),
        });
      }
    }
    console.log(keyboard);
    return keyboard;
  },
  numbers: function (gameId, type) {
    let keyboard = { inline_keyboard: [] };
    for (let i = 0; i < 20; i++) {
      keyboard.inline_keyboard.push([]);
      for (let j = 1; j <= 5; j++) {
        keyboard.inline_keyboard[keyboard.inline_keyboard.length - 1].push({
          text: i * 5 + j,
          callback_data: JSON.stringify({
            action: `${type}_${gameId}`,
            num: i * 5 + j,
          }),
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
          product: products[i]._id,
        }),
      });
    }
    return keyboard;
  },
  product: function (product) {
    return {
      inline_keyboard: [
        [
          {
            text: "BUY",
            callback_data: JSON.stringify({
              action: "buy",
              id: product._id,
            }),
          },
          // {
          //   'text': 'SELL',
          //   callback_data: JSON.stringify({
          //     action: "sell",
          //     id: product._id
          //   })
          // },
        ],
      ],
    };
  },
};
