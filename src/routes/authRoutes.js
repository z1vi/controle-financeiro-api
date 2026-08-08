// ============================================================
// routes/authRoutes.js - Definição das rotas de autenticação
// ============================================================
// Responsabilidade: apenas definir endpoints e chamar controllers.
// Nenhuma regra de negócio aqui.
//
// Conceito: separação clara da autenticação em seu próprio router.

const express = require("express");
const authController = require("../controllers/authController");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = () => {
  const router = express.Router();
  const controller = authController();

  // POST /auth/register → cria um novo usuário
  // Body esperado: { nome: string, email: string, senha: string }
  router.post("/register", asyncHandler(controller.register));

  // POST /auth/login → autentica o usuário pelo email + senha
  // Body esperado: { email: string, senha: string }
  router.post("/login", asyncHandler(controller.login));

  return router;
};
