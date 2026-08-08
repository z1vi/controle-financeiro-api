// ============================================================
// middlewares/asyncHandler.js - Wrapper para controllers async
// ============================================================
// O Express 5 já trata errors de controllers async automaticamente,
// mas este wrapper é um padrão didático e explícito que garante
// que qualquer erro lançado (throw) dentro de um controller seja
// repassado ao middleware global de tratamento de erros.
//
// Uso:
//   router.get("/", asyncHandler(controller.listar));
//
// Conceito: encadeamento de middlewares + propagação de erros.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
