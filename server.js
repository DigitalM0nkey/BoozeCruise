var express = require('express');
var app = express();
//app.use(logger('dev'));
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Server ', process.pid ,' listening on', port);
});
