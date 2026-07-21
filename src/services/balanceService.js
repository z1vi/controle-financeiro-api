// Service recebe o array de transações em memória e calcula o saldo.
module.exports = (transacoes) => {
  const calcularSaldo = () => {
    const saldo = transacoes.reduce((acc, t) => {
      return t.tipo === "entrada" ? acc + t.valor : acc - t.valor;
    }, 0);

    return {
      kind: "SUCCESS",
      body: { balance: saldo },
    };
  };

  return {
    calcularSaldo,
  };
};

