const express = require("express");
const balanceController = require("../controllers/balanceController");

module.exports = (transacoes) => {
  const router = express.Router();
  const controller = balanceController(transacoes);

  // GET /balance
  router.get("/", controller.obterSaldo);

  return router;
};
