// ============================================================
// controllers/balanceController.js
// ============================================================
// Controller "fino": apenas chama o Service de saldo e devolve
// a resposta com status HTTP 200.

const balanceService = require("../services/balanceService");

module.exports = () => {
  const service = balanceService();

  // GET /balance → calcula e retorna o saldo atual do usuário
  // O usuario_id vem via query string: /balance?usuario_id=1
  const obterSaldo = async (req, res) => {
    const usuario_id = Number(req.query.usuario_id);
    const resultado = await service.calcularSaldo(usuario_id);
    return res.status(200).json(resultado.body);
  };

  return { obterSaldo };
};
