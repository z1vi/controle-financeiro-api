// ============================================================
// utils/erroPadrao.js - Classe de erro de aplicação
// ============================================================
// Define um erro com "status HTTP" associado.
// Diferente do erro padrão do Express (Error), esta classe
// carrega o statusCode que será usado pelo middleware global
// de tratamento de erros para responder corretamente ao cliente.
//
// Uso futuro em services:
//   throw new AppError("Usuário não encontrado", 404);
//
// Conceito: Exceptions + camada de apresentação separada.

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
