// Repository: encapsula o acesso aos dados.
// O Service não sabe mais como os dados são armazenados.

module.exports = (usuarios) => {
  const listarTodos = () => {
    return usuarios;
  };

  const buscarPorEmail = (email) => {
    return usuarios.find((usuario) => usuario.email === email);
  };

  const criarUsuario = ({ nome, email, senha }) => {
    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
    };
    usuarios.push(novoUsuario);
    return novoUsuario;
  };

  return {
    listarTodos,
    buscarPorEmail,
    criarUsuario,
  };
};

