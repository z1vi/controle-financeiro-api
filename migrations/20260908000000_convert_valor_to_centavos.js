// Registros da versão anterior guardavam reais em ponto flutuante.
// A partir desta migração a coluna valor guarda somente centavos inteiros.
exports.up = async function (knex) {
  await knex("transacoes").update({ valor: knex.raw("ROUND(valor * 100)") });
};

exports.down = async function (knex) {
  await knex("transacoes").update({ valor: knex.raw("valor / 100.0") });
};
