module.exports = (usuarios) => {
  const usuariosService = require("../services/usuariosService");
  const service = usuariosService(usuarios);

  // Controller “fino”: só extrai dados da req e delega ao service.
  const listarUsuarios = (req, res) => {
    const body = service.listarUsuarios();
    return res.status(200).json(body);
  };

  const cadastrarUsuario = (req, res) => {
    const { nome, email, senha } = req.body || {};

    const resultado = service.cadastrarUsuario({
      nome,
      email,
      senha,
    });

    const statusCode =
      resultado.kind === "AUTH" ? 401 :
      resultado.kind === "VALIDATION" ? 400 :
      201;

    return res.status(statusCode).json(resultado.body);
  };

  const loginUsuario = (req, res) => {
    const { email, senha } = req.body || {};

    const resultado = service.loginUsuario({ email, senha });

    const statusCode = resultado.kind === "AUTH" ? 401 : 200;

    return res.status(statusCode).json(resultado.body);
  };

  return {
    listarUsuarios,
    cadastrarUsuario,
    loginUsuario,
  };
};

