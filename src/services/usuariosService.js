// ============================================================
// services/usuariosService.js - Regras de negócio de usuários
// ============================================================
// Concentra as regras de negócio de USUÁRIOS e delega o acesso
// aos dados ao Repository. O Service NÃO sabe como os dados são
// armazenados (SQLite via Knex).
//
// A autenticação (register/login) NÃO fica mais aqui: foi movida
// para services/authService.js.
//
// Padrão de retorno: { kind, body }
//   - kind: "SUCCESS"
//
// Conceito: cada service tem uma responsabilidade única.

const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = () => {
  const repository = usuariosRepository();

  // GET → lista todos os usuários (sem expor a senha)
  const listarUsuarios = async () => {
    const usuarios = await repository.listarTodos();

    // Remove a senha de cada usuário antes de responder
    const usuariosPublicos = usuarios.map(({ senha, ...resto }) => resto);

    return {
      kind: "SUCCESS",
      body: usuariosPublicos,
    };
  };

  return {
    listarUsuarios,
  };
};
