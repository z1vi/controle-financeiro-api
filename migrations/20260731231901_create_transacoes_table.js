// ============================================================
// Migração: criação da tabela "transacoes"
// ============================================================
// exports.up   → aplica a migração (cria a tabela)
// exports.down → desfaz a migração (remove a tabela)

exports.up = function (knex) {
  return knex.schema.createTable("transacoes", (table) => {
    table.increments("id").primary();   // id auto-incrementável (SUBSTITUI o maxId manual!)
    table.string("descricao").notNullable(); // descrição da transação
    // Valor monetário em centavos, para não sofrer imprecisão de ponto flutuante.
    table.integer("valor").notNullable();
    table.string("tipo").notNullable();      // "entrada" (crédito) ou "saida" (débito)
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transacoes");
};
