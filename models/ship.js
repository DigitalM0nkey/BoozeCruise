var db = require('../db');
var Ship = db.model('Ship',{
  id: {type: String, required: true},
  name: {type: String, required: false},
  user: {
    id:{type: String, required: true},
    first_name:{type: String, required: true},
    last_name:{type: String, required: false},
    username:{type: String, required: false}
  },
  guests: [{
    type: {type: String, required: true},
  }],
  location: {
    sector: {type: Number, required: false},
    x: {type: Number, required: false},
    y: {type: Number, required: false},
    port: {type: String,ref: "Port", required: false},
    homePort: {type: String,ref: "Port", required: false}
  },
  nextLocation: {
    arrival: {type: Date, required: false},
    port: {type: String, ref: "Port", required: false}
  },
  portHistory: [
    {type: String,ref: "Port", required: false}
  ],
  purse: {
    balance: {type: Number, required: true, default: 100},
    transactions: [
      {
        date: {type: Date, required: true},
        type: {type: String, required: true},
        amount: {type: Number, required: true}
      }
    ]
  }
});
module.exports = Ship;
