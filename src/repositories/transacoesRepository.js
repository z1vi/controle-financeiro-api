// ============================================================
// repositories/transacoesRepository.js - Acesso aos dados
// ============================================================
// Encapsula TODAS as operações de banco das transações.
// Única camada que conhece o SQLite (via Knex). Services e
// controllers não sabem como os dados são armazenados.
//
// Nomenclatura padronizada: usuarioId (camelCase) nas variáveis
// JS, mapeado para usuario_id na coluna do banco SQLite.
//
// Conceito: Repository - isolamento de acesso a dados.

const knex = require("../database/knex");

module.exports = () => {
  const TABELA = "transacoes";

  // SELECT * FROM transacoes [WHERE usuario_id = ?]
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
  // Recebe { descricao, valor, tipo, usuarioId }
  // Mapeia usuarioId → usuario_id para o banco SQLite
  const criarTransacao = async (transacao) => {
    const dadosBanco = {
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      usuario_id: transacao.usuarioId,
    };
    const [id] = await knex(TABELA).insert(dadosBanco);
    return { id, ...dadosBanco };
  };

  // UPDATE transacoes SET ... WHERE id = ? [AND usuario_id = ?]
  // Retorna null se não existir/não pertencer.
  const atualizarTransacao = async (id, transacaoAtualizada, usuarioId = null) => {
    const query = knex(TABELA).where({ id });
    if (usuarioId) query.where({ usuario_id: usuarioId });
    const transacao = await query.first();
    if (!transacao) return null;
    await query.update(transacaoAtualizada);
    return { id, ...transacaoAtualizada };
  };

  // DELETE FROM transacoes WHERE id = ? [AND usuario_id = ?]
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
