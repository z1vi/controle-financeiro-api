const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    balance: 0,
  });
});

module.exports = router;
