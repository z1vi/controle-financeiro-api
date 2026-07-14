const express = require("express");

const transacoesController = require("../controllers/transacoesController");

// Factory: monta as rotas de transações amarradas ao array em memória.
// Ideal para protótipo (sem banco).
module.exports = (transacoes) => {
  const router = express.Router();
  const controller = transacoesController(transacoes);

  // GET /transactions
  router.get("/", controller.listarTransacoes);

  // POST /transactions
  // Body: { descricao, valor, tipo }
  router.post("/", controller.cadastrarTransacao);

  // PUT /transactions/:id
  router.put("/:id", controller.atualizarTransacao);

  // DELETE /transactions/:id
  router.delete("/:id", controller.deletarTransacao);

  return router;
};

