// ============================================================
// knexfile.js - Configuração do Knex CLI / Migrations
// ============================================================
// Define os ambientes (aqui apenas "development").
// Usado pelos comandos: npx knex migrate:latest, etc.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/controle-financeiro.db",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations",
    },
  },
};
