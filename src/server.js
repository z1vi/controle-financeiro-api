const express = require("express");

const app = express();

// Permite receber JSON
app.use(express.json());

// Nossa "caixa de usuários"
const usuarios = [];

const transacoes = [];

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
  if (novoUsuario.nome === "" || novoUsuario.email === "" || novoUsuario.senha === "") {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios",
    });
  }
  if (usuarios.some((usuario) => usuario.email === novoUsuario.email)) {
    return res.status(400).json({
      message: "Já existe um usuário cadastrado com este e-mail. ",
    });
  }

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

app.post("/transactions", (req, res) => {
  const descricao = req.body.descricao;
  const valor = req.body.valor;
    if (valor <= 0) {
    return res.status(400).json({
      message: "O valor da transação deve ser maior que zero",
    });
  }
    if (descricao === "") {
    return res.status(400).json({
      message: "A descrição da transação não pode ser vazia",
    });
  } 
    if (valor === string) {
      return res.status(400).json({
        message: "O valor da transação deve ser um número",
      })
  const tipo = req.body.tipo;

  const novaTransacao = {
    descricao,
    valor,
    tipo,
  };

  console.log("Nova transação:");
  console.log(novaTransacao);

  transacoes.push(novaTransacao);

  console.log("Lista de transações:");
  console.log(novaTransacao);

  res.json(novaTransacao);
});

app.get("/transactions", (req, res) => {
  res.json(transacoes);
});

app.get("/balance", (req, res) => {
  let saldo = 0;

  for (const transacao of transacoes) {
    if (transacao.tipo === "entrada") {
      saldo = +transacao.valor;
    } else if (transacao.tipo === "saida") {
      saldo -= transacao.valor;
    }
  }

  res.json({
    balance: saldo,
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
