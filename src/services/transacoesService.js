const { validarTipo, validarValor } = require("../validadores");
const transacoesRepository = require("../repositories/transacoesRepository");

module.exports = () => {
  const repository = transacoesRepository();

  const listarTransacoes = async () => {
    const transacoes = await repository.listarTodas();
    return { kind: "SUCCESS", body: transacoes };
  };

  const cadastrarTransacao = async ({ descricao, valor, tipo } = {}) => {
    if (!descricao || valor === undefined || valor === null || !tipo) {
      return { kind: "VALIDATION", body: { message: "Todos os campos são obrigatórios" } };
    }

    if (!validarTipo(tipo)) {
      return { kind: "VALIDATION", body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" } };
    }

    const erroValor = validarValor(valor);
    if (erroValor) {
      return { kind: "VALIDATION", body: { message: erroValor } };
    }

    const transacaoCriada = await repository.criarTransacao({ descricao, valor, tipo });

    return {
      kind: "SUCCESS",
      body: { message: "Transação cadastrada com sucesso!", transacao: transacaoCriada },
    };
  };

  const atualizarTransacao = async (idParam, { descricao, valor, tipo } = {}) => {
    const id = parseInt(idParam, 10);
      if(Number.isNaN(id)) {
        return {
          kind: "VALIDATION",
          body: {
            message: "ID inválido." 

          }
        };
      }
    const transacao = await repository.buscarPorId(id);
    if (!transacao) {
      return { kind: "NOT_FOUND", body: { message: "Transação não encontrada" } };
    }

    const dadosAtualizados = {};

    if (descricao !== undefined) {
      if (!descricao) return { kind: "VALIDATION", body: { message: "A descrição da transação não pode ser vazia" } };
      dadosAtualizados.descricao = descricao;
    }

    if (valor !== undefined) {
      const erroValor = validarValor(valor);
      if (erroValor) return { kind: "VALIDATION", body: { message: erroValor } };
      dadosAtualizados.valor = valor;
    }

    if (tipo !== undefined) {
      if (!validarTipo(tipo)) {
        return { kind: "VALIDATION", body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" } };
      }
      dadosAtualizados.tipo = tipo;
    }

    const transacaoAtualizada = await repository.atualizarTransacao(id, dadosAtualizados);

    return { kind: "SUCCESS", body: { message: "Transação atualizada com sucesso!", transacao: transacaoAtualizada } };
  };

  const deletarTransacao = async (idParam) => {
    const id = parseInt(idParam, 10);
    const transacaoRemovida = await repository.deletarTransacao(id);

    if (!transacaoRemovida) {
      return { kind: "NOT_FOUND", body: { message: "Transação não encontrada" } };
    }

    return {
      kind: "SUCCESS",
      body: { message: "Transação removida com sucesso.", deleted: true, transacao: transacaoRemovida },
    };
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
