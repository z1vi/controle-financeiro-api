// ============================================================
// controllers/balanceController.js
// ============================================================
// Controller "fino": apenas chama o Service de saldo e devolve
// a resposta com status HTTP 200.

const balanceService = require("../services/balanceService");

module.exports = () => {
  const service = balanceService();

  // GET /balance → calcula e retorna o saldo atual
  const obterSaldo = async (req, res) => {
    const resultado = await service.calcularSaldo();
    return res.status(200).json(resultado.body);
  };

  return { obterSaldo };
};
