const { validarTipo, validarValor } = require("../validadores");

// Service recebe o array em memória e concentra as regras de negócio.
module.exports = (transacoes) => {
  const listarTransacoes = () => {
    return transacoes;
  };

  const cadastrarTransacao = ({ descricao, valor, tipo } = {}) => {
    if (!descricao || valor === undefined || valor === null || !tipo) {
      return {
        error: true,
        kind: "VALIDATION",
        body: { message: "Todos os campos são obrigatórios" },
      };
    }

    const tipoValido = validarTipo(tipo);
    if (!tipoValido) {
      return {
        error: true,
        kind: "VALIDATION",
        body: {
          message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'",
        },
      };
    }

    const erroValor = validarValor(valor);
    if (erroValor) {
      return {
        error: true,
        kind: "VALIDATION",
        body: { message: erroValor },
      };
    }

    const gerarIdTransacao = () => {
      const maxId = transacoes.reduce((max, t) => Math.max(max, t.id || 0), 0);
      return maxId + 1;
    };

    const novaTransacao = {
      id: gerarIdTransacao(),
      descricao,
      valor,
      tipo,
    };

    transacoes.push(novaTransacao);

    return {
      error: false,
      kind: "SUCCESS",
      body: {
        message: "Transação cadastrada com sucesso!",
        transacao: novaTransacao,
      },
    };
  };

  const atualizarTransacao = (idParam, { descricao, valor, tipo } = {}) => {
    const id = parseInt(idParam, 10);
    const transacao = transacoes.find((t) => t.id === id);

    if (!transacao) {
      return {
        error: true,
        kind: "NOT_FOUND",
        body: { message: "Transação não encontrada" },
      };
    }

    if (descricao !== undefined) {
      if (!descricao) {
        return {
          error: true,
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
          error: true,
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
          error: true,
          kind: "VALIDATION",
          body: {
            message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'",
          },
        };
      }

      transacao.tipo = tipo;
    }

    return {
      error: false,
      kind: "SUCCESS",
      body: {
        message: "Transação atualizada com sucesso!",
        transacao,
      },
    };
  };

  const deletarTransacao = (idParam) => {
    const id = parseInt(idParam, 10);
    const index = transacoes.findIndex((t) => t.id === id);

    if (index === -1) {
      return {
        error: true,
        kind: "NOT_FOUND",
        body: { message: "Transação não encontrada" },
      };
    }

    const transacaoRemovida = transacoes.splice(index, 1)[0];

    return {
      error: false,
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

