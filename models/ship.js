var db = require('../db');
var Ship = db.model('Ship',{
  id: {type: String, required: true},
  name: {type: String, required: false},
  guests: [{
    type: {type: String, required: true},
  }
  ]
})
module.exports = Ship;
