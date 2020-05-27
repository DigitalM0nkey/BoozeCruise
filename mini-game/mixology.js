const request = require("request");
const portID = "-1001294305401";
const Cocktail = require("../models/mini-games/mixology/cocktail");
const Mixology = require("../models/mini-games/mixology/mixology");
const _ = require("underscore");
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
    Cocktail.aggregate([
      {
        $unwind: "$ingredients",
      },
    ]).exec((err, cocktails) => {
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
  const game = await Mixology.findOne({
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

    return await Mixology.findOne({
      finished: false,
    });
  } else {
    return game;
  }
};

exports.checkGuess = async (ship, guess, name) => {
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

getFakeCocktail();
exports.getCocktail = getCocktail;
exports.getFakeCocktail = getFakeCocktail;
exports.getGame = getGame;
exports.getID = () => portID;
