// Service: concentra as regras de negócio e delega acesso a dados ao Repository.
// O Service NÃO sabe mais como os dados são armazenados.

const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = (usuarios) => {
  const repository = usuariosRepository(usuarios);

  const listarUsuarios = () => {
    return repository.listarTodos();
  };

  const cadastrarUsuario = ({ nome, email, senha } = {}) => {
    if (!nome || !email || !senha) {
      return {
        kind: "VALIDATION",
        body: {
          message: "Todos os campos são obrigatórios",
        },
      };
    }

    const usuarioExistente = repository.buscarPorEmail(email);
    if (usuarioExistente) {
      return {
        kind: "VALIDATION",
        body: {
          message: "Usuário já cadastrado",
        },
      };
    }

    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
    };

    repository.criarUsuario(novoUsuario);

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: nome,
      },
    };
  };

  const loginUsuario = ({ email, senha } = {}) => {
    const usuarioEncontrado = repository.buscarPorEmail(email);

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

