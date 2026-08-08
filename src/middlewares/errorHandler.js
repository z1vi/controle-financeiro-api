// ============================================================
// middlewares/errorHandler.js - Middleware global de erros
// ============================================================
// Único ponto responsável por transformar erros em respostas HTTP.
// É registrado por ÚLTIMO no server.js (depois de todas as rotas).
// O Express identifica um middleware de erro pelos 4 parâmetros:
// (err, req, res, next).
//
// Padrão de resposta JSON:
//   { error: { message, statusCode } }
//
// Conceito: Middleware de erro + centralização de tratamento.

const AppError = require("../utils/erroPadrao");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Erro criado propositalmente pela aplicação (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        status: err.statusCode,
        message: err.message,
      },
    });
  }

  // Erros de validação do corpo JSON malformado (Express)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        status: 400,
        message: "JSON inválido no corpo da requisição",
      },
    });
  }

  // Erro desconhecido (bug, banco, etc.) - não vazar detalhes internos
  console.error("[ERRO INESPERADO]", err);

  return res.status(500).json({
    error: {
      status: 500,
      message: "Erro interno do servidor",
    },
  });
};

module.exports = errorHandler;
