# Plano de Padronização: Controllers ↔ Services ✅

## ✅ 1. Services - Remover propriedade `error` (redundante)
- ✅ `services/transacoesService.js` — removido `error: true/false` dos 3 retornos
- ✅ `services/usuariosService.js` — removido `error: true/false` dos 2 retornos

## ✅ 2. Controller - Remover dead code `kind === "AUTH"` 
- ✅ `controllers/usuariosController.js` — removida condição `kind === "AUTH"` (nunca ocorria)

## ✅ 3. Controller - Mover `require` do service para o topo
- ✅ `controllers/usuariosController.js` — `require("../services/usuariosService")` movido para fora da factory

## ✅ 4. Balance - Extrair para arquitetura de camadas
- ✅ `services/balanceService.js` — criado service com cálculo de saldo
- ✅ `controllers/balanceController.js` — criado controller
- ✅ `routes/balance.js` — refatorado para usar controller
- ✅ `server.js` — injetado array `transacoes` na rota `/balance`

