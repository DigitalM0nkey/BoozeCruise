var db = require('../db');
var Port = db.model('Port', {
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  userid: {type: String, required: false},
  guests: [{
    type: {
      type: String,
      required: true
    },
  }],
  ships: [{
    type: String,
    ref: "Ship",
    required: false
  }],
  location: {
    sector: {type: Number, required: false},
    x: {type: Number, required: false},
    y: {type: Number, required: false},

  },
  treasure: {type: Number, required: false, default:0},
});
module.exports = Port;
