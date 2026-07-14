// Validações reutilizáveis para endpoints de transações.
// Retorno (tipo): boolean.
// Retorno (valor): string com erro (ou null se estiver ok).

const validarTipo = (tipo) => {
  // Permitimos apenas 'entrada' (crédito) e 'saida' (débito)
  if (tipo === "entrada" || tipo === "saida") {
    return true;
  }

  return false;
};

const validarValor = (valor) => {
  if (valor === undefined || valor === null) {
    return "O valor da transação é obrigatório";
  }

  if (typeof valor !== "number") {
    return "O valor da transação deve ser um número";
  }

  if (valor <= 0) {
    return "O valor da transação deve ser maior que zero";
  }

  return null;
};

module.exports = {
  validarTipo,
  validarValor,
};

