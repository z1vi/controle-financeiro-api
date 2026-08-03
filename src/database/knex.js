// ============================================================
// database/knex.js - Configuração da conexão com o banco de dados
// ============================================================
// Este arquivo exporta UMA instância única do Knex (padrão singleton).
// Todos os repositories importam este módulo para executar queries
// no SQLite (arquivo "controle-financeiro.db").

const knex = require('knex');

// Cria a conexão usando o driver SQLite3
const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/database/controle-financeiro.db'
    },
    // Necessário no SQLite para permitir campos sem valor default (NULL)
    useNullAsDefault: true
});

module.exports = connection;
