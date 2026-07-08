const express = require("express");

const usuariosController = require("../controllers/usuariosController");

// Factory: cria o router já “amarrado” ao array de usuários em memória.
module.exports = (usuarios) => {
  const usuarioRouter = express.Router();
  const controller = usuariosController(usuarios);

  // Rota para listar todos os usuários
  usuarioRouter.get("/", controller.listarUsuarios);

  // Rota para cadastrar um usuário
  usuarioRouter.post("/", controller.cadastrarUsuario);

  return usuarioRouter;
};



