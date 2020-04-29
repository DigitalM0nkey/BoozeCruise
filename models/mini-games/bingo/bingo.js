const db = require('../../../db');
const Bingo = db.model('Bingo', {
  port: { type: String, ref: "Port", required: false },
  players: [
    {
      id: {
        type: String,
        ref: "Ship",
        required: true
      },
      guess: { type: Number, required: true },
      name: { type: String, required: true },
    }
  ],
  date: { type: Date, required: true, default: Date.now },
  inProgress: { type: Boolean, required: true, default: true }
});
module.exports = Bingo;
