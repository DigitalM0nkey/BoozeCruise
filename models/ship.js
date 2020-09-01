var db = require("../db");
var Ship = db.model("Ship", {
  id: { type: String, required: true },
  name: { type: String, required: false },
  startDate: { type: Date, required: false },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    username: { type: String, required: false },
  },
  guests: [
    {
      type: { type: Number, required: true },
      purse: { type: Number, required: true },
    },
  ],
  crew: [
    {
      title: { type: String, required: true },
      crew_status: { type: String, required: true },
    },
  ],
  selectedCrew: { type: String, required: false },
  capacity: { type: Number, required: true, default: 650 },
  location: {
    sector: { type: Number, required: false },
    x: { type: Number, required: false },
    y: { type: Number, required: false },
    port: { type: String, ref: "Port", required: false },
    homePort: { type: String, ref: "Port", required: false },
  },
  nextLocation: {
    arrival: { type: Date, required: false },
    port: { type: String, ref: "Port", required: false },
  },
  portHistory: [
    {
      port: { type: String, ref: "Port", required: true },
      arrivalDate: { type: Date, required: true },
      departureDate: { type: Date, required: false },
    },
  ],
  communication: [
    {
      date: { type: Date, required: true },
      type: { type: String, required: true },
      transcript: { type: String, required: true },
    },
  ],
  products: [
    {
      expiry: { type: Date, required: true },
      product: { type: String, ref: "Product", required: true },
    },
  ],
  purse: {
    balance: { type: Number, required: true, default: 100 },
    transactions: [
      {
        date: { type: Date, required: true },
        type: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
  },
});
module.exports = Ship;
