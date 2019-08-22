const db = require('../../../db');
const LowestHighest = db.model('LowestHighest', {
  port: { type: String, ref: "Port", required: false },
  players: [
    {
      id: {
        type: String,
        ref: "Ship",
        required: true
      },
      guess: { type: Number, required: true }
    }
  ],
  date: { type: Date, required: true, default: Date.now },
  inProgress: { type: Boolean, required: true, default: true },
  houseGuess: { type: Number, required: true, default: () => Math.floor(Math.random() * 98) + 2 },
  jackpotPaid: { type: Boolean, required: true, default: false },


});
module.exports = LowestHighest;


