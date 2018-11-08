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
  }
  ]
})
module.exports = Ship;
