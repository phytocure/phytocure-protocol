# Architecture Overview

## System Design

```
Browser → Vite Dev Server (React)
             ↓ REST API (OpenAPI contract)
         Express 5 Server
             ↓
         PostgreSQL (Drizzle ORM)
```

## Packages

| Package | Role |
|---------|------|
| `@workspace/phytocure` | React frontend |
| `@workspace/api-server` | Express REST API |
| `@workspace/api-spec` | OpenAPI 3.0 spec (source of truth) |
| `@workspace/api-client-react` | Generated React Query hooks + Zod schemas |
| `@workspace/db` | Drizzle schema and migrations |

## API Contract

All API routes are defined in `lib/api-spec/openapi.yaml`.
Run `pnpm --filter @workspace/api-spec run codegen` to regenerate typed hooks and Zod schemas.
The server uses Zod schemas to validate all inputs and outputs.

## Blockchain

Wallet connection via `window.solana` (Phantom) or `window.solflare` (Solflare).
Payments use `@solana/web3.js` for real SOL transfers to treasury.
Treasury wallet: `5BNvMkDC4eeNzxrUJjgeUU5eSJcSfwPriMcrsuxaphet`

## Routing

A global reverse proxy routes traffic by path:
- `/` → React frontend (Vite)
- `/api` → Express API server (port 8080)
