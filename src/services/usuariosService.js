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
const bcrypt = require("bcrypt");

module.exports = () => {
  const repository = usuariosRepository();

  // Cria um novo usuário no banco de dados. Retorna o usuário criado (sem a senha).
  const criarUsuario = async (nome, email, senha) => {
    if (!nome || !email || !senha) {
      return {
        kind: "VALIDATION",
        body: { message: "Todos os campos são obrigatórios" },
      };
    }

    const usuarioExistente = await repository.buscarPorEmail(email);
    if (usuarioExistente) {
      return {
        kind: "VALIDATION",
        body: { message: "Usuário já cadastrado" },
      };
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuarioCriado = await repository.criarUsuario({
      nome,
      email,
      senha: senhaHash,
    });

    const { senha: _senha, ...usuarioPublico } = usuarioCriado;

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: usuarioPublico,
      },
    };
  };

  // Verifica se o usuário existe no banco de dados pelo email. Retorna true ou false.
  const usuarioExiste = async (email) => {
    const usuario = await repository.buscarPorEmail(email);
    return !!usuario;
  };

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

  const deletarUsuario = async (idParam) => {
    const id = parseInt(idParam, 10);
    if (Number.isNaN(id)) {
      return { kind: "VALIDATION", body: { message: "ID inválido." } };
    }

    const usuarioRemovido = await repository.deletarUsuario(id);
    if (!usuarioRemovido) {
      return { kind: "NOT_FOUND", body: { message: "Usuário não encontrado." } };
    }

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário removido com sucesso.",
        usuario: usuarioRemovido,
      },
    };
  };

  return {
    listarUsuarios,
    criarUsuario,
    deletarUsuario,
  };
};
