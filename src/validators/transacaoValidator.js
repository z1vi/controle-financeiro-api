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

  // 2) Tipo: deve ser finito (ex.: "10", NaN e Infinity não são aceitos)
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return "O valor da transação deve ser um número";
  }

  // 3) Regra de negócio: não pode ser zerado ou negativo
  if (valor <= 0) {
    return "O valor da transação deve ser maior que zero";
  }

  const centavos = Math.round(valor * 100);
  if (!Number.isSafeInteger(centavos) || Math.abs(valor * 100 - centavos) > Number.EPSILON * 100) {
    return "O valor da transação deve ter no máximo duas casas decimais";
  }

  // Passou em todas as validações → sem erro
  return null;
};

const paraCentavos = (valor) => Math.round(valor * 100);

module.exports = {
  validarTipo,
  validarValor,
  paraCentavos,
};
