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