var db = require('../db');
var Chat = db.model('Chat',{
  id: {type: String, required: true}
})
module.exports = Chat;
