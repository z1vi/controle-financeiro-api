module.exports = (usuarios) => {
  const listarUsuarios = (req, res) => {
    return res.json(usuarios);
  };

  const cadastrarUsuario = (req, res) => {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
      });
    }

    if (usuarios.some((usuario) => usuario.email === email)) {
      return res.status(400).json({
        message: "Já existe um usuário cadastrado com este e-mail.",
      });
    }

    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
    };

    usuarios.push(novoUsuario);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: novoUsuario,
    });
  };

  const loginUsuario = (req, res) => {
    const { email, senha } = req.body || {};

    const usuarioEncontrado = usuarios.find((usuario) => usuario.email === email);

    if (!usuarioEncontrado) {
      return res.status(401).json({
        message: "Usuário não encontrado",
      });
    }

    if (usuarioEncontrado.senha !== senha) {
      return res.status(401).json({
        message: "Senha incorreta",
      });
    }

    return res.json({
      mesage: "Login realizado com sucesso!",
      usuario: usuarioEncontrado.nome,
    });
  };

  return {
    listarUsuarios,
    cadastrarUsuario,
    loginUsuario,
  };
};


