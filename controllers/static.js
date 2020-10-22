const express = require("express");
const router = express.Router();
const path = require("path");
const jobs = require("./jobs");

router.get("/*", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/../index.html"));
});

module.exports = router;
