// ============================================================
// services/transacoesService.js - Regras de negócio de transações
// ============================================================
// Concentra as regras de negócio das transações e delega o acesso
// aos dados ao Repository (que conversa com o SQLite via Knex).
//
// Padrão de retorno: { kind, body }
//   - kind: "SUCCESS" | "VALIDATION" | "NOT_FOUND"
//   - body: dados ou mensagem de erro
//
// IMPORTANTE: toda transação pertence a UM usuário (usuarioId).
// As operações de listar/atualizar/deletar são filtradas por
// usuário, garantindo que cada usuário só acesse as próprias.
//
// Conceito: em operações sensíveis, o ownership (dono do recurso)
// é validado no service e aplicado na query do repository.

const { validarTipo, validarValor, paraCentavos } = require("../validators/transacaoValidator");
const transacoesRepository = require("../repositories/transacoesRepository");
const usuariosRepository = require("../repositories/usuariosRepository");

module.exports = () => {
  const repository = transacoesRepository();
  const usuariosRepositoryInstance = usuariosRepository();
  const paraResposta = ({ valor, ...transacao }) => ({ ...transacao, valor: Number(valor) / 100 });

  // GET → lista as transações do usuário informado
  const listarTransacoes = async (usuarioId) => {
    const transacoes = await repository.listarTodas(usuarioId);
    return { kind: "SUCCESS", body: transacoes.map(paraResposta) };
  };

  // POST → valida os dados e cria uma nova transação para o usuário
  const cadastrarTransacao = async ({ descricao, valor, tipo, usuarioId } = {}) => {
    // 1) Campos obrigatórios (incluindo o usuário dono da transação)
    if (typeof descricao !== "string" || !descricao.trim() || valor === undefined || valor === null || !tipo || !usuarioId) {
      return { kind: "VALIDATION", body: { message: "Todos os campos são obrigatórios" } };
    }

    // 2) Garante que o usuário informado existe no banco (integridade da FK)
    const usuarioExiste = await usuariosRepositoryInstance.buscarPorId(usuarioId);
    if (!usuarioExiste) {
      return { kind: "VALIDATION", body: { message: "Usuário não encontrado" } };
    }

    // 3) Tipo só pode ser 'entrada' ou 'saida'
    if (!validarTipo(tipo)) {
      return {
        kind: "VALIDATION",
        body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" },
      };
    }

    // 4) Valor deve ser número positivo
    const erroValor = validarValor(valor);
    if (erroValor) {
      return { kind: "VALIDATION", body: { message: erroValor } };
    }

    // 5) Persiste no banco (gravando o usuarioId)
    const transacaoCriada = await repository.criarTransacao({
      descricao: descricao.trim(), valorCentavos: paraCentavos(valor), tipo, usuarioId,
    });

    return {
      kind: "SUCCESS",
      body: { message: "Transação cadastrada com sucesso!", transacao: paraResposta(transacaoCriada) },
    };
  };

  // PUT → atualiza parcialmente (apenas os campos enviados), sempre do próprio usuário
  const atualizarTransacao = async (idParam, { descricao, valor, tipo, usuarioId } = {}) => {
    // 1) Valida o id recebido na URL
    const id = Number(idParam);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return { kind: "VALIDATION", body: { message: "ID inválido." } };
    }

    // 2) Garante que a transação existe E pertence ao usuário
    const transacao = await repository.buscarPorId(id, usuarioId);
    if (!transacao) {
      return { kind: "NOT_FOUND", body: { message: "Transação não encontrada" } };
    }

    // 3) Monta dinamicamente apenas os campos que foram enviados no body
    const dadosAtualizados = {};

    if (descricao === undefined && valor === undefined && tipo === undefined) {
      return { kind: "VALIDATION", body: { message: "Informe ao menos um campo para atualizar" } };
    }

    if (descricao !== undefined) {
      if (typeof descricao !== "string" || !descricao.trim()) {
        return { kind: "VALIDATION", body: { message: "A descrição da transação não pode ser vazia" } };
      }
      dadosAtualizados.descricao = descricao.trim();
    }

    if (valor !== undefined) {
      const erroValor = validarValor(valor);
      if (erroValor) return { kind: "VALIDATION", body: { message: erroValor } };
      dadosAtualizados.valor = paraCentavos(valor);
    }

    if (tipo !== undefined) {
      if (!validarTipo(tipo)) {
        return {
          kind: "VALIDATION",
          body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" },
        };
      }
      dadosAtualizados.tipo = tipo;
    }

    // 4) Persiste a atualização no banco (filtrado pelo usuário)
    const transacaoAtualizada = await repository.atualizarTransacao(id, dadosAtualizados, usuarioId);

    return {
      kind: "SUCCESS",
      body: { message: "Transação atualizada com sucesso!", transacao: paraResposta(transacaoAtualizada) },
    };
  };

  // DELETE → remove uma transação pelo id (apenas se pertencer ao usuário)
  const deletarTransacao = async (idParam, usuarioId) => {
    // 1) Valida o id recebido na URL
    const id = Number(idParam);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return { kind: "VALIDATION", body: { message: "ID inválido." } };
    }

    // 2) Remove a transação (repositório retorna null quando não existe / não pertence ao usuário)
    const transacaoRemovida = await repository.deletarTransacao(id, usuarioId);
    if (!transacaoRemovida) {
      return { kind: "NOT_FOUND", body: { message: "Transação não encontrada" } };
    }

    return {
      kind: "SUCCESS",
      body: { message: "Transação removida com sucesso.", deleted: true, transacao: paraResposta(transacaoRemovida) },
    };
  };

  return { listarTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao };
};
