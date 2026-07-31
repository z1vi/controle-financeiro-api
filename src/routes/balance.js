const express = require("express");
const balanceController = require("../controllers/balanceController");

module.exports = () => {
  const router = express.Router();
  const controller = balanceController();

  router.get("/", controller.obterSaldo);

  return router;
};
