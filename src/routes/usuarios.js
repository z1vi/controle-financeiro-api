// ============================================================
// routes/usuarios.js - Definição das rotas de usuários
// ============================================================
// Responsabilidade: apenas definir endpoints, associar middleware
// e chamar os controllers. Nenhuma regra de negócio aqui.
//
// Conceito: rota "fina" - apenas mapeia URL + verbo para controller.

const express = require("express");
const usuariosController = require("../controllers/usuariosController");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = () => {
  const usuarioRouter = express.Router();
  const controller = usuariosController();

  // GET /usuarios → retorna todos os usuários cadastrados
  usuarioRouter.get("/", asyncHandler(controller.listarUsuarios));

  return usuarioRouter;
};
