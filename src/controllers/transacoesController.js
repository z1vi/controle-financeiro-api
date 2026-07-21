const transacoesServiceFactory = require("../services/transacoesService");

// Controller “fino”: só extrai dados da req e delega ao service.
module.exports = (transacoes) => {
  const service = transacoesServiceFactory(transacoes);

  const listarTransacoes = (req, res) => {
    const resultado = service.listarTransacoes();
    return res.status(200).json(resultado);
  };

  const cadastrarTransacao = (req, res) => {
    const { descricao, valor, tipo } = req.body || {};

    const resultado = service.cadastrarTransacao({
      descricao,
      valor,
      tipo,
    });

    const statusCode = resultado.kind === "SUCCESS" ? 201 : 400;

    return res.status(statusCode).json(resultado.body);
  };

  const atualizarTransacao = (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo } = req.body || {};

    const resultado = service.atualizarTransacao(id, {
      descricao,
      valor,
      tipo,
    });

    const statusCode =
      resultado.kind === "NOT_FOUND" ? 404 :
      resultado.kind === "VALIDATION" ? 400 :
      200;

    return res.status(statusCode).json(resultado.body);
  };

  const deletarTransacao = (req, res) => {
    const { id } = req.params;

    const resultado = service.deletarTransacao(id);

    const statusCode = resultado.kind === "NOT_FOUND" ? 404 : 200;

    return res.status(statusCode).json(resultado.body);
  };

  return {
    listarTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
};

