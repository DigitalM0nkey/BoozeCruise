const db = require("../../../db");
const Bingo = db.model("Bingo", {
  date: { type: Date, required: true, default: Date.now },
  code: { type: String },
  inProgress: { type: Boolean, required: true, default: true },
  gameType: { type: String },
  players: [
    {
      ship: { type: String, ref: "Ship", required: false },
      date: { type: Date, required: true, default: Date.now },
      board: { type: Object },
    },
  ],
});
module.exports = Bingo;
