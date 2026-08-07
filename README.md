# ChainSpan

**Production-oriented Web3 engineering platform** — wallet connectivity, multi-chain portfolio tracking, and message signing, shipped as both a Next.js web app and an Expo/React Native mobile app sharing one framework-independent Web3 domain layer.

Next.js · React Native (Expo Router) · TypeScript · wagmi · viem · Reown AppKit · TanStack Query · pnpm workspaces

## Overview

ChainSpan is a pnpm monorepo built to demonstrate real-world Web3 engineering practice — wallet connectivity, on-chain data reading, and message signing — across both a web client and a native mobile client, under production-grade conventions rather than as a tutorial project.

It serves two purposes at once: a working Web3 application, and a structured, evidence-driven engineering exercise in preparation for a technical interview at a crypto exchange. Every claim in this document is backed by working code in this repository, not aspirational documentation — see [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full engineering specification, including package boundaries, error models, security principles and the stage-by-stage build history.

`apps/web` is a complete, deployed product surface (wallet connect, portfolio, message signing, a curated-token Contract Inspector). `apps/mobile` implements the same core Web3 domain — wallet connect, account/network state, native and ERC-20 balances — natively on iOS/Android via Expo, and is currently in its manual-QA stage (see [Project Status](#project-status)).

## Architecture

Dependencies flow one way only: **apps → packages → external libraries.** `packages/web3` has zero React/React Native/wagmi dependency — pure TypeScript + viem — so both apps consume the exact same chain configuration, token registry, and portfolio/signing domain logic without duplicating it.

```
┌──────────────┐        ┌───────────────┐
│  apps/web    │        │  apps/mobile  │
│  Next.js     │        │  Expo Router  │
│  wagmi 3.x   │        │  wagmi 2.x    │
└──────┬───────┘        └──────┬────────┘
       │                       │
       └───────────┬───────────┘
                    ▼
         ┌─────────────────────┐
         │   packages/web3     │  chains · tokens · portfolio ·
         │  (framework-free)   │  signing · contract-read (viem)
         └──────────┬──────────┘
                    ▼
            blockchain / public RPC
```

The shared layer is domain logic only. The wallet/UI layer is **not** shared — each app pairs a different wagmi major version with its own Reown AppKit build, because they run in genuinely different environments:

```
apps/web    → Reown AppKit (React)         + wagmi 3.x  → WalletConnect / injected browser wallets
apps/mobile → Reown AppKit (React Native)  + wagmi 2.x  → WalletConnect / native wallet apps (deep link)
```

## Repository structure

```
chainspan/
├── apps/
│   ├── web/                 Next.js web application
│   │   ├── app/                routes, layout, metadata
│   │   ├── components/         UI, wallet control, providers
│   │   ├── hooks/               usePortfolio, useWallet, useMessageSigning, ...
│   │   └── lib/                  wagmi configuration
│   └── mobile/               Expo / React Native (Expo Router)
│       └── src/
│           ├── app/               file-based routes (tabs + modal screens)
│           ├── components/        UI primitives, brand, web3 mount points
│           ├── hooks/              use-wallet, use-portfolio (native/web split)
│           ├── lib/web3/           wagmi/AppKit config, storage, formatting
│           └── providers/         app-wide providers (native/web split)
├── packages/
│   └── web3/                 chain config, curated token registry, domain types, ABIs
├── ARCHITECTURE.md           full engineering specification
└── pnpm-workspace.yaml
```

## Core technologies

**Shared** — TypeScript (strict) · viem · pnpm workspaces

**Web** (`apps/web`) — Next.js 16 (App Router) · React 19 · wagmi 3.x · Reown AppKit · TanStack Query · Tailwind CSS 4 · Framer Motion · React Three Fiber/Drei (landing page visual) · lucide-react

**Mobile** (`apps/mobile`) — Expo SDK 57 · Expo Router · React Native 0.86 · wagmi 2.x · `@reown/appkit-react-native` + `@reown/appkit-wagmi-react-native` · TanStack Query · `react-native-svg` · `@react-native-async-storage/async-storage` (session persistence) · `expo-symbols` (SF Symbols / Material Symbols)

**Testing** — Vitest (`packages/web3`)

## Mobile architecture: native/web platform split

`apps/mobile` targets iOS, Android, and a browser preview (Expo Web) from one codebase, but the wallet layer is deliberately **not** shared across all three. Five modules ship as `.native.tsx`/`.web.tsx` pairs, resolved automatically by Metro at build time:

- `providers/mobile-providers.{native,web}.tsx`
- `hooks/use-wallet.{native,web}.ts`
- `hooks/use-portfolio.{native,web}.ts`
- `components/web3/wallet-modal-mount.{native,web}.tsx`
- `app/(tabs)/_layout.{native,web}.tsx` (plus a required non-suffixed fallback that Expo Router mandates for any split file inside `src/app/`)

The reason: Expo Router statically renders the first request on **Node** for the web target, and the Reown/WalletConnect React Native SDK touches `window` unconditionally during initialization — that combination crashes the Node process outright. The `.web.tsx` variants never import `wagmi-config.ts` (which constructs the real `WagmiAdapter`/AppKit instance) at all, so that dependency tree is excluded from the web bundle's module graph entirely, not merely left uncalled. On web, `useWallet()`/`usePortfolio()` return a static, honestly-disconnected shape instead.

Practical consequence: **Expo Web is a real, useful tool for responsive/mobile-browser UI QA — it is not evidence of the native WalletConnect/deep-link flow.** "Connect Wallet" is an intentional no-op on Expo Web, by architecture, not a bug.

## Current implemented functionality

**Web** (`apps/web`)
- Wallet connection — injected wallets + WalletConnect, with cancellation correctly distinguished from a real error
- Wallet session — address, active network, native balance; network switching across 6 EVM chains
- Portfolio — batched multicall balance reads (`useReadContracts`, `allowFailure: true`), loading/empty/partial-error/full-error/unsupported-network states
- Message signing (EIP-191, ERC-6492-compatible verification) — full lifecycle UI, account/network drift detection
- Contract Inspector — reads curated ERC-20 metadata directly over public RPC, flags mismatches against the trusted registry
- Accessibility — focus trap/restoration, keyboard navigation, `prefers-reduced-motion`

**Mobile** (`apps/mobile`)
- Dashboard, Portfolio, Explorer, Settings tabs (native bottom tab bar on iOS/Android; a stable `expo-router` `Tabs` bar on web) and Wallet/Sign modal screens
- Wallet connection via Reown AppKit — connect/disconnect, connected account, chain/unsupported-chain state, reconnect-in-progress state
- Portfolio screen implementing the same state machine as web (disconnected / unsupported / loading / error / success / partial-error / empty), driven by the same `packages/web3` domain functions
- Shared ChainSpan brand mark (see below)
- Message signing and Contract Inspector are **not yet implemented on mobile** (planned, tracked in `ARCHITECTURE.md`)

## Brand identity

Web and mobile now render the exact same ChainSpan brand mark — the mobile badge is a direct geometric port of web's `lucide-react` `Boxes` glyph (identical SVG path data, stroke width, and proportions, rendered via `react-native-svg`), not a similar platform icon substituted in its place.

## Project Status

**Current stage: Stage 8.4 — Portfolio Integration / Manual QA. Stage 8.4 is NOT yet complete.**

Done:
- Portfolio data layer and UI implemented for all documented states (disconnected, unsupported, loading, error, success, partial-error, empty)
- Native wallet architecture (Reown AppKit + wagmi 2.x) implemented and platform-isolated from web
- iOS Simulator manually verified: Dashboard, Portfolio, Explorer, Settings, Wallet screens render correctly; Wallet → Connect Wallet opens the Reown AppKit modal
- Expo Web on a physical iPhone browser verified for responsive/UI QA; native tab-bar overlap and modal-layout regressions found during that pass have been fixed
- All temporary `DIAG-*` QA console logging removed from the mobile codebase (verified by repository-wide search — none remain)
- TypeScript, `git diff --check`, Expo web export, and Expo iOS bundle export all currently pass

Not yet done:
- A completed native wallet pairing (AppKit modal → an actual external wallet app → approval → deep-link return) has not been observed end-to-end
- Real portfolio data (native + ERC-20 balances) has not been observed against a connected account — only the disconnected state has been visually confirmed with real data
- Partial-asset-failure and unsupported-chain states are implemented but not yet triggered against a live connection
- Reload/session-restoration behavior (AsyncStorage-backed session persisting across an app restart) is implemented but has not been exercised against a real session
- Physical-iPhone verification of the above is blocked purely by a local USB enumeration issue on the test machine, unrelated to app code

## Path to Completion

The goal is an **interview-ready, production-quality Web3 project** — not an App Store release. App Store/TestFlight distribution is not a project goal; it may be used only as a temporary side-loading mechanism if a physical-device USB connection can't be restored in time.

**Phase 1 — Finish Stage 8.4**
Physical native wallet connection → connected account → native + ERC-20 balances → partial-failure and unsupported-chain states observed live → reload/session-restore verified → final diff review, commit, push.

**Phase 2 — Web3 production hardening**
Account/network edge cases (switch mid-request, disconnect mid-request), user-rejection and RPC-failure handling review across both apps, environment/secret-handling review.

**Phase 3 — Testing**
Targeted unit/integration tests where they add real signal (mirroring `packages/web3`'s existing Vitest coverage), a basic regression pass across both apps, confirmation that both web and native builds stay green.

**Phase 4 — Architecture review**
Re-check the shared/platform-specific boundary now that mobile is fully wired, confirm `packages/web3` still has zero framework coupling, review error-handling consistency, remove any accumulated incidental complexity.

**Phase 5 — Interview readiness**
Architecture walkthrough script, explicit trade-off explanations (why wagmi is split by version, why the web/native wallet layer isn't shared, why the token registry is curated rather than trusting on-chain metadata), a prepared answer set for likely interviewer questions grounded in this repo's actual code, and a simulated PR-review pass on the mobile Web3 integration.

## Getting started

Requires Node.js 20+ and pnpm 10 (pinned via `packageManager` in `package.json`, installed automatically through Corepack).

```bash
pnpm install
```

### Web

```bash
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id" > apps/web/.env.local
pnpm dev:web
```

Open [http://localhost:3000](http://localhost:3000).

### Mobile

```bash
echo "EXPO_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id" > apps/mobile/.env
cd apps/mobile
pnpm expo start --web --lan   # browser preview — UI/responsive QA only, wallet connect is a no-op here
```

A native dev build (`pnpm ios` / `pnpm android` from `apps/mobile`, or an EAS build) is required to exercise the real Reown AppKit/WalletConnect flow — see [Native QA note](#native-qa-note).

Both apps read a Reown/WalletConnect Project ID from [dashboard.reown.com](https://dashboard.reown.com) — free, required, each app throws a clear startup error without it.

## Development

```bash
# apps/web
pnpm lint:web                                    # ESLint
pnpm --filter web exec tsc --noEmit              # TypeScript
pnpm build:web                                   # production build

# apps/mobile
pnpm --filter mobile exec tsc --noEmit           # TypeScript
cd apps/mobile && npx expo export --platform web    # web bundle validation
cd apps/mobile && npx expo export --platform ios    # native bundle validation

# shared
pnpm --filter @chainspan/web3 exec tsc --noEmit  # TypeScript — packages/web3
git diff --check                                 # whitespace/conflict-marker check before any commit
```

## Testing

```bash
pnpm --filter @chainspan/web3 test
```

Unit tests currently cover `packages/web3` — chain configuration, curated token registry, portfolio domain logic, connection-cancellation classification (shared by both apps), message-signing request/verification helpers, and ERC-20 contract-read snapshot normalization. All deterministic, no live RPC calls. Neither app has an end-to-end test runner configured yet.

## Native QA note

Real mobile Web3 QA — AppKit modal → external wallet approval → deep-link return → connected Wagmi session → live balances → session restore — requires running the app natively (Simulator or a physical device), not the Expo Web preview, because the wallet/AppKit layer is intentionally excluded from the web build (see [Mobile architecture](#mobile-architecture-nativeweb-platform-split)). iOS Simulator QA is functional; physical-device QA is currently blocked by a local USB connectivity issue on the test machine, tracked as the next concrete step in [Project Status](#project-status).

## Deployment

`apps/web` is deployed on [Vercel](https://vercel.com), auto-deploying `main` on every push; `packages/web3` builds as part of its dependency graph. `apps/mobile` is not deployed anywhere yet — see [Path to Completion](#path-to-completion).

## Interview topics demonstrated

- Wallet connectivity lifecycle — connect / disconnect / reconnect / cancellation vs. genuine error — implemented twice, independently, for two different wallet SDK generations (wagmi 3.x/web, wagmi 2.x/native)
- Monorepo package boundaries — why `packages/web3` stays framework-independent, and what that buys when a second, structurally different client (native mobile) needs the same domain logic
- Platform-specific architecture — `.native`/`.web` module splitting to keep an SDK that's fundamentally incompatible with one runtime (Node SSR) out of that runtime's bundle entirely, not just unused
- Multi-chain configuration and network switching; multicall batched on-chain reads and partial-failure handling
- Token registry trust model — why on-chain `symbol()`/`name()` can't be trusted for display without curation
- React Query cache strategy for on-chain data (`staleTime`, `refetchOnWindowFocus`, deliberately no polling)
- Responsive, mobile-first UI engineering — diagnosing and fixing a real cross-platform layout regression (native tab component with no working web fallback) with a measured, evidence-based root cause rather than a guessed CSS patch
- Message-signing UX (web) — preview-before-sign flow, a race-safe async state machine, honest security disclosure instead of overclaiming what a client-only signature proves
- Production QA discipline — distinguishing "implemented in code" from "automated-check passed" from "manually verified" from "still requires real hardware," and reporting status accordingly instead of claiming completion prematurely

## License

No license has been published yet — all rights reserved by the author.
