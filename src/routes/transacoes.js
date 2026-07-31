const express = require("express");
const transacoesController = require("../controllers/transacoesController");

module.exports = () => {
  const router = express.Router();
  const controller = transacoesController();

  router.get("/", controller.listarTransacoes);
  router.post("/", controller.cadastrarTransacao);
  router.put("/:id", controller.atualizarTransacao);
  router.delete("/:id", controller.deletarTransacao);

  return router;
};
