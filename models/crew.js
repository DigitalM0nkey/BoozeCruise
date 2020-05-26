var db = require("../db");
var Crew = db.model("Crew", {
  id: {
    type: Number,
    required: true,
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: false },
  cruiseline: { type: String, required: true },
  position: { type: String, required: true },
  nationality: { type: String, required: true },
  language: { type: String, required: true },
  ships: [
    {
      type: String,
      ref: "Ship",
      required: false,
    },
  ],
  alumni: { type: Boolean, required: true },
  wage: { type: Number, required: false },
});
module.exports = Crew;
