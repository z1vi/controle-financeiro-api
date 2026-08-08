// ============================================================
// routes/balance.js - Definição das rotas de balanço/saldo
// ============================================================
// Responsabilidade: apenas mapear URL + verbo para o controller,
// aplicando o middleware de autenticação.
//
// Conceito: o saldo é um recurso sensível → exige autenticação.

const express = require("express");
const balanceController = require("../controllers/balanceController");
const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = () => {
  const router = express.Router();
  const controller = balanceController();

  // O acesso ao saldo exige usuário autenticado
  router.use(authMiddleware);

  // GET /saldo → retorna o saldo calculado a partir das transações
  router.get("/", asyncHandler(controller.obterSaldo));

  return router;
};
