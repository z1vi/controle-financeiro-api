module.exports = (usuarios) => {
  const listarUsuarios = (req, res) => {
    return res.json(usuarios);
  };

  const cadastrarUsuario = (req, res) => {
    const novoUsuario = req.body;

    if (!novoUsuario?.nome || !novoUsuario?.email || !novoUsuario?.senha) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
      });
    }

    if (usuarios.some((usuario) => usuario.email === novoUsuario.email)) {
      return res.status(400).json({
        message: "Já existe um usuário cadastrado com este e-mail.",
      });
    }

    usuarios.push(novoUsuario);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: novoUsuario,
    });
  };

  return {
    listarUsuarios,
    cadastrarUsuario,
  };
};

