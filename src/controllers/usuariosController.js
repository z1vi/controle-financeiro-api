module.exports = (usuarios) => {
  const usuariosService = require("../services/usuariosService");
  const service = usuariosService(usuarios);

  // Controller “fino”: só extrai dados da req e delega ao service.
  const listarUsuarios = (req, res) => {
    const { statusCode, body } = service.listarUsuarios();
    return res.status(statusCode).json(body);
  };

  const cadastrarUsuario = (req, res) => {
    const { nome, email, senha } = req.body || {};

    const { statusCode, body } = service.cadastrarUsuario({
      nome,
      email,
      senha,
    });

    return res.status(statusCode).json(body);
  };

  const loginUsuario = (req, res) => {
    const { email, senha } = req.body || {};

    const { statusCode, body } = service.loginUsuario({ email, senha });

    return res.status(statusCode).json(body);
  };

  return {
    listarUsuarios,
    cadastrarUsuario,
    loginUsuario,
  };
};

