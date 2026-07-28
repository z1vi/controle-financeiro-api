const express = require("express");

const usuariosController = require("../controllers/usuariosController");

// Factory: cria o router já “amarrado” ao controller.
// O controller agora usa o banco de dados em vez de array em memória.
module.exports = () => {
  const usuarioRouter = express.Router();
  const controller = usuariosController();

  // GET /users/
  // Retorna todos os usuários.
  usuarioRouter.get("/", controller.listarUsuarios);

  // POST /users/
  // Espera body: { nome, email, senha }
  usuarioRouter.post("/", controller.cadastrarUsuario);

  // POST /users/login
  // Espera body: { email, senha }
  usuarioRouter.post("/login", controller.loginUsuario);

  return usuarioRouter;
};







