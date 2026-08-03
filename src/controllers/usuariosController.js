// ============================================================
// controllers/usuariosController.js
// ============================================================
// Controller "fino": extrai dados da requisição e delega ao Service.
// Mapeamento kind → HTTP:
//   VALIDATION → 400  | AUTH → 401  | SUCCESS → 200/201

const usuariosService = require("../services/usuariosService");

module.exports = () => {
  const service = usuariosService();

  // GET /users → retorna todos os usuários (200)
  const listarUsuarios = async (req, res) => {
    const resultado = await service.listarUsuarios();
    return res.status(200).json(resultado.body);
  };

  // POST /users → 201 sucesso, 400 validação (ex.: email duplicado)
  const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body || {};

    const resultado = await service.cadastrarUsuario({
      nome,
      email,
      senha,
    });

    const statusCode = resultado.kind === "VALIDATION" ? 400 : 201;

    return res.status(statusCode).json(resultado.body);
  };

  // POST /users/login → 200 sucesso, 401 credenciais inválidas
  const loginUsuario = async (req, res) => {
    const { email, senha } = req.body || {};

    const resultado = await service.loginUsuario({ email, senha });

    const statusCode = resultado.kind === "AUTH" ? 401 : 200;

    return res.status(statusCode).json(resultado.body);
  };

  return {
    listarUsuarios,
    cadastrarUsuario,
    loginUsuario,
  };
};

