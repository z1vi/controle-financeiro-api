// ============================================================
// routes/transacoes.js - Definição das rotas de transações
// ============================================================
// Responsabilidade: apenas mapear URLs e verbos HTTP para as
// actions do controller, aplicando o middleware de autenticação.
//
// Conceito: rotas protegidas exigem autenticação (authMiddleware).

const express = require("express");
const transacoesController = require("../controllers/transacoesController");
const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = () => {
  const router = express.Router();
  const controller = transacoesController();

  // Todas as operações de transação exigem usuário autenticado
  router.use(authMiddleware);

  // GET /transacoes → lista todas as transações do usuário autenticado
  router.get("/", asyncHandler(controller.listarTransacoes));

  // POST /transacoes → cadastra nova transação
  // Body esperado: { descricao: string, valor: number, tipo: "entrada" | "saida" }
  router.post("/", asyncHandler(controller.cadastrarTransacao));

  // PUT /transacoes/:id → atualiza parcialmente a transação informada
  // Body esperado (pelo menos 1 campo): { descricao?, valor?, tipo? }
  router.put("/:id", asyncHandler(controller.atualizarTransacao));

  // DELETE /transacoes/:id → remove a transação informada
  router.delete("/:id", asyncHandler(controller.deletarTransacao));

  return router;
};
