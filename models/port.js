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
  userid: {type: String, required: true},
  guests: [{
    type: {
      type: String,
      required: true
    },
  }]
})
module.exports = Port;
