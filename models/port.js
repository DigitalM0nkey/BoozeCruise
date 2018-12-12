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
    sector: {type: Integer, required: false},
    x: {type: Integer, required: false},
    y: {type: Integer, required: false},

  }
})
module.exports = Port;
