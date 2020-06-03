const request = require("request");
const _ = require("underscore");

const keyboards = require("../constants/keyboards");
const emoji = require("../constants/emoji");
const b = require("../bots/telegram").boozecruiseBot;

const Cocktail = require("../models/mini-games/mixology/cocktail");
const Mixology = require("../models/mini-games/mixology/mixology");

const portID = -1001294305401;
const MIXOLOGYPORT = -1001216326021; //Caspian
/* Get cocktail list from online DB

exports.getCocktail = () => {
  request('https://www.thecocktaildb.com/api/json/v1/1/random.php', (err, response, body) => {
    if (err) {
      console.error(err);
    } else {
      let drink = JSON.parse(body).drinks[0];
      Cocktail.findOne({
        id: drink.idDrink
      }).exec((err, cocktailFound) => {
        if (!cocktailFound) {
          let ingredients = [];
          for (let i = 1; i <= 15; i++) {
            if (drink["strIngredient" + i]) {
              ingredients.push(drink["strIngredient" + i])
            }
          }
          let cocktail = new Cocktail({
            name: drink.strDrink,
            id: drink.idDrink,
            category: drink.strCategory,
            alcoholic: drink.strAlcoholic,
            glass: drink.strGlass,
            instructions: drink.strInstructions,
            image: drink.strDrinkThumb,
            ingredients: ingredients

          })
          cocktail.save();
        }
      })

    }
  });
} */

const getCocktail = () => {
  return new Promise((resolve, reject) => {
    Cocktail.find({
        alcoholic: "Alcoholic",
      })
      .lean()
      .exec((err, cocktails) => {
        //console.log(cocktails[Math.floor(Math.random() * cocktails.length)]);

        resolve(cocktails[Math.floor(Math.random() * cocktails.length)]);
      });
  });
};
const getIngredients = (cocktailIngredients) => {
  return new Promise((resolve, reject) => {
    Cocktail.aggregate([{
      $unwind: "$ingredients",
    }, ]).exec((err, cocktails) => {
      resolve(
        cocktails.reduce((ingredients, cocktail) => {
          if (ingredients.indexOf(cocktail.ingredients) < 0 && cocktailIngredients.indexOf(cocktail.ingredients) < 0) {
            ingredients.push(cocktail.ingredients);
          }
          return ingredients;
        }, [])
      );
    });
  });
};
// Adds fake ingredients to cocktail
const getFakeCocktail = async () => {
  const cocktail = await getCocktail();
  const ingredients = await getIngredients(cocktail.ingredients);
  let fakeIngredients = [];
  for (let i = 0; i < 10 - cocktail.ingredients.length; i++) {
    let random = Math.floor(Math.random() * ingredients.length);
    fakeIngredients.push(ingredients[random]);
    ingredients.splice(random, 1);
  }
  cocktail.fakeIngredients = fakeIngredients;
  return cocktail;
};

const getGame = async () => {
  let game = await Mixology.findOne({
    finished: false,
  }).populate("cocktail");
  console.log("GAME => ", game);

  if (!game) {
    const cocktail = await getFakeCocktail();
    let newGame = await Mixology.create({
      players: [],
      fakeIngredients: cocktail.fakeIngredients,
      cocktail: cocktail._id,
    });
    console.log("NEW GAME =>", newGame);

    game = await Mixology.findOne({
      finished: false,
    }).populate("cocktail");
  }
  if (game && game.cocktail) {
    sendCocktail(game.cocktail, game.fakeIngredients);
  } else {
    getFakeCocktail().then((cocktail) => {
      Mixology.create({
          fakeIngredients: cocktail.fakeIngredients,
          cocktail: cocktail._id,
        },
        (err, newGame) => {
          console.log(game);
          sendCocktail(cocktail, cocktail.fakeIngredients);
        }
      );
    });
  }
};

const checkGuess = async (ship, guess, name) => {
  let game = await getGame();
  let player = _.find(game.players, (player) => player.id == ship.id);
  if (player) {
    const incorrectGuesses = _.difference(player.guesses, game.cocktail.ingredients).length;
    const min = _.min(
      game.players.filter((otherPlayer) => otherPlayer.id != ship.id),
      (otherPlayer) => _.difference(otherPlayer.guesses, game.cocktail.ingredients).length
    );
    if (incorrectGuesses > min) {
      return -3;
    } else if (player.guesses.indexOf(guess.data) === -1) {
      player.guesses.push(guess.data);
    } else {
      return -2;
    }
  } else {
    game.players.push({
      id: ship.id,
      name,
      guesses: [guess.data],
    });
    player = _.find(game.players, (player) => player.id == ship.id);
  }
  if (_.intersection(player.guesses, game.cocktail.ingredients).length === game.cocktail.ingredients.length) {
    game.finished = true;
    await game.save();
    return 10;
  } else {
    await game.save();
    return game.cocktail.ingredients.indexOf(guess.data);
  }
};

const sendCocktail = (cocktail, fakeIngredients) => {
  //(cocktail);
  b.sendPhoto(MIXOLOGYPORT, cocktail.image, `<pre>${cocktail.name}</pre>`);
  setTimeout(() => {
    console.log("cocktail.ingredients", cocktail.ingredients);
    //console.log(keyboards.mixologyIngredients(cocktail.ingredients.concat(cocktail.fakeIngredients)));
    b.sendKeyboard(
      MIXOLOGYPORT,
      `Which ingredients are part of ${cocktail.name}`,
      keyboards.mixologyIngredients(cocktail.ingredients.concat(fakeIngredients))
    );
  }, 500);
};

exports.checkGuess = (ship, data, from) => {
  if (timeOut[ship.id] && timeOut[ship.id].date < moment()) {
    delete timeOut[ship.id];
  } else if (timeOut[ship.id] && timeOut[ship.id].date >= moment()) {
    return b.sendMessage(
      MIXOLOGYPORT,
      `You're still in timeout for another ${(timeOut[ship.id].date - moment()) / 1000} seconds, ${from.first_name}`
    );
  }
  checkGuess(ship, data, from.first_name).then((result) => {
    switch (result) {
      case -3:
        b.sendMessage(MIXOLOGYPORT, `You guessed more than other players, ${from.first_name}`);
        break;
      case -2:
        b.sendMessage(MIXOLOGYPORT, `You already guessed that, ${from.first_name}`);
        break;
      case -1:
        if (timeOut[ship.id] && timeOut[ship.id].date < moment()) {
          delete timeOut[ship.id];
        }
        timeOut[ship.id] = {
          date: moment().add(10, "seconds")
        };
        //b.editMessageText(
        b.sendMessage(
          MIXOLOGYPORT,
          // messageId,
          `You're wrong... also you're in time out for 10 seconds, ${from.first_name}`
        );
        break;
      case 10:
        b.sendMessage(
          MIXOLOGYPORT,
          `${emoji.cocktail} ${from.first_name} WON!!!! ${emoji.cocktail}\n\n<i>Next round starts in 10 seconds</i>`
        );
        setTimeout(() => {
          mixology.getGame().then((game) => {
            mixology.sendCocktail(game.cocktail, game.fakeIngredients);
          });
        }, 10000);
        break;
      default:
        b.sendMessage(MIXOLOGYPORT, `Good job ${from.first_name}`);
    }
  });
};

getFakeCocktail();
exports.getCocktail = getCocktail;
exports.getFakeCocktail = getFakeCocktail;
exports.getGame = getGame;
exports.getID = () => portID;