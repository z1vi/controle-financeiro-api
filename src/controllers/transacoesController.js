// ============================================================
// controllers/transacoesController.js
// ============================================================
// Controller "fino" (thin controller):
//   - Extrai os dados da requisição (req.params / req.body)
//   - Delega toda a regra de negócio ao Service
//   - Traduz o "kind" retornado pelo Service em status HTTP adequado
// Regras de mapeamento:
//   kind === "SUCCESS"     → 201 (criação)
//   kind === "VALIDATION"  → 400 (Bad Request)
//   kind === "NOT_FOUND"   → 404 (Not Found)
//   demais casos          → 200 (OK)

const transacoesServiceFactory = require("../services/transacoesService");

module.exports = () => {
  const service = transacoesServiceFactory();

  // GET /transactions → sempre retorna 200 com a lista de transações
  const listarTransacoes = async (req, res) => {
    const resultado = await service.listarTransacoes();
    return res.status(200).json(resultado.body);
  };

  // POST /transactions → 201 se criado com sucesso, 400 se validação falhar
  const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, tipo } = req.body || {};
    const resultado = await service.cadastrarTransacao({ descricao, valor, tipo });
    const statusCode = resultado.kind === "SUCCESS" ? 201 : 400;
    return res.status(statusCode).json(resultado.body);
  };

  // PUT /transactions/:id → 200 sucesso, 400 validação, 404 não encontrada
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

  // DELETE /transactions/:id → 200 se removida, 404 se não encontrada
  const deletarTransacao = async (req, res) => {
    const { id } = req.params;
    const resultado = await service.deletarTransacao(id);
    const statusCode = resultado.kind === "NOT_FOUND" ? 404 : 200;
    return res.status(statusCode).json(resultado.body);
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
