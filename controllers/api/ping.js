const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.status(200).send('pong');
});

module.exports = router;
