// Repository: encapsula o acesso aos dados.
// O Service não sabe mais como os dados são armazenados.

module.exports = (usuarios) => {
  const listarTodos = () => {
    return usuarios;
  };

  const buscarPorEmail = (email) => {
    return usuarios.find((usuario) => usuario.email === email);
  };

  const criarUsuario = (usuario) => {
    usuarios.push(usuario);
    return usuario;
  };

  return {
    listarTodos,
    buscarPorEmail,
    criarUsuario,
  };
};

