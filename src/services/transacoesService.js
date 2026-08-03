// ============================================================
// services/transacoesService.js - Regras de negócio de transações
// ============================================================
// Este service concentra as regras de negócio e DELEGA o acesso
// aos dados ao Repository (que conversa com o SQLite via Knex).
// Padrão de retorno: { kind, body }
//   - kind: "SUCCESS" | "VALIDATION" | "NOT_FOUND"
//   - body: dados ou mensagem de erro
//
// IMPORTANTE: agora toda transação pertence a UM usuário (usuario_id).
// As operações de listar/atualizar/deletar são filtradas por usuário,
// garantindo que cada usuário só acesse as próprias transações.

const { validarTipo, validarValor } = require("../validadores");
const transacoesRepository = require("../repositories/transacoesRepository");
const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = () => {
  const repository = transacoesRepository();
  const userRepository = usuariosRepository();

  // GET → lista as transações do usuário informado
  const listarTransacoes = async (usuario_id) => {
    const transacoes = await repository.listarTodas(usuario_id);
    return { kind: "SUCCESS", body: transacoes };
  };

  // POST → valida os dados e cria uma nova transação para o usuário
  const cadastrarTransacao = async ({ descricao, valor, tipo, usuario_id } = {}) => {
    // 1) Campos obrigatórios (incluindo o usuário dono da transação)
    if (!descricao || valor === undefined || valor === null || !tipo || !usuario_id) {
      return { kind: "VALIDATION", body: { message: "Todos os campos são obrigatórios" } };
    }

    // 2) Garante que o usuário informado existe no banco (integridade da FK)
    const usuarioExiste = await userRepository.buscarPorId(usuario_id);
    if (!usuarioExiste) {
      return { kind: "VALIDATION", body: { message: "Usuário não encontrado" } };
    }

    // 3) Tipo só pode ser 'entrada' ou 'saida'
    if (!validarTipo(tipo)) {
      return { kind: "VALIDATION", body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" } };
    }

    // 4) Valor deve ser número positivo
    const erroValor = validarValor(valor);
    if (erroValor) {
      return { kind: "VALIDATION", body: { message: erroValor } };
    }

    // 5) Persiste no banco (gravando o usuario_id)
    const transacaoCriada = await repository.criarTransacao({ descricao, valor, tipo, usuario_id });

    return {
      kind: "SUCCESS",
      body: { message: "Transação cadastrada com sucesso!", transacao: transacaoCriada },
    };
  };

  // PUT → atualiza parcialmente (apenas os campos enviados), sempre do próprio usuário
  const atualizarTransacao = async (idParam, { descricao, valor, tipo, usuario_id } = {}) => {
    // 1) Valida o id recebido na URL
    const id = parseInt(idParam, 10);
      if(Number.isNaN(id)) {
        return {
          kind: "VALIDATION",
          body: {
            message: "ID inválido." 

          }
        };
      }

    // 2) Garante que a transação existe E pertence ao usuário
    const transacao = await repository.buscarPorId(id, usuario_id);
    if (!transacao) {
      return { kind: "NOT_FOUND", body: { message: "Transação não encontrada" } };
    }

    // 3) Monta dinamicamente apenas os campos que foram enviados no body
    const dadosAtualizados = {};

    if (descricao !== undefined) {
      if (!descricao) return { kind: "VALIDATION", body: { message: "A descrição da transação não pode ser vazia" } };
      dadosAtualizados.descricao = descricao;
    }

    if (valor !== undefined) {
      const erroValor = validarValor(valor);
      if (erroValor) return { kind: "VALIDATION", body: { message: erroValor } };
      dadosAtualizados.valor = valor;
    }

    if (tipo !== undefined) {
      if (!validarTipo(tipo)) {
        return { kind: "VALIDATION", body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" } };
      }
      dadosAtualizados.tipo = tipo;
    }

    // 4) Persiste a atualização no banco (filtrado pelo usuário)
    const transacaoAtualizada = await repository.atualizarTransacao(id, dadosAtualizados, usuario_id);

    return { kind: "SUCCESS", body: { message: "Transação atualizada com sucesso!", transacao: transacaoAtualizada } };
  };

  // DELETE → remove uma transação pelo id (apenas se pertencer ao usuário)
  const deletarTransacao = async (idParam, usuario_id) => {
    const id = parseInt(idParam, 10);
    const transacaoRemovida = await repository.deletarTransacao(id, usuario_id);

    // Repositório retorna null quando a transação não existe / não pertence ao usuário
    if (!transacaoRemovida) {
      return { kind: "NOT_FOUND", body: { message: "Transação não encontrada" } };
    }

    return {
      kind: "SUCCESS",
      body: { message: "Transação removida com sucesso.", deleted: true, transacao: transacaoRemovida },
    };
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
