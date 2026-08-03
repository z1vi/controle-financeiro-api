// ============================================================
// routes/balance.js - Definição das rotas de balanço/saldo
// ============================================================

const express = require("express");
const balanceController = require("../controllers/balanceController");

module.exports = () => {
  const router = express.Router();
  const controller = balanceController();

  // GET /balance → retorna o saldo calculado a partir das transações
  // (soma entradas, subtrai saídas)
  router.get("/", controller.obterSaldo);

  return router;
};
