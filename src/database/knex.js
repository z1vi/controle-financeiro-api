const knex = require('knex')({

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/database/controle_financeiro.db'
    },
    useNullAsDefault: true
});

module.exports = connection;