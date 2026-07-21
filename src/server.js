const express = require("express");

const app = express();

// Permite que o Express entenda `req.body` como JSON
app.use(express.json());

// Armazenamento em memória (arrays).

const usuarios = [];

// Página inicial (teste rápido se o servidor está vivo)
app.get("/", (req, res) => {
  res.send("Servidor rodando! Acesse /users ou /transactions para interagir com a API.");
});


// Rotas de usuários (Factory recebe o array em memória)
const usuarioRouter = require("./routes/usuarios");
app.use("/users", usuarioRouter(usuarios));

// Armazenamento em memória (array) para transações.
// A lógica de CRUD fica nos controllers/rotas dedicados.
// O server apenas injeta a dependência (o array) nas rotas.
const transacoes = [];

// Rotas de transações
const transacoesRouter = require("./routes/transacoes");
app.use("/transactions", transacoesRouter(transacoes));

// Rotas de balanço (usa o mesmo array de transações)
const balanceRouter = require("./routes/balance");
app.use("/balance", balanceRouter(transacoes));

// Inicia o servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});


