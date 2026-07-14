const { validarTipo, validarValor } = require("../validadores");

// Controller “factory”: recebe o array em memória e expõe handlers para as rotas.
// Isso evita que o controller dependa de variáveis globais.
module.exports = (transacoes) => {
  // GET /transactions
  // Lista todas as transações.
  const listarTransacoes = (req, res) => {
    return res.json(transacoes);
  };

  // POST /transactions
  // Espera body: { descricao, valor, tipo }
  const cadastrarTransacao = (req, res) => {
    const { descricao, valor, tipo } = req.body || {};

    if (!descricao || valor === undefined || valor === null || !tipo) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
      });
    }

    // validarTipo retorna boolean (true = ok, false = inválido)
    const tipoValido = validarTipo(tipo);
    if (!tipoValido) {
      return res.status(400).json({
        message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'",
      });
    }

    const erroValor = validarValor(valor);
    if (erroValor) {
      return res.status(400).json({
        message: erroValor,
      });
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

    return res.status(201).json({
      message: "Transação cadastrada com sucesso!",
      transacao: novaTransacao,
    });
  };

  // PUT /transactions/:id
  // Atualiza parcial: qualquer campo pode ser enviado (descricao/valor/tipo).
  const atualizarTransacao = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const transacao = transacoes.find((t) => t.id === id);

    if (!transacao) {
      return res.status(404).json({
        message: "Transação não encontrada",
      });
    }

    const { descricao, valor, tipo } = req.body || {};

    if (descricao !== undefined) {
      if (!descricao) {
        return res.status(400).json({
          message: "A descrição da transação não pode ser vazia",
        });
      }

      transacao.descricao = descricao;
    }

    if (valor !== undefined) {
      const erroValor = validarValor(valor);
      if (erroValor) {
        return res.status(400).json({
          message: erroValor,
        });
      }

      transacao.valor = valor;
    }

    if (tipo !== undefined) {
      const tipoValido = validarTipo(tipo);
      if (!tipoValido) {
        return res.status(400).json({
          message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'",
        });
      }

      transacao.tipo = tipo;
    }

    return res.json({
      message: "Transação atualizada com sucesso!",
      transacao,
    });
  };

  // DELETE /transactions/:id
  // Remove uma transação do array em memória.
  const deletarTransacao = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = transacoes.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Transação não encontrada",
      });
    }

    const transacaoRemovida = transacoes.splice(index, 1)[0];

    return res.status(200).json({
      message: "Transação removida com sucesso.",
      deleted: true,
      transacao: {
        id: transacaoRemovida?.id,
        descricao: transacaoRemovida?.descricao,
        valor: transacaoRemovida?.valor,
        tipo: transacaoRemovida?.tipo,
      },
    });
  };

  // Exposição dos handlers para o router.
  return {
    listarTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
};


