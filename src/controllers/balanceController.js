const balanceService = require("../services/balanceService");

module.exports = (transacoes) => {
  const service = balanceService(transacoes);

  const obterSaldo = (req, res) => {
    const resultado = service.calcularSaldo();
    return res.status(200).json(resultado.body);
  };

  return {
    obterSaldo,
  };
};

