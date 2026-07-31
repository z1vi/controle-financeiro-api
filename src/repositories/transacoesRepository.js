// Repository: encapsula o acesso aos dados das transações.
// Agora usa o banco de dados (SQLite via Knex) em vez de array em memória.

const knex = require("../database/knex");

module.exports = () => {
  const TABELA = "transacoes";

  const listarTodas = async () => {
    return knex(TABELA).select("*");
  };

  const buscarPorId = async (id) => {
    return knex(TABELA).where({ id }).first();
  };

  const criarTransacao = async (transacao) => {
    const [id] = await knex(TABELA).insert(transacao);
    return { id, ...transacao };
  };

  // MÉTODO NOVO: antes não existia porque o array era mutado direto no service.
  const atualizarTransacao = async (id, transacaoAtualizada) => {
    const transacao = await knex(TABELA).where({ id }).first();
    if (!transacao) return null;
    await knex(TABELA).where({ id }).update(transacaoAtualizada);
    return { id, ...transacaoAtualizada };
  }

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
