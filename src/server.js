// ============================================================
// server.js - Ponto de entrada da API de controle financeiro
// ============================================================
// Responsável por:
//   - Criar e configurar a aplicação Express
//   - Registrar os middlewares globais
//   - Conectar os "routers" de cada módulo ao app
//   - Registrar o middleware global de tratamento de erros
//   - Subir o servidor na porta definida
//
// Conceito: separação entre a criação da app (exportada para
// permitir testes) e a inicialização do servidor (listen).

const express = require("express");
const errorHandler = require("./middlewares/errorHandler");

// ========== Cria e configura a aplicação ==========
const app = express();

// Middleware global: converte automaticamente o corpo das requisições
// (Content-Type: application/json) para objeto JS em "req.body".
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando! Acesse /auth, /usuarios, /transacoes ou /saldo para interagir com a API.");
});

// ========== Rotas ==========
// Autenticação (register/login)
const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter());

// Usuários
const usuarioRouter = require("./routes/usuarios");
app.use("/usuarios", usuarioRouter());

// Transações (exige autenticação via authMiddleware)
const transacoesRouter = require("./routes/transacoes");
app.use("/transacoes", transacoesRouter());

// Balanço / Saldo (exige autenticação via authMiddleware)
const balanceRouter = require("./routes/balance");
app.use("/saldo", balanceRouter());

// ========== Middleware global de erros ==========
// DEVE ser registrado por último, depois de todas as rotas.
app.use(errorHandler);

// ========== Exporta a app (permite futuros testes) ==========
module.exports = app;

// Apenas inicia o servidor se este arquivo for executado diretamente
// (node src/server.js). Em testes, o app é importado sem iniciar.
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}
