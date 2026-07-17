// Service recebe o array em memória e concentra as regras de negócio.

module.exports = (usuarios) => {
  const listarUsuarios = () => {
    return usuarios;
  };

  const cadastrarUsuario = ({ nome, email, senha } = {}) => {
    if (!nome || !email || !senha) {
      return {
        error: true,
        kind: "VALIDATION",
        body: {
          message: "Todos os campos são obrigatórios",
        },
      };
    }


    if (usuarios.some((usuario) => usuario.email === email)) {
      return {
        error: true,
        kind: "VALIDATION",
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
      error: false,
      kind: "SUCCESS",
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
        error: true,
        kind: "AUTH",
        body: {
          message: "Usuário não encontrado",
        },
      };
    }

    if (usuarioEncontrado.senha !== senha) {
      return {
        error: true,
        kind: "AUTH",
        body: {
          message: "Senha incorreta",
        },
      };
    }

    return {
      error: false,
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

