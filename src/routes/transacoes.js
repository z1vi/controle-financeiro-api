// ============================================================
// routes/transacoes.js - Definição das rotas de transações
// ============================================================
// Padrão de arquitetura: Router (aqui) → Controller → Service → Repository
// Neste arquivo apenas MAPEAMOS URLs e verbos HTTP para as actions do controller.

const express = require("express");
const transacoesController = require("../controllers/transacoesController");

module.exports = () => {
  const router = express.Router();
  const controller = transacoesController();

  // GET /transactions → lista todas as transações
  router.get("/", controller.listarTransacoes);

  // POST /transactions → cadastra nova transação
  // Body esperado: { descricao: string, valor: number, tipo: "entrada" | "saida" }
  router.post("/", controller.cadastrarTransacao);

  // PUT /transactions/:id → atualiza parcialmente a transação informada
  // Body esperado (pelo menos 1 campo): { descricao?, valor?, tipo? }
  router.put("/:id", controller.atualizarTransacao);

  // DELETE /transactions/:id → remove a transação informada
  router.delete("/:id", controller.deletarTransacao);

  return router;
};
