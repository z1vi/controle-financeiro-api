// ============================================================
// services/balanceService.js - Regra de negócio do saldo
// ============================================================
// Calcula o saldo total de UM usuário somando suas transações:
//   - tipo "entrada"  → soma o valor (+)
//   - tipo "saida"    → subtrai o valor (-)

const transacoesRepository = require("../repositories/transacoesRepository");

module.exports = () => {
  const repository = transacoesRepository();

  const calcularSaldo = async (usuario_id) => {
    // Busca APENAS as transações do usuário informado
    const transacoes = await repository.listarTodas(usuario_id);

    // reduce() acumula o saldo percorrendo cada transação
    const saldo = transacoes.reduce((acc, t) => {
      return t.tipo === "entrada" ? acc + Number(t.valor) : acc - Number(t.valor);
    }, 0);

    // Retorna o padrão { kind, body } para o controller traduzir em HTTP
    return { kind: "SUCCESS", body: { balance: saldo, usuario_id } };
  };

  return { calcularSaldo };
};
