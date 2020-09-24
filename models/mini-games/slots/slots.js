const db = require("../../../db");
const Slots = db.model("Slots", {
  id: {
    type: String,
    ref: "Ship",
    required: true,
  },
  date: { type: Date, required: true, default: Date.now },
  plays: { type: Number, required: true, default: 0 },
  bets: [
    {
      value: { type: Number, required: true, default: 0 },
      date: { type: Date, required: true, default: Date.now },
      symbols: [{ type: String, required: true }],
      prize: { type: Number },
    },
  ],
  highestJackpot: { type: Number },
  globalJackpot: { type: Number },
});
module.exports = Slots;
