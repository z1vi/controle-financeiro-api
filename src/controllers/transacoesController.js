// ============================================================
// controllers/transacoesController.js
// ============================================================
// Controller "fino" (thin controller):
//   - Extrai os dados da requisição (req.params / req.body)
//   - Delega toda a regra de negócio ao Service
//   - Traduz o "kind" retornado pelo Service em status HTTP
//
// O usuarioId vem do authMiddleware (req.usuarioId). No futuro,
// ele virá da identidade do JWT e NÃO da query string do cliente.
//
// Regras de mapeamento:
//   kind === "SUCCESS"     → 201 (criação)
//   kind === "VALIDATION"  → 400 (Bad Request)
//   kind === "NOT_FOUND"   → 404 (Not Found)
//   demais casos          → 200 (OK)

const transacoesServiceFactory = require("../services/transacoesService");

module.exports = () => {
  const service = transacoesServiceFactory();

  // GET /transacoes → lista as transações do usuário autenticado
  const listarTransacoes = async (req, res) => {
    const usuarioId = req.usuarioId;
    const resultado = await service.listarTransacoes(usuarioId);
    return res.status(200).json(resultado.body);
  };

  // POST /transacoes → 201 se criado, 400 se validação falhar
  // Body esperado: { descricao, valor, tipo }
  const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, tipo } = req.body || {};
    const usuarioId = req.usuarioId;
    const resultado = await service.cadastrarTransacao({ descricao, valor, tipo, usuarioId });
    const statusCode = resultado.kind === "SUCCESS" ? 201 : 400;
    return res.status(statusCode).json(resultado.body);
  };

  // PUT /transacoes/:id → 200 sucesso, 400 validação, 404 não encontrada
  // Body esperado: { descricao?, valor?, tipo? }
  const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo } = req.body || {};
    const usuarioId = req.usuarioId;
    const resultado = await service.atualizarTransacao(id, { descricao, valor, tipo, usuarioId });
    const statusCode =
      resultado.kind === "NOT_FOUND" ? 404 :
      resultado.kind === "VALIDATION" ? 400 :
      200;
    return res.status(statusCode).json(resultado.body);
  };

  // DELETE /transacoes/:id → 200 se removida, 404 se não encontrada
  const deletarTransacao = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuarioId;
    const resultado = await service.deletarTransacao(id, usuarioId);
    const statusCode = resultado.kind === "NOT_FOUND" ? 404 : 200;
    return res.status(statusCode).json(resultado.body);
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
