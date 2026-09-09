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
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/erroPadrao");

// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config(); 

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET deve ser configurado antes de iniciar a API");
}


// ========== Cria e configura a aplicação ==========
const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Middleware global: converte automaticamente o corpo das requisições
// (Content-Type: application/json) para objeto JS em "req.body".
app.use(express.json());

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT || 10),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { status: 429, message: "Muitas tentativas. Tente novamente mais tarde." } },
});

app.get("/", (req, res) => {
  res.send("Servidor rodando! Acesse /auth, /transacoes ou /saldo para interagir com a API.");
});

// ========== Rotas ==========
// Autenticação (register/login)
const authRouter = require("./routes/authRoutes");
app.use("/auth", authRateLimit, authRouter());

// Transações (exige autenticação via authMiddleware)
const transacoesRouter = require("./routes/transacoes");
app.use("/transacoes", transacoesRouter());

// Balanço / Saldo (exige autenticação via authMiddleware)
const balanceRouter = require("./routes/balance");
app.use("/saldo", balanceRouter());

// ========== Middleware global de erros ==========
// DEVE ser registrado por último, depois de todas as rotas.
app.use((req, res, next) => next(new AppError("Rota não encontrada", 404)));
app.use(errorHandler);

// ========== Exporta a app (permite futuros testes) ==========
module.exports = app;

// Apenas inicia o servidor se este arquivo for executado diretamente
// (node src/server.js). Em testes, o app é importado sem iniciar.
if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}
