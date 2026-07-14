const express = require("express");

const usuariosController = require("../controllers/usuariosController");

// Factory: cria o router já “amarrado” ao array de usuários em memória.
// Isso permite reaproveitar o controller sem depender de variáveis globais.
module.exports = (usuarios) => {
  const usuarioRouter = express.Router();
  const controller = usuariosController(usuarios);

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







