const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = express();
const prototypes = require('./prototypes');

app.use(bodyParser.json());
app.use(logger("dev"));
app.use("/bots/BoozeCruise", require("./controllers/bots/BoozeCruise"));
app.use("/api/ping", require("./controllers/api/ping"));
app.use(require("./controllers/static"));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Server ", process.pid, " listening on", port);
  const artPirate = require('./pirates/art');
});