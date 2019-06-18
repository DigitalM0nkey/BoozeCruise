const request = require("request");
const portID = "-1001294305401";
const Cocktail = require("../models/mini-games/mixology/cocktail");
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
}
exports.getID = () => portID;