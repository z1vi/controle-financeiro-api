// ============================================================
// repositories/usuariosRepository.js - Acesso aos dados
// ============================================================
// Encapsula todas as operações de banco dos usuários.
// Única camada que conhece o SQLite (via Knex).

const knex = require("../database/knex");

module.exports = () => {
  // Nome da tabela no banco de dados
  const TABELA = "usuarios";

  // SELECT * FROM usuarios → retorna todos os usuários
  const listarTodos = async () => {
    return knex(TABELA).select("*");
  };

  // SELECT * FROM usuarios WHERE email = ? LIMIT 1
  // Usado no cadastro (verificar duplicidade) e no login
  const buscarPorEmail = async (email) => {
    return knex(TABELA).where({ email }).first();
  };

  // INSERT INTO usuarios (...) VALUES (...)
  const criarUsuario = async (usuario) => {
    await knex(TABELA).insert(usuario);
    return usuario;
  };

  // SELECT * FROM usuarios WHERE id = ? LIMIT 1
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

