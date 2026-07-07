const express = require("express");
const { validarTipo, validarValor } = require("./validadores");

const app = express();


// Permite receber JSON no body das requisições
app.use(express.json());

//Variáveis para armazenar usuários e transações
const usuarios = [];
const transacoes = [];

// Incrementa o ID das transações
let proximoId = 1;
//incrementa o ID dos usuários
let proximoUsuarioId = 1;



// Página inicial (saída simples para validar que o servidor está ativo)
// Rotas
app.get("/", (req, res) => {
  res.send("Olá! Eu sou seu sistema financeiro!");
});

// Cadastro de usuário
// Router de usuários (GET /users, POST /users)
const usuarioRouter = require("./routes/usuarios");
app.use("/users", usuarioRouter(usuarios));


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

  const validarTipo = (tipo) => {
    return tipo === "entrada" || tipo === "saida";
  };

  if (!validarTipo(tipo)) {
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
