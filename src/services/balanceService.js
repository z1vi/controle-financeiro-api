// ============================================================
// services/balanceService.js - Regra de negócio do saldo
// ============================================================
// Calcula o saldo total somando todas as transações:
//   - tipo "entrada"  → soma o valor (+)
//   - tipo "saida"    → subtrai o valor (-)

const transacoesRepository = require("../repositories/transacoesRepository");

module.exports = () => {
  const repository = transacoesRepository();

  const calcularSaldo = async () => {
    // Busca todas as transações para calcular o saldo em memória
    const transacoes = await repository.listarTodas();

    // reduce() acumula o saldo percorrendo cada transação
    const saldo = transacoes.reduce((acc, t) => {
      return t.tipo === "entrada" ? acc + Number(t.valor) : acc - Number(t.valor);
    }, 0);

    // Retorna o padrão { kind, body } para o controller traduzir em HTTP
    return { kind: "SUCCESS", body: { balance: saldo } };
  };

  return { calcularSaldo };
};
