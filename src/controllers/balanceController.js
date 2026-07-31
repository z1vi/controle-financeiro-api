const balanceService = require("../services/balanceService");

module.exports = () => {
  const service = balanceService();

  const obterSaldo = async (req, res) => {
    const resultado = await service.calcularSaldo();
    return res.status(200).json(resultado.body);
  };

  return { obterSaldo };
};
