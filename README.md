# API de Controle Financeiro

API REST para cadastro, autenticação e controle de transações pessoais. Cada transação pertence ao usuário autenticado; não há endpoints públicos para listar ou apagar contas.

## Requisitos e execução

```bash
npm install
copy .env.example .env
npm run migrate
npm start
```

Defina um `JWT_SECRET` longo e aleatório no `.env`. Em produção, defina também `CORS_ORIGIN` com a URL exata do frontend.

## Endpoints

| Método | Rota | Autenticação | Corpo |
| --- | --- | --- | --- |
| POST | `/auth/register` | Não | `nome`, `email`, `senha` (mín. 8 caracteres) |
| POST | `/auth/login` | Não | `email`, `senha` |
| GET | `/transacoes` | Bearer | — |
| POST | `/transacoes` | Bearer | `descricao`, `valor`, `tipo` (`entrada` ou `saida`) |
| PUT | `/transacoes/:id` | Bearer | Ao menos um dos campos da transação |
| DELETE | `/transacoes/:id` | Bearer | — |
| GET | `/saldo` | Bearer | — |

Use `Authorization: Bearer <token>` nas rotas protegidas. Valores são enviados em reais com, no máximo, duas casas decimais; internamente são armazenados em centavos.

## Qualidade

```bash
npm test
```

Os testes usam um banco SQLite isolado em `tmp/`, validando autenticação, validações, isolamento de dados por usuário, CRUD e saldo.
