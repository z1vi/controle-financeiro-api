// Service: concentra as regras de negócio e delega acesso a dados ao Repository.
// O Service NÃO sabe mais como os dados são armazenados.
// Agora trabalha de forma assíncrona com o banco de dados.

const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = () => {
  const repository = usuariosRepository();

  const listarUsuarios = async () => {
    const usuarios = await repository.listarTodos();
    return {
      kind: "SUCCESS",
      body: usuarios,
    };
  };

  const cadastrarUsuario = async ({ nome, email, senha } = {}) => {
    if (!nome || !email || !senha) {
      return {
        kind: "VALIDATION",
        body: {
          message: "Todos os campos são obrigatórios",
        },
      };
    }

    const usuarioExistente = await repository.buscarPorEmail(email);
    if (usuarioExistente) {
      return {
        kind: "VALIDATION",
        body: {
          message: "Usuário já cadastrado",
        },
      };
    }

    const novoUsuario = {
      nome,
      email,
      senha,
    };

    await repository.criarUsuario(novoUsuario);

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: nome,
      },
    };
  };

  const loginUsuario = async ({ email, senha } = {}) => {
    const usuarioEncontrado = await repository.buscarPorEmail(email);

    if (!usuarioEncontrado) {
      return {
        kind: "AUTH",
        body: {
          message: "Usuário não encontrado",
        },
      };
    }

    if (usuarioEncontrado.senha !== senha) {
      return {
        kind: "AUTH",
        body: {
          message: "Senha incorreta",
        },
      };
    }

    return {
      kind: "SUCCESS",
      body: {
        message: "Login realizado com sucesso!",
        usuario: usuarioEncontrado.nome,
      },
    };
  };

  return {
    listarUsuarios,
    cadastrarUsuario,
    loginUsuario,
  };
};

