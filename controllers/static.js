var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

module.exports = router;
