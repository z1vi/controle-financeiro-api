# TODO - Refatoração do Controle Financeiro API

## FASE 1 - Organização de arquivos
- [x] Criar `src/utils/erroPadrao.js` (classe AppError)
- [x] Criar `src/middlewares/asyncHandler.js`
- [x] Criar `src/middlewares/errorHandler.js`
- [x] Criar `src/middlewares/authMiddleware.js` (placeholder p/ JWT)
- [x] Criar `src/validators/transacaoValidator.js` (mover validadores)
- [x] Remover pasta vazia `src/database/migrations/`
- [x] Remover `src/validadores.js` antigo

## FASE 2 - Padronização de Services
- [x] Criar `authService.js` completo (register/login)
- [x] Remover `loginUsuario` de `usuariosService`
- [x] Padronizar `usuario_id` → `usuarioId` nos services
- [x] Não expor senha em respostas

## FASE 3 - Padronização de Controllers
- [x] Criar `authController.js` completo
- [x] Remover `loginUsuario` de `usuariosController`
- [x] Padronizar status HTTP via `{ kind, body }`

## FASE 4 - Padronização de Repositories
- [x] Padronizar `usuario_id` → `usuarioId` nos repositories
- [x] Criar migração `created_at`/`updated_at` em `usuarios`

## FASE 5 - Tratamento de erros centralizado
- [x] Registrar `errorHandler` no `server.js`
- [x] Usar `asyncHandler` nos controllers

## FASE 6 - Preparação para autenticação
- [x] `authMiddleware` placeholder documentado

## FASE 7 - Consistência (server.js e rotas)
- [x] Atualizar `server.js` (rotas + export app)
- [x] Atualizar `routes/usuarios.js`, `transacoes.js`, `balance.js`
- [x] Criar `routes/authRoutes.js` completo

## Testes
- [x] Rodar migração `npx knex migrate:latest`
- [x] Testar servidor (`npm start`)
  - [x] POST /auth/register → 201
  - [x] POST /auth/login → 200
  - [x] GET /transacoes sem auth → 401
  - [x] POST /transacoes?usuarioId=3 → 201
  - [x] GET /saldo?usuarioId=3 → 200 (balance 1500)
  - [x] GET /transacoes?usuarioId=3 → 200
  - [x] GET /usuarios → 200 (sem senha)
