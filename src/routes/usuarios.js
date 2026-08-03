// ============================================================
// routes/usuarios.js - Definição das rotas de usuários
// ============================================================

const express = require("express");

const usuariosController = require("../controllers/usuariosController");

// Factory: cria o router já "amarrado" ao controller.
// O controller usa o banco de dados via Repository (SQLite + Knex).
module.exports = () => {
  const usuarioRouter = express.Router();
  const controller = usuariosController();

  // GET /users → retorna todos os usuários cadastrados
  usuarioRouter.get("/", controller.listarUsuarios);

  // POST /users → cria um novo usuário
  // Body esperado: { nome: string, email: string, senha: string }
  usuarioRouter.post("/", controller.cadastrarUsuario);

  // POST /users/login → autentica o usuário pelo email + senha
  // Body esperado: { email: string, senha: string }
  usuarioRouter.post("/login", controller.loginUsuario);

  return usuarioRouter;
};







