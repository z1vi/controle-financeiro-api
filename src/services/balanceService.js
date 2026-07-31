const transacoesRepository = require("../repositories/transacoesRepository");

module.exports = () => {
  const repository = transacoesRepository();

  const calcularSaldo = async () => {
    const transacoes = await repository.listarTodas();

    const saldo = transacoes.reduce((acc, t) => {
      return t.tipo === "entrada" ? acc + Number(t.valor) : acc - Number(t.valor);
    }, 0);

    return { kind: "SUCCESS", body: { balance: saldo } };
  };

  return { calcularSaldo };
};
