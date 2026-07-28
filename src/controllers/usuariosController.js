const usuariosService = require("../services/usuariosService");

module.exports = () => {
  const service = usuariosService();

  // Controller “fino”: só extrai dados da req e delega ao service.
  const listarUsuarios = async (req, res) => {
    const resultado = await service.listarUsuarios();
    return res.status(200).json(resultado.body);
  };

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

