const transacoesServiceFactory = require("../services/transacoesService");

// Controller “fino”: só extrai dados da req e delega ao service.
module.exports = () => {
  const service = transacoesServiceFactory();

  const listarTransacoes = async (req, res) => {
    const resultado = await service.listarTransacoes();
    return res.status(200).json(resultado.body);
  };

  const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, tipo } = req.body || {};
    const resultado = await service.cadastrarTransacao({ descricao, valor, tipo });
    const statusCode = resultado.kind === "SUCCESS" ? 201 : 400;
    return res.status(statusCode).json(resultado.body);
  };

  const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo } = req.body || {};
    const resultado = await service.atualizarTransacao(id, { descricao, valor, tipo });
    const statusCode =
      resultado.kind === "NOT_FOUND" ? 404 :
      resultado.kind === "VALIDATION" ? 400 :
      200;
    return res.status(statusCode).json(resultado.body);
  };

  const deletarTransacao = async (req, res) => {
    const { id } = req.params;
    const resultado = await service.deletarTransacao(id);
    const statusCode = resultado.kind === "NOT_FOUND" ? 404 : 200;
    return res.status(statusCode).json(resultado.body);
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
