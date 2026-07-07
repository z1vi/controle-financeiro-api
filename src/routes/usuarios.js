const express = require('express');

// Factory: cria o router já “amarrado” ao array de usuários em memória.
module.exports = (usuarios) => {
  const usuarioRouter = express.Router();

  // Rota para listar todos os usuários
  usuarioRouter.get('/', (req, res) => {
    res.json(usuarios);
  });

  // Rota para cadastrar um usuário
  usuarioRouter.post('/', (req, res) => {
    const novoUsuario = req.body;

    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
      });
    }

    if (usuarios.some((usuario) => usuario.email === novoUsuario.email)) {
      return res.status(400).json({
        message: "Já existe um usuário cadastrado com este e-mail.",
      });
    }

    usuarios.push(novoUsuario);

    console.log("Usuário cadastrado:");
    console.log(novoUsuario);

    console.log("Lista de usuários:");
    console.log(usuarios);

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: novoUsuario,
    });
  });

  return usuarioRouter;
};


