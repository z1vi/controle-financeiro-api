// ============================================================
// services/transacoesService.js - Regras de negócio de transações
// ============================================================
// Este service concentra as regras de negócio e DELEGA o acesso
// aos dados ao Repository (que conversa com o SQLite via Knex).
// Padrão de retorno: { kind, body }
//   - kind: "SUCCESS" | "VALIDATION" | "NOT_FOUND"
//   - body: dados ou mensagem de erro

const { validarTipo, validarValor } = require("../validadores");
const transacoesRepository = require("../repositories/transacoesRepository");

module.exports = () => {
  const repository = transacoesRepository();

  // GET → lista todas as transações do banco
  const listarTransacoes = async () => {
    const transacoes = await repository.listarTodas();
    return { kind: "SUCCESS", body: transacoes };
  };

  // POST → valida os dados e cria uma nova transação
  const cadastrarTransacao = async ({ descricao, valor, tipo } = {}) => {
    // 1) Campos obrigatórios
    if (!descricao || valor === undefined || valor === null || !tipo) {
      return { kind: "VALIDATION", body: { message: "Todos os campos são obrigatórios" } };
    }

    // 2) Tipo só pode ser 'entrada' ou 'saida'
    if (!validarTipo(tipo)) {
      return { kind: "VALIDATION", body: { message: "O tipo da transação deve ser apenas 'entrada' ou 'saida'" } };
    }

    // 3) Valor deve ser número positivo
    const erroValor = validarValor(valor);
    if (erroValor) {
      return { kind: "VALIDATION", body: { message: erroValor } };
    }

    // 4) Persiste no banco
    const transacaoCriada = await repository.criarTransacao({ descricao, valor, tipo });

    return {
      kind: "SUCCESS",
      body: { message: "Transação cadastrada com sucesso!", transacao: transacaoCriada },
    };
  };

  // PUT → atualiza parcialmente (apenas os campos enviados)
  const atualizarTransacao = async (idParam, { descricao, valor, tipo } = {}) => {
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

    // 2) Garante que a transação existe
    const transacao = await repository.buscarPorId(id);
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

    // 4) Persiste a atualização no banco
    const transacaoAtualizada = await repository.atualizarTransacao(id, dadosAtualizados);

    return { kind: "SUCCESS", body: { message: "Transação atualizada com sucesso!", transacao: transacaoAtualizada } };
  };

  // DELETE → remove uma transação pelo id
  const deletarTransacao = async (idParam) => {
    const id = parseInt(idParam, 10);
    const transacaoRemovida = await repository.deletarTransacao(id);

    // Repositório retorna null quando o id não existe
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
