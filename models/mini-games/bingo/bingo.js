const db = require("../../../db");
const Bingo = db.model("Bingo", {
  date: { type: Date, required: true, default: Date.now },
  code: { type: String },
  status: { type: String, required: true, default: 'next' },
  gameType: { type: String },
  ships: [
    {
      _id: { type: String, ref: "Ship", required: false },
      date: { type: Date, required: true, default: Date.now },
      board: { type: Object },
    },
  ],
});
module.exports = Bingo;
