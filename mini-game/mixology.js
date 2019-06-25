const request = require("request");
const portID = "-1001294305401";
const Cocktail = require("../models/mini-games/mixology/cocktail");
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
let theCocktail

const getCocktail = () => {
  return new Promise((resolve, reject) => {
    Cocktail.find({ alcoholic: "Alcoholic" }).exec((err, cocktails) => {
      resolve(cocktails[Math.floor(Math.random() * cocktails.length)]);
    })
  })
}
const getIngredients = (cocktailIngredients) => {
  return new Promise((resolve, reject) => {
    Cocktail.aggregate([
      { $unwind: '$ingredients' },
    ]).exec((err, cocktails) => {
      resolve(cocktails.reduce((ingredients, cocktail) => {
        if (ingredients.indexOf(cocktail.ingredients) < 0 && cocktailIngredients.indexOf(cocktail.ingredients) < 0) {
          ingredients.push(cocktail.ingredients);
        } return ingredients;
      }, []))


    })
  })

}

getCocktail().then(cocktail => {
  console.log(cocktail);
  getIngredients(cocktail.ingredients).then(ingredients => {
    let fakeIngredients = [];
    for (let i = 0; i < 10 - cocktail.ingredients.length; i++) {
      let random = Math.floor(Math.random() * ingredients.length);
      fakeIngredients.push(ingredients[random]);
      ingredients.splice(random, 1);
    } theCocktail = cocktail;
    theCocktail.fakeIngredients = fakeIngredients;
    console.log(fakeIngredients);
  })


})
exports.getID = () => portID;