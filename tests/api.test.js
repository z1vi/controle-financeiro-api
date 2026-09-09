const fs = require("fs");
const path = require("path");
const request = require("supertest");

const databasePath = path.join(__dirname, "..", "tmp", "api-test.db");
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "segredo-de-teste-longo-e-exclusivo";
process.env.DB_FILENAME = databasePath;
process.env.AUTH_RATE_LIMIT = "100";

const knex = require("../src/database/knex");
const app = require("../src/server");

let tokenA;
let tokenB;
let transacaoAId;
let transacaoBId;

beforeAll(async () => {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  fs.rmSync(databasePath, { force: true });
  await knex.migrate.latest({ directory: path.join(__dirname, "..", "migrations") });
});

afterAll(async () => {
  await knex.destroy();
  fs.rmSync(databasePath, { force: true });
});

describe("autenticação", () => {
  test("cadastra usuário, normaliza e-mail e não expõe senha", async () => {
    const resposta = await request(app).post("/auth/register").send({
      nome: "  Ana  ", email: "ANA@EXEMPLO.COM", senha: "senha-segura",
    });

    expect(resposta.status).toBe(201);
    expect(resposta.body.usuario).toMatchObject({ nome: "Ana", email: "ana@exemplo.com" });
    expect(resposta.body.usuario.senha).toBeUndefined();
  });

  test("rejeita cadastro inválido, e-mail duplicado e login sem campos", async () => {
    const invalido = await request(app).post("/auth/register").send({
      nome: "Ana", email: "invalido", senha: "123",
    });
    expect(invalido.status).toBe(400);

    const duplicado = await request(app).post("/auth/register").send({
      nome: "Outra", email: "ana@exemplo.com", senha: "senha-segura",
    });
    expect(duplicado.status).toBe(400);

    const loginInvalido = await request(app).post("/auth/login").send({ email: "ana@exemplo.com" });
    expect(loginInvalido.status).toBe(400);
  });

  test("autentica dois usuários independentes", async () => {
    const loginA = await request(app).post("/auth/login").send({
      email: "ANA@EXEMPLO.COM", senha: "senha-segura",
    });
    expect(loginA.status).toBe(200);
    tokenA = loginA.body.token;

    const cadastroB = await request(app).post("/auth/register").send({
      nome: "Bia", email: "bia@exemplo.com", senha: "outra-senha",
    });
    expect(cadastroB.status).toBe(201);

    const loginB = await request(app).post("/auth/login").send({
      email: "bia@exemplo.com", senha: "outra-senha",
    });
    expect(loginB.status).toBe(200);
    tokenB = loginB.body.token;
  });
});

describe("transações e saldo", () => {
  test("exige token e não expõe a antiga rota pública de usuários", async () => {
    expect((await request(app).get("/transacoes")).status).toBe(401);
    expect((await request(app).get("/usuarios")).status).toBe(404);
  });

  test("cria, lista e calcula saldo sem erro de precisão monetária", async () => {
    const criadaA = await request(app).post("/transacoes")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ descricao: "Mercado", valor: 10.25, tipo: "entrada" });
    expect(criadaA.status).toBe(201);
    expect(criadaA.body.transacao.valor).toBe(10.25);
    transacaoAId = criadaA.body.transacao.id;

    const criadaB = await request(app).post("/transacoes")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ descricao: "Conta", valor: 3.1, tipo: "saida" });
    expect(criadaB.status).toBe(201);
    transacaoBId = criadaB.body.transacao.id;

    const listaA = await request(app).get("/transacoes").set("Authorization", `Bearer ${tokenA}`);
    expect(listaA.status).toBe(200);
    expect(listaA.body).toHaveLength(1);
    expect(listaA.body[0].id).toBe(transacaoAId);

    const saldoA = await request(app).get("/saldo").set("Authorization", `Bearer ${tokenA}`);
    expect(saldoA.body).toEqual(expect.objectContaining({ balance: 10.25 }));
  });

  test("valida atualização e impede acesso à transação de outro usuário", async () => {
    const semCampos = await request(app).put(`/transacoes/${transacaoAId}`)
      .set("Authorization", `Bearer ${tokenA}`).send({});
    expect(semCampos.status).toBe(400);

    const valorInvalido = await request(app).put(`/transacoes/${transacaoAId}`)
      .set("Authorization", `Bearer ${tokenA}`).send({ valor: 10.123 });
    expect(valorInvalido.status).toBe(400);

    const idInvalido = await request(app).delete("/transacoes/1abc")
      .set("Authorization", `Bearer ${tokenA}`);
    expect(idInvalido.status).toBe(400);

    const acessoAlheio = await request(app).put(`/transacoes/${transacaoBId}`)
      .set("Authorization", `Bearer ${tokenA}`).send({ descricao: "Tentativa" });
    expect(acessoAlheio.status).toBe(404);

    const atualizada = await request(app).put(`/transacoes/${transacaoAId}`)
      .set("Authorization", `Bearer ${tokenA}`).send({ descricao: "Mercado mensal" });
    expect(atualizada.status).toBe(200);
    expect(atualizada.body.transacao).toMatchObject({ descricao: "Mercado mensal", valor: 10.25 });
  });

  test("remove apenas a própria transação", async () => {
    const acessoAlheio = await request(app).delete(`/transacoes/${transacaoBId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(acessoAlheio.status).toBe(404);

    const removida = await request(app).delete(`/transacoes/${transacaoBId}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect(removida.status).toBe(200);
    expect(removida.body.deleted).toBe(true);
  });
});
