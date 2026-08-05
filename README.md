# ChainSpan

**Production-oriented Web3 engineering platform** — wallet connectivity, multi-chain portfolio tracking, and message signing, built with a strict, evidence-driven engineering process.

Next.js · React · TypeScript · wagmi · viem · WalletConnect (Reown) · TanStack Query · Tailwind CSS · Framer Motion · pnpm workspaces

## Overview

ChainSpan is a pnpm monorepo for designing, implementing and demonstrating real-world Web3 engineering practices — wallet connectivity, on-chain data reading, and message signing — built with production-grade conventions rather than as a tutorial project.

Every feature below is backed by working code, not aspirational documentation. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full engineering specification this project is built against, including package boundaries, error models, security principles and testing strategy.

## Architecture

Dependencies flow in one direction only: **apps → packages → external libraries**. Shared packages never import from applications, and `packages/web3` has zero React/wagmi dependency — pure TypeScript + viem — so it stays reusable if a second app (e.g. the mobile client) ever needs the same chain configuration or token data.

## Repository structure

```
chainspan/
├── apps/
│   ├── web/                Next.js web application
│   │   ├── app/              routes, layout, metadata
│   │   ├── components/       UI, wallet control, providers
│   │   ├── hooks/             usePortfolio, useWallet, ...
│   │   └── lib/                wagmi configuration
│   └── mobile/              Expo / React Native (scaffold only, not yet implemented)
├── packages/
│   └── web3/                chain config, curated token registry, domain types, ABIs
├── ARCHITECTURE.md          full engineering specification
└── pnpm-workspace.yaml
```

## Implemented features

- ✅ **Wallet connection** — injected wallets (MetaMask, Rabby, Coinbase) + WalletConnect, with correct cancellation handling (closing the connect modal is never shown as an error)
- ✅ **Wallet session** — address, active network, native balance
- ✅ **Network switching** across 6 EVM chains (Ethereum, Base, Arbitrum, Optimism, Polygon, Sepolia)
- ✅ **Curated ERC-20 token registry** — hand-verified contract addresses cross-checked against issuer sources (Circle, Tether), no bridged or unverified tokens included
- ✅ **Portfolio data layer** — batched on-chain balance reads via multicall (`useReadContracts`, `allowFailure: true`), so one failed token read never hides the rest
- ✅ **Portfolio UI** — loading / empty / partial-error / full-error / unsupported-network states all handled explicitly, not collapsed into a single spinner
- ✅ **Accessibility** — focus trap, focus restoration, keyboard navigation, `prefers-reduced-motion` support across all interactive wallet UI
- ✅ **Message signing** (EIP-191, ERC-6492-compatible client-side verification) — preview-before-sign UI, explicit lifecycle states (idle → preparing → awaiting signature → verifying → verified / rejected / failed), and account/network drift detection after verification
- 📋 **Mobile app** — Expo scaffold present in the monorepo, not yet implemented

## Technology stack

**Frontend** — Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Framer Motion

**Web3** — wagmi · viem · WalletConnect (Reown) · TanStack Query

**Testing** — Vitest (`packages/web3`)

**Tooling** — pnpm workspaces · ESLint

**Deployment** — Vercel, auto-deploying `main` on every push

## Getting started

Requires Node.js 20+ and pnpm 10 (pinned via `packageManager` in `package.json`, installed automatically through Corepack).

```bash
pnpm install

# apps/web/.env.local
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id" > apps/web/.env.local

pnpm dev:web
```

Get a free project ID from [dashboard.reown.com](https://dashboard.reown.com) (WalletConnect/Reown Cloud) — required, the app throws on startup without it.

Open [http://localhost:3000](http://localhost:3000).

## Development

```bash
pnpm lint:web                                    # ESLint
pnpm --filter web exec tsc --noEmit              # TypeScript — apps/web
pnpm --filter @chainspan/web3 exec tsc --noEmit  # TypeScript — packages/web3
pnpm build:web                                   # production build
```

## Testing

```bash
pnpm --filter @chainspan/web3 test
```

Unit tests currently cover `packages/web3` — chain configuration, curated token registry, portfolio domain logic, and message-signing request/verification helpers. All deterministic, no live RPC calls. `apps/web` does not yet have a test runner configured.

## Deployment

Deployed on [Vercel](https://vercel.com), auto-deploying `main` on every push. `apps/web` is the deployed application; `packages/web3` is built as part of its dependency graph.

## Roadmap

**Completed**
- Repository foundation and monorepo structure
- Wallet connectivity (injected + WalletConnect) with an accessibility foundation
- Landing page navigation
- Shared token foundation and curated token registry
- Wallet portfolio — data layer and UI
- Message signing (EIP-191, ERC-6492-compatible verification, full lifecycle UI)

**Planned**
- Smart contract read/write examples
- Token operations (allowance / approve / transfer)
- Cross-chain domain model
- Mobile wallet integration
- CI quality gates

Full stage-by-stage detail lives in [`ARCHITECTURE.md`](./ARCHITECTURE.md#18-implementation-roadmap).

## Interview topics covered

This project is deliberately built to be defensible in a technical interview. Topics with real, working code behind them:

- Wallet connectivity lifecycle — connect / disconnect / reconnect / cancellation vs. genuine error
- Multi-chain configuration and network switching
- Multicall batched on-chain reads and partial-failure handling
- Token registry trust model — why on-chain `symbol()` / `name()` can't be trusted for display without curation
- React Query cache strategy for on-chain data (`staleTime`, `refetchOnWindowFocus`, deliberately no polling)
- Accessible modal/dropdown patterns — focus trap, focus restoration, `prefers-reduced-motion`
- Message-signing UX — preview-before-sign flow, a race-safe async state machine (stale-attempt guarding), and honest security disclosure (no backend session, no replay protection) instead of overclaiming what a client-only signature proves
- Monorepo package boundaries — why `packages/web3` stays framework-independent
- Evidence-based engineering process — architectural claims in this repo are backed by verified sources, not assumption (see `ARCHITECTURE.md`, §13.5)

## License

No license has been published yet — all rights reserved by the author.
