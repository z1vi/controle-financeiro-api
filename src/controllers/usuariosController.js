// ============================================================
// controllers/usuariosController.js
// ============================================================
// Controller "fino": extrai dados da requisição e delega ao Service.
//
// A autenticação (login) NÃO fica mais aqui: foi movida para
// controllers/authController.js.
//
// Conceito: controller fino - apenas traduz o resultado do service
// em resposta HTTP.

const usuariosService = require("../services/usuariosService");

module.exports = () => {
  const service = usuariosService();

  const listarUsuarios = async (req, res) => {
    const resultado = await service.listarUsuarios();

    return res.status(200).json(resultado.body);
  };

  const criarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

  const resultado = await service.criarUsuario(
    nome,
    email,
    senha
  );

  return res.status(200).json(resultado);
  };

  const deletarUsuario = async (req, res) => {
    const { id } = req.params;

    const resultado = await service.deletarUsuario(id);

    if (resultado.kind === "VALIDATION") {
      return res.status(400).json(resultado.body);
    }

    if (resultado.kind === "NOT_FOUND") {
      return res.status(404).json(resultado.body);
    }

    return res.status(200).json(resultado.body);
  };

  return {
    listarUsuarios,
    criarUsuario,
    deletarUsuario,
  };
};