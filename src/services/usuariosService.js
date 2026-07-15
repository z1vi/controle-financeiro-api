// Service recebe o array em memória e concentra as regras de negócio.

module.exports = (usuarios) => {
  const listarUsuarios = () => {
    return {
      statusCode: 200,
      body: usuarios,
    };
  };

  const cadastrarUsuario = ({ nome, email, senha } = {}) => {
    if (!nome || !email || !senha) {
      return {
        statusCode: 400,
        body: {
          message: "Todos os campos são obrigatórios",
        },
      };
    }

    if (usuarios.some((usuario) => usuario.email === email)) {
      return {
        statusCode: 400,
        body: {
          message: "Já existe um usuário cadastrado com este e-mail.",
        },
      };
    }

    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
    };

    usuarios.push(novoUsuario);

    return {
      statusCode: 201,
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: novoUsuario,
      },
    };
  };

  const loginUsuario = ({ email, senha } = {}) => {
    const usuarioEncontrado = usuarios.find((usuario) => usuario.email === email);

    if (!usuarioEncontrado) {
      return {
        statusCode: 401,
        body: {
          message: "Usuário não encontrado",
        },
      };
    }

    if (usuarioEncontrado.senha !== senha) {
      return {
        statusCode: 401,
        body: {
          message: "Senha incorreta",
        },
      };
    }

    return {
      statusCode: 200,
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

