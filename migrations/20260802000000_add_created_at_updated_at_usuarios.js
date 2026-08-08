// ============================================================
// Migração: adiciona created_at e updated_at na tabela "usuarios"
// ============================================================
// Campos de auditoria/timestamps que registram quando o registro
// foi criado e a última vez que foi atualizado.
//
// OBSERVAÇÃO (SQLite): uma coluna adicionada via ALTER TABLE não
// pode ter default dinâmico (CURRENT_TIMESTAMP). Por isso as colunas
// são adicionadas nullable. O preenchimento será tratado na camada
// de aplicação (service) ou em uma futura migração de recriação da
// tabela, junto com a implementação de validação de email da autenticação.
//
// Conceito: boas práticas de modelagem de dados - quase toda
// tabela deve ter created_at/updated_at.

exports.up = function (knex) {
  return knex.schema.table("usuarios", (table) => {
    table.timestamp("created_at").nullable();
    table.timestamp("updated_at").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("usuarios", (table) => {
    table.dropColumn("created_at");
    table.dropColumn("updated_at");
  });
};

