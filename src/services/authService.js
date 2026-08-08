// ============================================================
// services/authService.js - Regras de negócio de autenticação
// ============================================================
// Responsável por registrar (register) e autenticar (login)
// usuários. Acessa os dados via usuariosRepository.
//
// IMPORTANTE: a senha ainda NÃO é armazenada com hash porque o
// bcrypt será adicionado em uma etapa futura. Quando isso ocorrer,
// a comparação de senha aqui será via bcrypt.compare() e o retorno
// incluirá um token JWT.
//
// Padrão de retorno: { kind, body }
//   - kind: "SUCCESS" | "VALIDATION" | "AUTH"
//
// Conceito: separação da autenticação (auth) da lógica de usuários
// e transações, preparando o caminho para bcrypt + JWT.

const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = () => {
  const repository = usuariosRepository();

  // POST /auth/register → cria um novo usuário
  const register = async ({ nome, email, senha } = {}) => {
    // 1) Campos obrigatórios
    if (!nome || !email || !senha) {
      return {
        kind: "VALIDATION",
        body: { message: "Todos os campos são obrigatórios" },
      };
    }

    // 2) Evita cadastro duplicado (email único no banco)
    const usuarioExistente = await repository.buscarPorEmail(email);
    if (usuarioExistente) {
      return {
        kind: "VALIDATION",
        body: { message: "Usuário já cadastrado" },
      };
    }

    // 3) TODO futuro: aqui vamos gerar o hash da senha com bcrypt
    //    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = {
      nome,
      email,
      senha,
    };

    const usuarioCriado = await repository.criarUsuario(novoUsuario);

    // Retorna o usuário SEM a senha
    const { senha: _senha, ...usuarioPublico } = usuarioCriado;

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: usuarioPublico,
      },
    };
  };

  // POST /auth/login → autentica o usuário (email + senha)
  const login = async ({ email, senha } = {}) => {
    // 1) Busca o usuário pelo email
    const usuarioEncontrado = await repository.buscarPorEmail(email);

    // 2) Não existe usuário com esse email
    if (!usuarioEncontrado) {
      return {
        kind: "AUTH",
        body: { message: "Credenciais inválidas" },
      };
    }

    // 3) TODO futuro: comparar com bcrypt.compare(senha, usuario.senha)
    //    Em vez de comparação direta de texto puro.
    if (usuarioEncontrado.senha !== senha) {
      return {
        kind: "AUTH",
        body: { message: "Credenciais inválidas" },
      };
    }

    // 4) TODO futuro: gerar e retornar um token JWT aqui
    //    const token = jwt.sign({ id: usuario.id }, SEGREDO, { expiresIn: "1d" });

    // 5) Credenciais corretas → login bem-sucedido
    const { senha: _senha, ...usuarioPublico } = usuarioEncontrado;

    return {
      kind: "SUCCESS",
      body: {
        message: "Login realizado com sucesso!",
        usuario: usuarioPublico,
      },
    };
  };

  return {
    register,
    login,
  };
};
