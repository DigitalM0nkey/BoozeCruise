const db = require('../../../db');
const Bingo = db.model('Bingo', {
  ship: { type: String, ref: "Ship", required: false },
  date: { type: Date, required: true, default: Date.now },
  inProgress: { type: Boolean, required: true, default: true },
  board: { type: Object },
  gameType: { type: String }
});
module.exports = Bingo;
