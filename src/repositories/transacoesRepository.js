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

  // SELECT * FROM transacoes → retorna todas as transações
  const listarTodas = async () => {
    return knex(TABELA).select("*");
  };

  // SELECT * FROM transacoes WHERE id = ? LIMIT 1
  const buscarPorId = async (id) => {
    return knex(TABELA).where({ id }).first();
  };

  // INSERT INTO transacoes (...) VALUES (...)
  // Retorna o id gerado pelo SQLite (auto-incremento) e monta o objeto completo
  const criarTransacao = async (transacao) => {
    const [id] = await knex(TABELA).insert(transacao);
    return { id, ...transacao };
  };

  // UPDATE transacoes SET ... WHERE id = ?
  // Retorna null se a transação não existir
  const atualizarTransacao = async (id, transacaoAtualizada) => {
    const transacao = await knex(TABELA).where({ id }).first();
    if (!transacao) return null;
    await knex(TABELA).where({ id }).update(transacaoAtualizada);
    return { id, ...transacaoAtualizada };
  }

  // DELETE FROM transacoes WHERE id = ?
  // Retorna null se a transação não existir
  const deletarTransacao = async (id) => {
    const transacao = await knex(TABELA).where({ id }).first();
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
