var db = require('../../../db');
var Cocktail = db.model('Cocktail', {
  id: { type: String, required: true },
  name: { type: String, required: true },
  ingredients: [{ type: String, required: false }],
  image: { type: String, required: false },
  glass: { type: String, required: false },
  instructions: { type: String, required: false },
  catagory: { type: String, required: false },
  alcoholic: { type: String, required: false },
});
module.exports = Cocktail;


