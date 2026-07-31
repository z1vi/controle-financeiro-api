exports.up = function (knex) {
  return knex.schema.createTable("transacoes", (table) => {
    table.increments("id").primary();   // id auto-incrementável (SUBSTITUI o maxId manual!)
    table.string("descricao").notNullable();
    table.decimal("valor").notNullable();
    table.string("tipo").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transacoes");
};
