# Contributing to Phytocure Protocol

Thank you for your interest in contributing.

## Getting Started

1. Fork this repository
2. Clone your fork: `git clone https://github.com/phytocure/phytocure-protocol`
3. Install dependencies: `pnpm install`
4. Copy env: `cp .env.example .env` and fill in values
5. Push DB schema: `pnpm --filter @workspace/db run push`
6. Start API: `pnpm --filter @workspace/api-server run dev`
7. Start frontend: `pnpm --filter @workspace/phytocure run dev`

## Guidelines

- Follow existing TypeScript and file structure conventions
- Run `pnpm run typecheck` before submitting a PR
- Keep PRs focused — one feature or fix per PR
- Write clear commit messages in the format: `feat:`, `fix:`, `docs:`, `refactor:`

## Reporting Issues

Use the GitHub Issues tab with the provided templates.

## Contact

research@phytocure.xyz
