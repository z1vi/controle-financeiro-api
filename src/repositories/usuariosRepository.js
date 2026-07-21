const buscarPorEmail = (usuarios, email) => {
    return usuarios.find((usuario) => usuario.email === email);
};

const criarUsuario = (usuarios, novoUsuario) => {
    usuarios.push(novoUsuario);
    return novoUsuario;
}

module.exports = {
    buscarPorEmail,
    criarUsuario,
};