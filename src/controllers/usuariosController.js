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

  // GET /usuarios → retorna todos os usuários (200)
  const listarUsuarios = async (req, res) => {
    const resultado = await service.listarUsuarios();
    return res.status(200).json(resultado.body);
  };

  return {
    listarUsuarios,
  };
};
