// ============================================================
// Migração: adiciona a coluna "usuario_id" em "transacoes"
// e a transforma em Foreign Key para "usuarios.id"
// ============================================================
// Relacionamento: UM usuário tem MUITAS transações
// (transacoes.usuario_id → usuarios.id)
// ============================================================

exports.up = function (knex) {
  return knex.schema.table("transacoes", (table) => {
    // Coluna que guarda o id do usuário dono da transação.
    // Observação (SQLite): em ALTER TABLE, colunas com REFERENCES
    // precisam ser nullable (default NULL). A obrigatoriedade é
    // garantida na camada de Service/validação.
    table.integer("usuario_id").unsigned();

    // Define a Foreign Key: transacoes.usuario_id → usuarios.id
    table.foreign("usuario_id").references("id").inTable("usuarios");
  });
};

exports.down = function (knex) {
  return knex.schema.table("transacoes", (table) => {
    // Desfaz a migração: remove a coluna
    table.dropColumn("usuario_id");
  });
};
