// ============================================================
// controllers/balanceController.js
// ============================================================
// Controller "fino": apenas chama o Service de saldo e devolve
// a resposta com status HTTP. O usuarioId vem do authMiddleware
// (req.usuarioId), e no futuro da identidade autenticada via JWT.
//
// Conceito: acesso ao recurso sensível (saldo) exige autenticação.

const balanceService = require("../services/balanceService");

module.exports = () => {
  const service = balanceService();

  // GET /saldo → calcula e retorna o saldo do usuário autenticado
  const obterSaldo = async (req, res) => {
    const usuarioId = req.usuarioId;
    const resultado = await service.calcularSaldo(usuarioId);
    return res.status(200).json(resultado.body);
  };

  return { obterSaldo };
};
