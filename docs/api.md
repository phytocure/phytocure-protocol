# API Reference

Base URL: `https://phytocure.xyz/api`

Full OpenAPI specification: `lib/api-spec/openapi.yaml`

## Endpoints

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |

### Distributors
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/distributors` | List all distributors |
| GET | `/api/distributors/:id` | Get distributor by ID |

### Prescriptions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/prescriptions` | List prescriptions |
| POST | `/api/prescriptions` | Create prescription |
| GET | `/api/prescriptions/:id` | Get prescription by ID |

### Research
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/research` | List research papers |
| POST | `/api/research` | Submit research |
| GET | `/api/research/:id` | Get paper by ID |

### AI Analysis
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/analysis` | Analyze strain |

### Transactions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Record transaction |

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Network metrics |

## Authentication

Currently open API. Wallet-based authentication planned for v2.
