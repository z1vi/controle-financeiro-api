const login = async (email, senha) => {
    const usuario = await usuariosRepository.buscarPorEmail(email);
    if (!usuario) {
        throw new Error('Usuario não encontrado');
    }
};
    