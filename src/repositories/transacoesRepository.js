// ============================================================
// repositories/transacoesRepository.js - Acesso aos dados
// ============================================================
// Encapsula TODAS as operações de banco das transações.
// Única camada que conhece o SQLite (via Knex). Services e
// controllers não sabem como os dados são armazenados.

const knex = require("../database/knex");

module.exports = () => {
  // Nome da tabela no banco de dados
  const TABELA = "transacoes";

  // SELECT * FROM transacoes [WHERE usuario_id = ?]
  // Retorna todas as transações (ou apenas as do usuário informado)
  const listarTodas = async (usuarioId = null) => {
    const query = knex(TABELA).select("*");
    if (usuarioId) query.where({ usuario_id: usuarioId });
    return query;
  };

  // SELECT * FROM transacoes WHERE id = ? [AND usuario_id = ?] LIMIT 1
  const buscarPorId = async (id, usuarioId = null) => {
    const query = knex(TABELA).where({ id });
    if (usuarioId) query.where({ usuario_id: usuarioId });
    return query.first();
  };

  // INSERT INTO transacoes (...) VALUES (...)
  // Recebe { descricao, valor, tipo, usuario_id }
  // Retorna o id gerado pelo SQLite (auto-incremento) e monta o objeto completo
  const criarTransacao = async (transacao) => {
    const [id] = await knex(TABELA).insert(transacao);
    return { id, ...transacao };
  };

  // UPDATE transacoes SET ... WHERE id = ? [AND usuario_id = ?]
  // Verifica se a transação existe (e pertence ao usuário) antes de atualizar.
  // Retorna null se não existir/não pertencer.
  const atualizarTransacao = async (id, transacaoAtualizada, usuarioId = null) => {
    const query = knex(TABELA).where({ id });
    if (usuarioId) query.where({ usuario_id: usuarioId });
    const transacao = await query.first();
    if (!transacao) return null;
    await query.update(transacaoAtualizada);
    return { id, ...transacaoAtualizada };
  }

  // DELETE FROM transacoes WHERE id = ? [AND usuario_id = ?]
  // Verifica se a transação existe (e pertence ao usuário) antes de remover.
  // Retorna null se não existir/não pertencer.
  const deletarTransacao = async (id, usuarioId = null) => {
    const query = knex(TABELA).where({ id });
    if (usuarioId) query.where({ usuario_id: usuarioId });
    const transacao = await query.first();
    if (!transacao) return null;
    await knex(TABELA).where({ id }).del();
    return transacao;
  };

  return {
    listarTodas,
    buscarPorId,
    criarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
};
