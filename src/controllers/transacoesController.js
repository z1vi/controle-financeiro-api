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

  // GET /transactions → sempre retorna 200 com a lista de transações do usuário
  // O usuario_id vem via query string: /transactions?usuario_id=1
  const listarTransacoes = async (req, res) => {
    const usuario_id = Number(req.query.usuario_id);
    const resultado = await service.listarTransacoes(usuario_id);
    return res.status(200).json(resultado.body);
  };

  // POST /transactions → 201 se criado com sucesso, 400 se validação falhar
  // Body esperado: { descricao, valor, tipo, usuario_id }
  const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, tipo, usuario_id } = req.body || {};
    const resultado = await service.cadastrarTransacao({ descricao, valor, tipo, usuario_id });
    const statusCode = resultado.kind === "SUCCESS" ? 201 : 400;
    return res.status(statusCode).json(resultado.body);
  };

  // PUT /transactions/:id → 200 sucesso, 400 validação, 404 não encontrada
  // Body esperado: { descricao?, valor?, tipo?, usuario_id }
  const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo, usuario_id } = req.body || {};
    const resultado = await service.atualizarTransacao(id, { descricao, valor, tipo, usuario_id });
    const statusCode =
      resultado.kind === "NOT_FOUND" ? 404 :
      resultado.kind === "VALIDATION" ? 400 :
      200;
    return res.status(statusCode).json(resultado.body);
  };

  // DELETE /transactions/:id → 200 se removida, 404 se não encontrada
  // O usuario_id vem via query string: /transactions/:id?usuario_id=1
  const deletarTransacao = async (req, res) => {
    const { id } = req.params;
    const usuario_id = Number(req.query.usuario_id);
    const resultado = await service.deletarTransacao(id, usuario_id);
    const statusCode = resultado.kind === "NOT_FOUND" ? 404 : 200;
    return res.status(statusCode).json(resultado.body);
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
