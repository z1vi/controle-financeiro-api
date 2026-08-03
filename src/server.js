// ============================================================
// server.js - Ponto de entrada da API de controle financeiro
// ============================================================
// Responsável por:
//   - Criar e configurar a aplicação Express
//   - Registrar os middlewares globais
//   - Conectar os "routers" de cada módulo ao app
//   - Subir o servidor na porta definida
// ============================================================

const express = require("express");
const app = express();

// Middleware global: converte automaticamente o corpo das requisições
// (Content-Type: application/json) para objeto JS em "req.body".
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando! Acesse /users, /transactions ou /balance para interagir com a API.");
});

// Rotas de usuários
const usuarioRouter = require("./routes/usuarios");
app.use("/users", usuarioRouter());

// Rotas de transações (agora usa banco de dados via Knex)
const transacoesRouter = require("./routes/transacoes");
app.use("/transactions", transacoesRouter());

// Rotas de balanço (também lê do banco via repository)
const balanceRouter = require("./routes/balance");
app.use("/balance", balanceRouter());

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
