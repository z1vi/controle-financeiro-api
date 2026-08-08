// ============================================================
// controllers/authController.js
// ============================================================
// Controller da autenticação: extrai dados da requisição e
// delega ao authService. Traduz o "kind" retornado em status HTTP.
//
// Regras de mapeamento:
//   kind === "SUCCESS"    → 200 / 201
//   kind === "VALIDATION" → 400
//   kind === "AUTH"       → 401
//
// Conceito: controller fino (thin controller) - sem regra de negócio.

const authService = require("../services/authService");

module.exports = () => {
  const service = authService();

  // POST /auth/register → 201 sucesso, 400 validação
  const register = async (req, res) => {
    const { nome, email, senha } = req.body || {};

    const resultado = await service.register({ nome, email, senha });

    const statusCode = resultado.kind === "VALIDATION" ? 400 : 201;

    return res.status(statusCode).json(resultado.body);
  };

  // POST /auth/login → 200 sucesso, 401 credenciais inválidas
  const login = async (req, res) => {
    const { email, senha } = req.body || {};

    const resultado = await service.login({ email, senha });

    const statusCode = resultado.kind === "AUTH" ? 401 : 200;

    return res.status(statusCode).json(resultado.body);
  };

  return {
    register,
    login,
  };
};
