var mongoose = require('mongoose');
require('dotenv').config();
var url = process.env.MONGO;

mongoose.connect(url, {useNewUrlParser: true}, function(err) {
//mongoose.connect('mongodb://localhost/social', function() {
  if (err) { console.log(err.message); }
  console.log('MongoDB connected');
});

module.exports = mongoose;
