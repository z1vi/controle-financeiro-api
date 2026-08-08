// ============================================================
// middlewares/authMiddleware.js - Placeholder de autenticação
// ============================================================
// ESTRUTURA PREPARADA para a futura autenticação com JWT.
//
// HOJE: por ser um projeto de aprendizado sem JWT ainda, este
//   middleware apenas lê o "usuarioId" da query string e injeta
//   em "req.usuarioId", documentando o FLUXO FUTURO.
//
// FUTURO (quando bcrypt + JWT forem implementados):
//   Authorization: Bearer TOKEN
//     ↓
//   middleware verifica o token e extrai o id
//     ↓
//   req.usuarioId (vem da identidade autenticada, NÃO do cliente)
//     ↓
//   service → repository
//
// Conceito: o usuarioId deve vir da identidade autenticada e
// NUNCA ser confiado ao cliente na requisição.

const AppError = require("../utils/erroPadrao");

const authMiddleware = (req, res, next) => {
  // TODO futuro: extrair id do JWT (req.headers.authorization)
  // Em vez de confiar na query string do cliente.
  const usuarioId = Number(req.query.usuarioId);

  if (!usuarioId) {
    return next(new AppError("Usuário não autenticado. Informe usuarioId na query string.", 401));
  }

  req.usuarioId = usuarioId;
  return next();
};

module.exports = authMiddleware;
