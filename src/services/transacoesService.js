const { validarTipo, validarValor } = require("../validadores");
const transacoesRepository = require("../repositories/transacoesRepository");

// Service: concentra as regras de negócio e delega acesso a dados ao Repository.
// O Service NÃO sabe mais como os dados são armazenados.

module.exports = (transacoes) => {
  const repository = transacoesRepository(transacoes);

  const listarTransacoes = () => {
    return repository.listarTodas();
  };

  const cadastrarTransacao = ({ descricao, valor, tipo } = {}) => {
    if (!descricao || valor === undefined || valor === null || !tipo) {
      return {
        kind: "VALIDATION",
        body: { message: "Todos os campos são obrigatórios" },
      };
    }

    const tipoValido = validarTipo(tipo);
    if (!tipoValido) {
      return {
        kind: "VALIDATION",
        body: {
          message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'",
        },
      };
    }

    const erroValor = validarValor(valor);
    if (erroValor) {
      return {
        kind: "VALIDATION",
        body: { message: erroValor },
      };
    }

  const transacoesExistentes = repository.listarTodas();

  const maxId = transacoesExistentes.reduce(
    (max, t) => Math.max(max, t.id || 0),
    0
);

  const novaTransacao = {
    id: maxId + 1,
    descricao,
    valor,
    tipo
};

    repository.criarTransacao(novaTransacao);

    return {
      kind: "SUCCESS",
      body: {
        message: "Transação cadastrada com sucesso!",
        transacao: novaTransacao,
      },
    };
  };

  const atualizarTransacao = (idParam, { descricao, valor, tipo } = {}) => {
    const id = parseInt(idParam, 10);
    const transacao = repository.buscarPorId(id);

    if (!transacao) {
      return {
        kind: "NOT_FOUND",
        body: { message: "Transação não encontrada" },
      };
    }

    if (descricao !== undefined) {
      if (!descricao) {
        return {
          kind: "VALIDATION",
          body: { message: "A descrição da transação não pode ser vazia" },
        };
      }

      transacao.descricao = descricao;
    }

    if (valor !== undefined) {
      const erroValor = validarValor(valor);
      if (erroValor) {
        return {
          kind: "VALIDATION",
          body: { message: erroValor },
        };
      }

      transacao.valor = valor;
    }

    if (tipo !== undefined) {
      const tipoValido = validarTipo(tipo);
      if (!tipoValido) {
        return {
          kind: "VALIDATION",
          body: {
            message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'",
          },
        };
      }

      transacao.tipo = tipo;
    }

    return {
      kind: "SUCCESS",
      body: {
        message: "Transação atualizada com sucesso!",
        transacao,
      },
    };
  };

  const deletarTransacao = (idParam) => {
    const id = parseInt(idParam, 10);
    const transacaoRemovida = repository.deletarTransacao(id);

    if (!transacaoRemovida) {
      return {
        kind: "NOT_FOUND",
        body: { message: "Transação não encontrada" },
      };
    }

    return {
      kind: "SUCCESS",
      body: {
        message: "Transação removida com sucesso.",
        deleted: true,
        transacao: {
          id: transacaoRemovida?.id,
          descricao: transacaoRemovida?.descricao,
          valor: transacaoRemovida?.valor,
          tipo: transacaoRemovida?.tipo,
        },
      },
    };
  };

  return {
    listarTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
};

