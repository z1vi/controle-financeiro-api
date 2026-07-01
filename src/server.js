const express = require("express");

const app = express();

// Permite receber JSON no body das requisições
app.use(express.json());

// "Banco em memória" (para desenvolvimento): armazena usuários e transações.
// Observação: ao reiniciar o servidor, tudo é perdido.
const usuarios = [];
const transacoes = [];

// Incrementa o ID das transações
let proximoId = 1;
//incrementa o ID dos usuários
let proximoUsuarioId = 1;

// Página inicial (saída simples para validar que o servidor está ativo)
app.get("/", (req, res) => {
  res.send("Olá! Eu sou seu sistema financeiro!");
});

// Cadastro de usuário
app.post("/register", (req, res) => {
  const novoUsuario = {
    id: proximoUsuarioId++, // Gera um ID incremental para cada usuário
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
  };

  // Valida os campos obrigatórios e impede e-mails duplicados.

  if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
    return res.status(400).json({
      message: "Todos os campos são obrigatórios",
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

  res.status(201).json({
    message: "Usuário cadastrado com sucesso!",
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
      message: "Usuário não encontrado",
    });
  }

  if (usuarioEncontrado.senha !== senha) {
    return res.status(401).json({
      message: "Senha incorreta",
    });
  }

  res.json({
    messagem: "Login realizado com sucesso!",
    usuario: usuarioEncontrado.nome,
  });
});

app.post("/transactions", (req, res) => {
  const descricao = req.body.descricao;
  const valor = req.body.valor;

  if (typeof valor !== "number") {
    return res.status(400).json({
      message: "O valor da transação deve ser um número",
    });
  }

  if (valor <= 0) {
    return res.status(400).json({
      message: "O valor da transação deve ser maior que zero",
    });
  }

  if (!descricao) {
    return res.status(400).json({
      message: "A descrição da transação não pode ser vazia",
    });
  }
  const tipo = req.body.tipo;

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({
      message: 'O tipo da transação deve ser apenas "entrada" ou "saida"',
    });
  }

  const novaTransacao = {
    id: proximoId++,
    descricao,
    valor,
    tipo,
  };

  console.log("Nova transação:");
  console.log(novaTransacao);

  transacoes.push(novaTransacao);

  console.log("Lista de transações:");
  console.log(transacoes);

  res.status(201).json(novaTransacao);
});

app.get("/transactions", (req, res) => {
  res.json(transacoes);
});

app.put("/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const transacao = transacoes.find((t) => t.id === id);

  if (!transacao) {
    return res.status(404).json({
      message: "Transação não encontrada",
    });
  }

  const { descricao, valor, tipo } = req.body;

  if (descricao !== undefined) {
    if (!descricao) {
      return res.status(400).json({
        message: "A descrição da transação não pode ser vazia",
      });
    }

    transacao.descricao = descricao;
  }

  if (valor !== undefined) {
    if (typeof valor !== "number") {
      return res.status(400).json({
        message: "O valor da transação deve ser um número",
      });
    }

    if (valor <= 0) {
      return res.status(400).json({
        message: "O valor da transação deve ser maior que zero",
      });
    }

    transacao.valor = valor;
  }

  if (tipo !== undefined) {
    if (tipo !== "entrada" && tipo !== "saida") {
      return res.status(400).json({
        message: 'O tipo da transação deve ser apenas "entrada" ou "saida"',
      });
    }
    transacao.tipo = tipo;
  }

  res.json(transacao);
});

app.delete("/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = transacoes.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Transação não encontrada",
    });
  }

  const removida = transacoes.splice(index, 1)[0];
  res.json({
    message: "Transação removida com sucesso!",
    transacao: removida,
  });
});

app.get("/balance", (req, res) => {
  let saldo = 0;

  for (const transacao of transacoes) {
    if (transacao.tipo === "entrada") {
      saldo += transacao.valor;
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
