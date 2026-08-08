// ============================================================
// validators/transacaoValidator.js - Validações das transações
// ============================================================
// Módulo reutilizável com as regras de validação de uma transação.
// Convenção de retorno:
//   - validarTipo( tipo )        → boolean (true = válido)
//   - validarValor( valor )      → string com mensagem de erro, ou null se OK
//
// Conceito: separar validação em módulo próprio facilita testes
// e reuso entre service e controllers.

const validarTipo = (tipo) => {
  // Permitimos apenas 'entrada' (crédito) e 'saida' (débito)
  return tipo === "entrada" || tipo === "saida";
};

const validarValor = (valor) => {
  // 1) Campo obrigatório: undefined ou null não são aceitos
  if (valor === undefined || valor === null) {
    return "O valor da transação é obrigatório";
  }

  // 2) Tipo: deve ser numérico (ex.: "10" em string não é aceito)
  if (typeof valor !== "number") {
    return "O valor da transação deve ser um número";
  }

  // 3) Regra de negócio: não pode ser zerado ou negativo
  if (valor <= 0) {
    return "O valor da transação deve ser maior que zero";
  }

  // Passou em todas as validações → sem erro
  return null;
};

module.exports = {
  validarTipo,
  validarValor,
};
