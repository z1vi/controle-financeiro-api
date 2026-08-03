// ============================================================
// services/usuariosService.js - Regras de negócio de usuários
// ============================================================
// Concentra as regras de negócio e delega o acesso a dados ao
// Repository. O Service NÃO sabe como os dados são armazenados
// (agora via SQLite + Knex, de forma assíncrona).
// Padrão de retorno: { kind, body }
//   - kind: "SUCCESS" | "VALIDATION" | "AUTH"

const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = () => {
  const repository = usuariosRepository();

  // GET → lista todos os usuários
  const listarUsuarios = async () => {
    const usuarios = await repository.listarTodos();
    return {
      kind: "SUCCESS",
      body: usuarios,
    };
  };

  // POST → cria um novo usuário (com validações de negócio)
  const cadastrarUsuario = async ({ nome, email, senha } = {}) => {
    // 1) Campos obrigatórios
    if (!nome || !email || !senha) {
      return {
        kind: "VALIDATION",
        body: {
          message: "Todos os campos são obrigatórios",
        },
      };
    }

    // 2) Evita cadastro duplicado (email único no banco)
    const usuarioExistente = await repository.buscarPorEmail(email);
    if (usuarioExistente) {
      return {
        kind: "VALIDATION",
        body: {
          message: "Usuário já cadastrado",
        },
      };
    }

    // 3) Monta o objeto e persiste no banco
    const novoUsuario = {
      nome,
      email,
      senha,
    };

    await repository.criarUsuario(novoUsuario);

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: nome,
      },
    };
  };

  // POST /login → autentica o usuário (email + senha)
  const loginUsuario = async ({ email, senha } = {}) => {
    // 1) Busca o usuário pelo email
    const usuarioEncontrado = await repository.buscarPorEmail(email);

    // 2) Não existe usuário com esse email
    if (!usuarioEncontrado) {
      return {
        kind: "AUTH",
        body: {
          message: "Usuário não encontrado",
        },
      };
    }

    // 3) Senha incorreta (comparação simples - sem hash por enquanto)
    if (usuarioEncontrado.senha !== senha) {
      return {
        kind: "AUTH",
        body: {
          message: "Senha incorreta",
        },
      };
    }

    // 4) Credenciais corretas → login bem-sucedido
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

