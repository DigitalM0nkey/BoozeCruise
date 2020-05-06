const db = require('../../../db');
const Mixology = db.model('Mixology', {
  players: [
    {
      id: {
        type: String,
        ref: "Ship",
        required: true
      },
      guesses: [{ type: String, required: true }],
      name: { type: String, required: true },
    }
  ],
  fakeIngredients: [{ type: String, required: true }],
  cocktail: { type: String, ref: "Cocktail", required: true },
  finished: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true, default: Date.now }
});
module.exports = Mixology;
