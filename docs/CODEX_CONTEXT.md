# Codex Context

Last updated: 2026-04-26

This is the short entry point for future Codex threads. It intentionally replaces scanning long specs and generated evidence logs.

## Project

- Repo: `/Users/yudeyou/Desktop/72hours`
- App: public 72hours website
- Stack: Vite, React 19, TypeScript, Tailwind CSS
- Dev server: `npm run dev` on `http://localhost:3000`
- Build: `npm run build`
- Type-check/lint command: `npm run lint`

## Important Paths

- `src/App.tsx`: route registration
- `src/pages/`: route-level pages
- `src/components/`: shared UI and layout components
- `src/content/site-config.ts`: public navigation and site copy config
- `src/lib/capital-query.ts`: Capital API query/client boundary
- `src/lib/use-capital-data.ts`: Capital data mode hook
- `public/_headers`: Cloudflare Pages headers and CSP
- `public/tonconnect-manifest.json`: TonConnect manifest
- `scripts/`: static SEO and Capital smoke/gate scripts

## Capital State

- Website defaults to `VITE_CAPITAL_DATA_MODE=preview`.
- API mode is opt-in with `VITE_CAPITAL_DATA_MODE=api` and `VITE_CAPITAL_API_BASE_URL`.
- Current production safety state: public Capital website and production API/Indexer infrastructure exist, but mainnet user signing remains disabled and Indexer writes remain disabled.
- Current production gate remains blocked on owner-supplied external inputs such as contract addresses, audit/legal approvals, reward policy, and full rehearsal artifacts.

## Related Repos

- `../72h-capital-api`: API Worker, intent routes, database boundary
- `../72h-capital-contracts`: TON contracts and deployment/rehearsal scripts
- `../72h-capital-admin`: operations and risk admin UI
- `../72h-capital-indexer`: TON event ingestion and projections
- `../72h-capital-shared`: shared types and route contracts

## Read Docs On Demand

- Product/feature spec: `docs/spec/capital.md`
- Operations runbook: `docs/spec/capital-operations-runbook.md`
- Production launch plan: `docs/spec/capital-production-launch-plan.md`
- Evidence index: `docs/spec/capital-production-artifacts/evidence/README.md`
- Green Book: `docs/spec/greenbook.md` and `docs/spec/greenbook.en.md`

Avoid opening the full evidence tree unless the task needs exact command output. Use the evidence index first.

## Current Context Hygiene

- `.codexignore` excludes generated build output, local screenshots, and Capital evidence snapshots from active Codex context.
- Long audit/launch artifacts are preserved under `docs/spec/capital-production-artifacts/` for traceability.
- Prefer adding short summaries to this file or the evidence index instead of appending large logs to general docs.
