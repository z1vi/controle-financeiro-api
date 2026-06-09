const express = require("express");

const app = express();

// Permite receber JSON
app.use(express.json());

// Nossa "caixa de usuários"
const usuarios = [];

// Página inicial
app.get("/", (req, res) => {
  res.send("Olá! Eu sou seu sistema financeiro!");
});

// Cadastro de usuário
app.post("/register", (req, res) => {
  const novoUsuario = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
  };

  usuarios.push(novoUsuario);

  console.log("Usuário cadastrado:");
  console.log(novoUsuario);

  console.log("Lista de usuários:");
  console.log(usuarios);

  res.json({
    mensagem: "Usuário cadastrado com sucesso!",
    usuario: novoUsuario,
  });
});

// Listar usuários
app.get("/users", (req, res) => {
  res.json(usuarios);
});

// Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  console.log("Tentativa de login:");
  console.log(req.body);

  const usuarioEncontrado = usuarios.find((usuario) => usuario.email === email);

  if (!usuarioEncontrado) {
    return res.status(401).json({
      erro: "Usuário não encontrado",
    });
  }

  if (usuarioEncontrado.senha !== senha) {
    return res.status(401).json({
      erro: "Senha incorreta",
    });
  }

  res.json({
    mensagem: "Login realizado com sucesso!",
    usuario: usuarioEncontrado.nome,
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
