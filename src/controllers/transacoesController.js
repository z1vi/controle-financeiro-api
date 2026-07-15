const transacoesServiceFactory = require("../services/transacoesService");

// Controller “fino”: só extrai dados da req e delega ao service.
module.exports = (transacoes) => {
  const service = transacoesServiceFactory(transacoes);

  const listarTransacoes = (req, res) => {
    const { statusCode, body } = service.listarTransacoes();
    return res.status(statusCode).json(body);
  };

  const cadastrarTransacao = (req, res) => {
    const { descricao, valor, tipo } = req.body || {};

    const { statusCode, body } = service.cadastrarTransacao({
      descricao,
      valor,
      tipo,
    });

    return res.status(statusCode).json(body);
  };

  const atualizarTransacao = (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo } = req.body || {};

    const { statusCode, body } = service.atualizarTransacao(id, {
      descricao,
      valor,
      tipo,
    });

    return res.status(statusCode).json(body);
  };

  const deletarTransacao = (req, res) => {
    const { id } = req.params;

    const { statusCode, body } = service.deletarTransacao(id);

    return res.status(statusCode).json(body);
  };

  return {
    listarTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
};

