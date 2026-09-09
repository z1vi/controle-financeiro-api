// ============================================================
// services/authService.js - Lógica de autenticação do sistema
// ============================================================
// Aqui fica a regra de negócio da autenticação: criar conta,
// validar dados e fazer login de um usuário.
//
// Essa camada conversa com o repositório, mas não conhece
// detalhes do banco. Ela apenas decide o que fazer com os dados.
//
// Padrão de retorno:
//   { kind, body }
//   - kind: "SUCCESS" | "VALIDATION" | "AUTH"
//
// Em resumo:
//   - SUCCESS → operação concluída com sucesso
//   - VALIDATION → dados inválidos ou ausentes
//   - AUTH → erro de autenticação (credenciais inválidas)
//
// Esse arquivo prepara a aplicação para evoluir com bcrypt + JWT
// de forma organizada e segura.

const usuariosRepository = require("../repositories/usuariosRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = () => {
  const repository = usuariosRepository();
  const emailValido = (email) =>
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarCadastro = (nome, email, senha) => {
    if (typeof nome !== "string" || !nome.trim() || !email || !senha) {
      return "Todos os campos são obrigatórios";
    }
    if (!emailValido(email)) return "E-mail inválido";
    if (typeof senha !== "string" || senha.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres";
    }
    return null;
  };

  // POST /auth/register → cria uma nova conta para o usuário
  const register = async ({ nome, email, senha } = {}) => {
    // 1) Verifica se os campos essenciais foram enviados
    const erroValidacao = validarCadastro(nome, email, senha);
    if (erroValidacao) {
      return {
        kind: "VALIDATION",
        body: { message: erroValidacao },
      };
    }

    nome = nome.trim();
    email = email.trim().toLowerCase();

    // 2) Evita que o mesmo e-mail seja cadastrado mais de uma vez
    const usuarioExistente = await repository.buscarPorEmail(email);
    if (usuarioExistente) {
      return {
        kind: "VALIDATION",
        body: { message: "Usuário já cadastrado" },
      };
    }

    // 3) Cria um hash da senha para não armazenar a senha em texto puro
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      email,
      senha: senhaHash,
    };

    const usuarioCriado = await repository.criarUsuario(novoUsuario);

    // Remove a senha antes de devolver o usuário para o cliente
    const { senha: _senha, ...usuarioPublico } = usuarioCriado;

    return {
      kind: "SUCCESS",
      body: {
        message: "Usuário cadastrado com sucesso!",
        usuario: usuarioPublico,
      },
    };
  };

  // POST /auth/login → valida o e-mail e a senha do usuário
  const login = async ({ email, senha } = {}) => {
    // 1) Confere se o cliente enviou os dados básicos do login
    if (typeof email !== "string" || typeof senha !== "string" || !email || !senha) {
      return {
        kind: "VALIDATION",
        body: { message: "Email e senha são obrigatórios" },
      };
    }

    // 2) Busca o usuário pelo e-mail informado
    const usuarioEncontrado = await repository.buscarPorEmail(email.trim().toLowerCase());

    // 3) Se não existir esse usuário, a autenticação falha
    if (!usuarioEncontrado) {
      return {
        kind: "AUTH",
        body: { message: "Credenciais inválidas" },
      };
    }

    // 4) Compara a senha digitada com o hash guardado no banco
    const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

    // 5) Se a comparação falhar, as credenciais não são válidas
    if (!senhaValida) {
      return {
        kind: "AUTH",
        body: { message: "Credenciais inválidas" },
      };
    }

    // 6) gera um token JWT para o usuário logado (payload mínimo: id do usuário)
    const token = jwt.sign(
      {id: usuarioEncontrado.id},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    // 7) Se chegou até aqui, o login foi bem-sucedido
    const { senha: _senha, ...usuarioPublico } = usuarioEncontrado;

    return {
      kind: "SUCCESS",
      body: {
        message: "Login realizado com sucesso!",
        usuario: usuarioPublico,
        token,
      },
    };
  };

  return {
    register,
    login,
  };
};
