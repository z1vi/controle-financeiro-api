// Repository: encapsula o acesso aos dados das transações.
// O Service não sabe mais como os dados são armazenados.

module.exports = (transacoes) => {
  const listarTodas = () => {
    return transacoes;
  };

  const buscarPorId = (id) => {
    return transacoes.find((t) => t.id === id);
  };

  const criarTransacao = (transacao) => {
    transacoes.push(transacao);
    return transacao;
  };

  const deletarTransacao = (id) => {
    const index = transacoes.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }
    const [transacaoRemovida] = transacoes.splice(index, 1);
    return transacaoRemovida;
  };

  return {
    listarTodas,
    buscarPorId,
    criarTransacao,
    deletarTransacao,
  };
};
