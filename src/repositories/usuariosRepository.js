// ============================================================
// repositories/usuariosRepository.js - Acesso aos dados
// ============================================================
// Encapsula todas as operações de banco dos usuários.
// Única camada que conhece o SQLite (via Knex).
//
// Conceito: Repository - camada de persistência isolada.
// Services e controllers não sabem como os dados são armazenados.

const knex = require("../database/knex");

module.exports = () => {
  const TABELA = "usuarios";

  // SELECT * FROM usuarios → retorna todos os usuários
  const listarTodos = async () => {
    return knex(TABELA).select("*");
  };

  // INSERT INTO usuarios (...) VALUES (...)
  const criarUsuario = async (usuario) => {
    const [id] = await knex(TABELA).insert(usuario);
    return { id, ...usuario };
  };

  // SELECT * FROM usuarios WHERE email = ? LIMIT 1
  const buscarPorEmail = async (email) => {
    return knex(TABELA).where({ email }).first();
  };

  // SELECT * FROM usuarios WHERE id = ? LIMIT 1
  const buscarPorId = async (id) => {
    return knex(TABELA).where({ id }).first();
  };

  // DELETE FROM usuarios WHERE id = ?
  const deletarUsuario = async (id) => {
    const usuario = await buscarPorId(id);
    if (!usuario) return null;
    await knex(TABELA).where({ id }).del();
    return usuario;
  };

  return {
    listarTodos,
    buscarPorEmail,
    criarUsuario,
    buscarPorId,
    deletarUsuario,
  };
};
