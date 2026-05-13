# Phytocure Protocol

> A Decentralized Science (DeSci) framework for clinical cannabis medicine with blockchain-verified prescriptions, AI-assisted strain analysis, and tokenized distribution — built on Solana.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Preprints.org](https://img.shields.io/badge/Preprints.org-ID%20213326-blue)](https://www.preprints.org/manuscript/213326)
[![Zenodo](https://img.shields.io/badge/Zenodo-DOI%2010.5281%2Fzenodo.20143620-blue)](https://doi.org/10.5281/zenodo.20143620)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0005--8307--2353-a6ce39)](https://orcid.org/0009-0005-8307-2353)
[![Live](https://img.shields.io/badge/Live-phytocure.xyz-A8E63D)](https://phytocure.xyz)

---

## Overview

Phytocure is an open-source DeSci platform that addresses three persistent gaps in clinical cannabis medicine:

1. **No standardized clinical protocol** — prescriptions are inconsistent and unverifiable
2. **No transparent supply chain** — distribution lacks on-chain traceability
3. **No open research infrastructure** — findings are siloed behind paywalls and gatekeepers

The Phytocure Protocol solves this by combining:
- On-chain prescription verification via **Solana blockchain**
- AI-assisted **cannabinoid strain analysis** and therapeutic profiling
- A **peer-reviewed open research hub** with decentralized publishing
- Tokenized distribution through verified distributor networks
- **$PYCURE** — the native protocol token for governance and transactions

---

## Academic Submissions

| Platform | Status | Reference |
|----------|--------|-----------|
| Preprints.org | ✅ Published | [ID 213326](https://www.preprints.org/manuscript/213326) |
| Zenodo | ✅ Published | [DOI 10.5281/zenodo.20143620](https://doi.org/10.5281/zenodo.20143620) |
| DeSci.World | ✅ Submitted | — |
| OSF · MetaArXiv | ✅ Submitted | — |
| Cannabis and Cannabinoid Research (SAGE) | 🟡 Under Review | — |
| WHO ECDD | Referenced | — |

**Author:** Conor William — [ORCID 0009-0005-8307-2353](https://orcid.org/0009-0005-8307-2353)

---

## Token

| | |
|---|---|
| **Symbol** | $PYCURE |
| **Network** | Solana Mainnet |
| **Contract Address** | `9jBbyCpEoWa9frvtAbq4xNQ8xoHPedeWYkVBDVU9pump` |
| **Explorer** | [Solscan](https://solscan.io/token/9jBbyCpEoWa9frvtAbq4xNQ8xoHPedeWYkVBDVU9pump) |
| **Treasury** | `5BNvMkDC4eeNzxrUJjgeUU5eSJcSfwPriMcrsuxaphet` |

---

## Platform Modules

### 01 — Clinical Prescriptions
Digital prescriptions issued by verified physicians, recorded immutably on Solana. Patients control their own data. Dosage protocols are transparent and fully traceable.

### 02 — DeSci Research Hub
Independent research published on decentralized infrastructure. Permissionless peer review. Findings are verified and permanently archived on-chain.

### 03 — AI Analysis Engine
Cannabinoid profiling, terpene synergy modeling, and clinical recommendation generation powered by pharmacological knowledge graphs. Returns therapeutic profile, dosage recommendation, and risk assessment.

### 04 — Distribution Network
Verified distributor network with on-chain product listings, license verification, and SOL/PYCURE payment rails.

### 05 — Transactions Ledger
Full on-chain transaction history with SOL and PYCURE currency records — auditable by anyone.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS v4, Space Grotesk |
| API | Express 5, Node.js 24, TypeScript 5.9 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4, drizzle-zod |
| API Contract | OpenAPI 3.0 → Orval codegen |
| Blockchain | Solana (Phantom, Solflare wallet support) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
phytocure-protocol/
├── artifacts/
│   ├── phytocure/          # React frontend
│   │   └── src/
│   │       ├── pages/      # All page components
│   │       ├── components/ # Layout, UI components
│   │       └── contexts/   # Wallet, app state
│   └── api-server/         # Express API server
│       └── src/
│           ├── routes/     # REST endpoints
│           └── db/         # Schema + seed data
├── lib/
│   ├── api-spec/           # OpenAPI spec (source of truth)
│   └── api-client-react/   # Generated React Query hooks
└── scripts/                # Utility scripts
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 9+
- PostgreSQL

### Installation

```bash
git clone https://github.com/phytocure/phytocure-protocol.git
cd phytocure-protocol
pnpm install
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/phytocure
SESSION_SECRET=your_session_secret
```

### Database Setup

```bash
pnpm --filter @workspace/db run push
```

### Running Locally

```bash
# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend
pnpm --filter @workspace/phytocure run dev
```

### API Codegen (after OpenAPI spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Typecheck

```bash
pnpm run typecheck
```

---

## API Overview

The API is contract-first — all endpoints are defined in `lib/api-spec/openapi.yaml` and typed React Query hooks are generated automatically.

Base path: `/api`

| Endpoint | Description |
|----------|-------------|
| `GET /api/products` | List clinical formulations |
| `GET /api/distributors` | List verified distributors |
| `GET /api/prescriptions` | List on-chain prescriptions |
| `GET /api/research` | List published research |
| `POST /api/analysis` | Submit strain for AI analysis |
| `GET /api/transactions` | On-chain transaction ledger |
| `GET /api/dashboard/stats` | Live network metrics |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

All research contributions should follow open science principles — data, methods, and findings must be reproducible and openly licensed.

---

## Security

See [SECURITY.md](SECURITY.md) for responsible disclosure policy.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Links

- **Platform:** [phytocure.xyz](https://phytocure.xyz)
- **X (Twitter):** [@phytocure](https://x.com/phytocure)
- **Manuscript:** [phytocure.xyz/manuscript.html](https://phytocure.xyz/manuscript.html)
- **Zenodo:** [doi.org/10.5281/zenodo.20143620](https://doi.org/10.5281/zenodo.20143620)
- **Preprints.org:** [preprints.org/manuscript/213326](https://www.preprints.org/manuscript/213326)

---

*Phytocure — Phytomedicine, powered by decentralized science.*
