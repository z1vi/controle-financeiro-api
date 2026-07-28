// Repository: encapsula o acesso aos dados.
// Agora usa o banco de dados (SQLite via Knex) em vez de array em memória.

const knex = require("../database/knex");

module.exports = () => {
  const TABELA = "usuarios";

  const listarTodos = async () => {
    return knex(TABELA).select("*");
  };

  const buscarPorEmail = async (email) => {
    return knex(TABELA).where({ email }).first();
  };

  const criarUsuario = async (usuario) => {
    await knex(TABELA).insert(usuario);
    return usuario;
  };

  const buscarPorId = async (id) => {
    return knex(TABELA).where({ id }).first();
  };

  return {
    listarTodos,
    buscarPorEmail,
    criarUsuario,
    buscarPorId,
  };
};

