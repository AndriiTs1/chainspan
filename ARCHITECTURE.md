# ChainSpan Architecture

## 1. Project Overview

ChainSpan is a production-oriented Web3 engineering platform built to design, implement, test, and demonstrate modern blockchain-facing applications across web and mobile environments.

The platform is structured as a pnpm monorepo and combines a Next.js web application, an Expo-based React Native application, and shared packages for reusable Web3 logic, types, configuration, testing utilities, and selected UI primitives.

The project focuses on the engineering challenges that appear in real Web3 products:

- wallet connectivity and session management;
- RPC communication and on-chain data access;
- smart contract reads and writes;
- transaction submission, confirmation, replacement, failure, and recovery;
- multi-chain state management;
- cross-chain deposit and withdrawal flows;
- shared package evolution without breaking downstream applications;
- security-sensitive review of signing and transaction code;
- AI-assisted development with mandatory human verification;
- automated testing, CI quality gates, and production deployment.

ChainSpan is not intended to be a visual prototype or isolated tutorial. Each capability must be implemented as a maintainable production-style module with explicit state models, strict TypeScript boundaries, documented architectural decisions, test coverage, and observable failure handling.

## 2. Product Scope

ChainSpan is a production-oriented Web3 engineering platform built to learn, design, implement, test and demonstrate modern blockchain applications using production-level architecture.

The platform combines a web application, a mobile application and shared packages inside a single pnpm monorepo.

The first public version focuses on the complete lifecycle of blockchain development:

- wallet connectivity;
- blockchain network management;
- transaction lifecycle;
- smart contract interaction;
- token operations;
- cross-chain architecture;
- reusable Web3 packages;
- production UI components;
- testing infrastructure;
- AI-assisted engineering workflow.

The project is designed as a long-term engineering platform rather than a single application. Every implemented module must be reusable, testable and production-ready.

## 3. System Goals

ChainSpan is designed around the following engineering goals:

### Production Quality

Every module should be implemented as if it were intended for a real production environment rather than as a demonstration or tutorial.

### Modular Architecture

The platform must consist of independent, reusable packages with clearly defined responsibilities and stable public APIs.

### Type Safety

The entire codebase must use strict TypeScript with complete type coverage and no use of `any`.

### Scalability

The architecture must support the addition of new blockchain networks, wallets, protocols and applications without requiring major structural changes.

### Reusability

Business logic should be implemented once and shared between the web application, mobile application and future services whenever possible.

### Maintainability

The project should remain understandable and easy to extend even after years of development.

### Security

Security-sensitive operations, including wallet connectivity, transaction signing and smart contract interaction, must follow secure engineering practices.

### Testability

Every important module should be designed to support unit, integration and end-to-end testing.

### AI-Assisted Development

Artificial intelligence is used to accelerate development, code review and documentation, while all architectural and security decisions remain under human control.

### Developer Experience

The project should provide a clean development workflow, fast builds, predictable project structure and consistent coding standards.

## 4. Non-Goals

The first version of ChainSpan intentionally excludes the following areas:

- cryptocurrency exchange functionality;
- centralized custody of user assets;
- token issuance and launchpad features;
- decentralized exchange (DEX) implementation;
- lending and borrowing protocols;
- NFT marketplace functionality;
- staking infrastructure;
- validator node management;
- mining software;
- governance systems;
- high-frequency trading;
- copy trading;
- portfolio analytics platform;
- centralized backend services unrelated to Web3 engineering.

These capabilities may be explored in future iterations but are outside the scope of the current engineering platform.

## 5. Monorepo Architecture

ChainSpan is organized as a pnpm monorepo.

The repository is divided into two primary areas:

- applications;
- shared packages.

Applications contain user-facing software such as the web platform and mobile application.

Shared packages contain reusable business logic, configuration, UI components, utilities, types and Web3 infrastructure that can be consumed by multiple applications.

Every package has a single responsibility and exposes a stable public API.

Applications should never duplicate business logic that already exists inside shared packages.

Dependencies always flow in one direction:

Applications
↓
Shared Packages
↓
External Libraries

Shared packages must remain independent from application-specific code.

### 5.1 Repository Structure

chainspan/
├── apps/
│ ├── web/
│ └── mobile/
│
├── packages/
│ ├── config/
│ ├── constants/
│ ├── types/
│ ├── utils/
│ ├── ui/
│ ├── web3/
│ ├── hooks/
│ └── api/
│
├── ARCHITECTURE.md
├── INTERVIEW.md
├── README.md
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml

apps/web contains the Next.js application and all web-specific presentation logic.

apps/mobile contains the Expo and React Native application and all mobile-specific presentation logic.

The packages directory contains reusable modules shared between applications.

config — shared TypeScript, linting, environment and tool configuration;
constants — stable project-wide constants;
types — shared domain and infrastructure types;
utils — small framework-independent utility functions;
ui — reusable presentation primitives that can safely be shared;
web3 — blockchain networks, RPC access, wallet logic, contracts and transaction infrastructure;
hooks — reusable React hooks built on top of shared domain packages;
api — typed API clients, request contracts and transport abstractions.

Application-specific code must remain inside its application.

A package should be created only when code has a clear reusable responsibility. Shared code must not be extracted prematurely.

## 6. Applications

### 6.1 Web Application

The web application is built with Next.js and React.

Its primary responsibilities are:

- providing the main user interface for ChainSpan;
- wallet connection and account management;
- blockchain network selection and switching;
- displaying balances, tokens and on-chain data;
- submitting and tracking transactions;
- interacting with smart contracts;
- presenting cross-chain bridge flows;
- exposing developer-oriented tools and diagnostics;
- providing accessible, responsive and production-ready user experiences.

The web application may contain web-specific presentation logic, routing, server components, metadata, SEO configuration and browser integrations.

Business logic that can be reused by other applications must remain inside shared packages.

The web application must not become the source of truth for shared Web3 behavior.

### 6.2 Mobile Application

The mobile application is built with Expo and React Native.

Its primary responsibilities are:

- providing a native mobile experience;
- secure wallet connectivity on mobile devices;
- viewing balances, tokens and transaction history;
- signing blockchain transactions;
- interacting with smart contracts;
- receiving push notifications for transaction status updates;
- supporting biometric authentication where available;
- maintaining a responsive and platform-consistent user interface.

The mobile application should share as much business logic as possible with the web application.

Only platform-specific functionality should remain inside the mobile application.

Native APIs, permissions, device capabilities and mobile navigation must remain isolated from shared packages.

## 7. Shared Packages

Shared packages contain reusable modules that may be consumed by the web application, the mobile application and future ChainSpan services.

A shared package must have a clearly defined responsibility and a stable public interface.

Shared packages must not depend on application-specific code, browser-only APIs or native mobile APIs unless the package is explicitly platform-specific.

The creation of a shared package must be justified by actual reuse or a clearly defined domain boundary. Empty packages and premature abstractions should be avoided.

### 7.1 Package Responsibilities

The shared package layer may contain the following packages:

packages/
├── config/
├── constants/
├── types/
├── utils/
├── ui/
├── web3/
├── hooks/
└── api/

Each package must expose its public API through a controlled entry point such as `src/index.ts`.

Applications should not import internal files directly from another package.

Allowed:

```ts
import { supportedChains } from "@chainspan/web3";
```

Not allowed:

```ts
import { supportedChains } from "@chainspan/web3/src/chains/internal";
```

### 7.2 Config Package

The config package contains reusable configuration shared by applications and packages.

Its responsibilities may include:

- TypeScript base configurations;
- ESLint configuration;
- formatting rules;
- shared environment validation utilities;
- test configuration;
- build conventions;
- package export conventions.

The package must not contain application secrets or environment-specific values.

### 7.3 Constants Package

The constants package contains stable values shared across the project.

Examples include:

- supported environment names;
- transaction status labels;
- network identifiers;
- application-wide limits;
- retry limits;
- timeout values;
- storage keys;
- feature identifiers.

Constants that belong exclusively to one domain should remain inside that domain package.

### 7.4 Types Package

The types package contains framework-independent domain and infrastructure types that are used by multiple packages or applications.

Examples include:

- transaction state types;
- chain identifiers;
- token metadata;
- RPC error structures;
- cross-chain operation types;
- API request and response contracts;
- shared result and error types.

Types should not be moved into the shared package unless they are genuinely reused.

Types owned by a specific package should remain inside that package and be exported through its public API.

### 7.5 Utils Package

The utils package contains small, deterministic and framework-independent utility functions.

Examples include:

- address formatting;
- unit conversion;
- amount parsing;
- time calculations;
- identifier generation;
- error normalization;
- validation helpers.

Utilities must be:

- pure where possible;
- independently testable;
- free from hidden state;
- free from browser or native dependencies unless explicitly documented.

### 7.6 UI Package

The ui package contains presentation primitives that can safely be shared across applications.

Because React DOM and React Native use different rendering primitives, only genuinely portable UI concepts should be shared.

Examples include:

- design tokens;
- typography scales;
- spacing definitions;
- variant definitions;
- icon metadata;
- platform-neutral component contracts.

Web-specific components should remain inside apps/web.

React Native components should remain inside apps/mobile.

A shared UI component should be created only when its portability has been proven.

### 7.7 Web3 Package

The web3 package is the primary source of truth for reusable blockchain infrastructure.

Its responsibilities include:

- supported chain definitions;
- RPC configuration;
- token metadata;
- contract addresses;
- contract ABIs;
- chain capability checks;
- transaction types;
- transaction status normalization;
- error classification;
- blockchain utility functions;
- reusable contract interaction helpers;
- cross-chain domain models.

The package must remain independent from application UI.

It must not import Next.js, Expo, browser components or mobile navigation code.

### 7.8 Hooks Package

The hooks package may contain reusable React hooks built on top of shared domain packages.

A hook belongs in the shared package only when it can be used by more than one application without importing platform-specific APIs.

Examples include:

- reusable query hooks;
- transaction state hooks;
- token balance hooks;
- contract read hooks;
- network capability hooks.

Web-only hooks should remain inside apps/web.

Mobile-only hooks should remain inside apps/mobile.

### 7.9 API Package

The api package contains typed clients and transport abstractions for external or internal services.

Its responsibilities may include:

- typed request contracts;
- typed response contracts;
- transport interfaces;
- API error normalization;
- request cancellation;
- retries;
- timeout handling;
- authentication abstractions;
- mock API clients for testing.

The package must not contain application UI or direct component state.

## 8. Web3 Architecture

The Web3 architecture defines how ChainSpan connects to blockchain networks, wallets, RPC providers and smart contracts.

All blockchain-facing behavior must be explicit, typed and observable.

The Web3 layer must not assume that a wallet, network or RPC provider is always available.

### 8.1 Chain Configuration

Supported chains must be defined in one shared source of truth.

Each chain definition should include:

- chain ID;
- chain name;
- native currency;
- RPC endpoints;
- block explorer URL;
- testnet or mainnet classification;
- supported features;
- contract addresses;
- token metadata;
- bridge availability.

Applications must consume chain configuration from the shared Web3 package.

Chain-specific values must not be duplicated inside UI components.

### 8.2 Wallet Connectivity

Wallet connectivity must support multiple connector types.

Initial connector support includes:

- injected browser wallets;
- WalletConnect-compatible wallets;
- future mobile-native wallet integrations.

The wallet connection state must distinguish between:

- disconnected;
- connecting;
- connected;
- reconnecting;
- rejected;
- failed.

User cancellation must not be treated as a system failure.

A cancelled connection must:

- clear pending state;
- close loading indicators;
- preserve application stability;
- allow an immediate retry;
- avoid displaying a technical error message.

### 8.3 Wallet Session Management

The wallet session layer is responsible for:

- connected address;
- active chain;
- connector identity;
- session restoration;
- disconnection;
- account changes;
- chain changes;
- reconnect behavior;
- stale session detection.

The connected wallet must never be treated as authenticated application identity unless a separate signed authentication flow exists.

### 8.4 RPC Communication

RPC communication must use explicit providers and transport configuration.

The system should support:

- primary RPC providers;
- optional fallback RPC providers;
- request timeouts;
- retry policies;
- rate-limit handling;
- provider health reporting;
- chain-specific configuration.

RPC failures must be normalized into application-level error categories.

UI components should not parse raw RPC errors directly.

### 8.5 Smart Contract Reads

Contract reads should be implemented as reusable typed operations.

Each read operation should define:

- target chain;
- contract address;
- ABI;
- function name;
- arguments;
- expected result type;
- loading state;
- failure state;
- stale-data behavior;
- refetch strategy.

Read operations should be cacheable where appropriate.

### 8.6 Smart Contract Writes

Contract writes must follow a controlled sequence:

Validate input
↓
Validate chain
↓
Request signature
↓
Submit transaction
↓
Receive transaction hash
↓
Track confirmation
↓
Resolve final state

A contract write must never begin without validating:

- connected wallet;
- expected chain;
- required balance;
- input format;
- contract address;
- function arguments;
- user-visible transaction intent.

### 8.7 Chain Switching

Chain switching must handle:

- supported networks;
- unsupported networks;
- rejected switch requests;
- missing network configuration;
- wallet incompatibility;
- pending switch state;
- repeated switch requests.

The application must not submit a transaction on an unexpected chain.

### 8.8 Web3 Error Model

Raw errors from wallets, RPC providers and smart contracts must be converted into stable application error categories.

Initial categories should include:

- user rejection;
- unsupported chain;
- wallet unavailable;
- insufficient funds;
- RPC unavailable;
- rate limited;
- transaction reverted;
- transaction replaced;
- timeout;
- invalid input;
- unknown error.

User-facing messages must not expose internal stack traces or raw provider objects.

## 9. Transaction Lifecycle

The transaction lifecycle is a core ChainSpan domain.

Every blockchain transaction must be represented by an explicit state model rather than by isolated loading booleans.

### 9.1 Transaction States

The initial transaction state model includes:

- idle
- validating
- awaiting_signature
- submitted
- pending
- confirmed
- failed
- rejected
- replaced
- cancelled
- dropped
- timed_out

Each state must have a clear meaning and allowed transitions.

### 9.2 Transaction State Transitions

A typical successful transaction follows:

idle
↓
validating
↓
awaiting_signature
↓
submitted
↓
pending
↓
confirmed

A user rejection follows:

awaiting_signature
↓
rejected

A reverted transaction follows:

submitted
↓
pending
↓
failed

Invalid state transitions must be prevented.

### 9.3 Transaction Identity

Each transaction record should include:

- internal transaction ID;
- blockchain transaction hash;
- chain ID;
- sender address;
- recipient or contract address;
- transaction type;
- submitted timestamp;
- confirmed timestamp;
- current status;
- block number;
- replacement transaction hash;
- normalized error;
- retry metadata.

The internal transaction ID must exist before a blockchain hash is available.

### 9.4 Transaction Submission

Before submission, the system must validate:

- wallet connection;
- active chain;
- input values;
- amount precision;
- destination address;
- contract availability;
- user balance;
- estimated gas where available.

The submission process must prevent accidental duplicate requests.

### 9.5 Confirmation Tracking

After submission, the system must track:

- transaction inclusion;
- confirmation count;
- receipt status;
- block number;
- replacement;
- cancellation;
- timeout;
- RPC failure.

A temporary RPC failure must not automatically mark a transaction as failed.

### 9.6 Transaction Replacement

The system must support transactions that are:

- sped up;
- replaced;
- cancelled with another transaction;
- repriced by the wallet.

The original transaction record should retain a reference to the replacement transaction.

### 9.7 Failure and Recovery

Transaction failure handling must distinguish between:

- pre-submission validation failure;
- user rejection;
- provider failure;
- RPC timeout;
- on-chain revert;
- dropped transaction;
- replacement;
- unknown failure.

The UI should provide recovery actions where appropriate.

Examples include:

- retry validation;
- retry RPC status lookup;
- switch network;
- reconnect wallet;
- submit a new transaction.

### 9.8 Transaction Persistence

Transaction state may initially be persisted locally.

Future versions may synchronize transaction records with a backend service.

Persistence must not store private keys, seed phrases or sensitive wallet credentials.

## 10. Cross-Chain Architecture

Cross-chain operations must be modeled as multi-step workflows rather than as single blockchain transactions.

A cross-chain operation may involve multiple chains, contracts, providers and independent confirmation states.

### 10.1 Cross-Chain Operation Model

A cross-chain operation should include:

- operation ID;
- source chain;
- destination chain;
- source token;
- destination token;
- source amount;
- expected destination amount;
- source transaction hash;
- destination transaction hash;
- bridge or protocol identifier;
- current state;
- timestamps;
- normalized error;
- recovery metadata.

### 10.2 Cross-Chain States

The initial state model may include:

- idle
- validating
- awaiting_source_signature
- source_submitted
- source_confirming
- source_confirmed
- bridge_processing
- destination_pending
- destination_confirmed
- completed
- failed
- refundable
- refunding
- refunded
- timed_out

A cross-chain flow must never be represented by a single boolean such as isLoading.

### 10.3 Source Chain Validation

Before starting a cross-chain operation, the system must validate:

- source wallet connection;
- source chain;
- source token balance;
- allowance;
- bridge availability;
- route availability;
- minimum and maximum amount;
- estimated fees;
- destination support;
- recipient address.

### 10.4 Route Selection

Route selection may depend on:

- source chain;
- destination chain;
- token pair;
- liquidity;
- expected duration;
- bridge fees;
- gas costs;
- protocol availability;
- security policy.

The initial implementation may use a single controlled route.

The architecture must allow additional providers without rewriting the UI.

### 10.5 Status Tracking

Cross-chain status tracking must be independent from the original browser session where possible.

The system should be able to restore an operation using its operation ID or source transaction hash.

### 10.6 Recovery

A cross-chain operation may remain incomplete even when the source transaction is confirmed.

Recovery states may include:

- delayed destination execution;
- provider timeout;
- manual claim required;
- refundable operation;
- destination chain outage;
- unsupported status response.

The UI must clearly distinguish between:

- still processing;
- recoverable;
- failed;
- completed.

### 10.7 Provider Abstraction

Cross-chain providers should implement a shared interface.

The interface may include:

- route discovery;
- quote creation;
- allowance preparation;
- transaction preparation;
- submission metadata;
- status lookup;
- recovery lookup.

Application code must not depend directly on one provider's raw response format.

## 11. Security Principles

Security is a system-wide responsibility.

Security-sensitive code must be easy to review, explicitly typed and isolated from presentation logic.

### 11.1 Wallet Security

ChainSpan must never:

- request seed phrases;
- request private keys;
- store wallet credentials;
- silently sign messages;
- silently submit transactions;
- hide transaction intent from the user.

Every signature request must correspond to a visible user action.

### 11.2 Transaction Intent

Before signing, the user should be able to understand:

- network;
- asset;
- amount;
- destination;
- contract;
- action;
- estimated fees;
- expected result.

Technical calldata may be available in advanced diagnostics but should not replace a human-readable summary.

### 11.3 Input Validation

All external input must be validated.

This includes:

- wallet addresses;
- chain IDs;
- token amounts;
- transaction hashes;
- contract addresses;
- API responses;
- RPC responses;
- environment variables;
- URL parameters.

Validation should occur before security-sensitive operations.

### 11.4 Environment Variables

Environment variables must be categorized as:

- public;
- server-only;
- secret;
- environment-specific.

Public variables must use the appropriate public prefix.

Secrets must never be exposed to client bundles.

Environment values must be validated during application startup or build.

### 11.5 Dependency Security

Dependencies must be reviewed before installation.

Security-sensitive dependencies include:

- wallet libraries;
- blockchain clients;
- contract libraries;
- bridge SDKs;
- cryptographic packages;
- authentication libraries.

Dependency updates should include:

- changelog review;
- type review;
- build verification;
- security advisory review;
- regression testing.

### 11.6 Contract Security

Contract interactions must use verified:

- contract addresses;
- ABIs;
- chain mappings;
- function signatures.

Unknown contract addresses must not be accepted without explicit validation.

### 11.7 Logging

Logs must not contain:

- private keys;
- seed phrases;
- authentication tokens;
- signed payloads with sensitive content;
- secrets;
- full personal data.

Wallet addresses and transaction hashes may be logged only when operationally justified.

### 11.8 Error Exposure

User-facing errors must not reveal:

- internal stack traces;
- environment values;
- provider credentials;
- internal infrastructure details;
- raw RPC payloads.

Detailed errors may be retained in development diagnostics or controlled observability systems.

## 12. Testing Strategy

Testing is required for all critical domain behavior.

The test strategy is divided into unit, integration and end-to-end layers.

### 12.1 Unit Tests

Unit tests should cover:

- pure utilities;
- amount parsing;
- address formatting;
- error normalization;
- transaction state transitions;
- chain capability checks;
- cross-chain state transitions;
- validation logic.

Unit tests must not require real wallets or live blockchain networks.

### 12.2 Component Tests

Component tests should cover:

- wallet connection UI;
- loading states;
- cancellation states;
- error states;
- dropdown behavior;
- keyboard navigation;
- network selection;
- transaction status display;
- form validation.

### 12.3 Integration Tests

Integration tests should cover interactions between:

- hooks and Web3 clients;
- transaction state and RPC responses;
- chain switching and UI state;
- contract reads and application state;
- cross-chain provider adapters and normalized domain models.

External providers should be mocked or simulated where possible.

### 12.4 End-to-End Tests

End-to-end tests should cover critical user journeys.

Examples include:

- connect wallet;
- cancel wallet connection;
- switch network;
- read balance;
- submit a test transaction;
- reject a signature;
- observe transaction confirmation;
- recover a pending transaction;
- complete a simulated cross-chain flow.

### 12.5 Test Networks

Blockchain integration tests should use:

- local development chains;
- deterministic test accounts;
- public testnets only when necessary;
- controlled faucets;
- mock contracts.

Mainnet transactions must never be required for automated tests.

### 12.6 Test Data

Test data must be deterministic and version-controlled where appropriate.

Tests must not depend on unstable external balances or random live chain state.

### 12.7 Coverage

Coverage targets should prioritize critical behavior rather than raw percentage.

Mandatory coverage areas include:

- transaction state transitions;
- security-sensitive validation;
- wallet cancellation;
- error normalization;
- cross-chain state transitions;
- package public APIs.

## 13. AI-Assisted Engineering Workflow

AI tools are used to accelerate implementation, review, testing and documentation.

AI output is never considered trusted by default.

### 13.1 AI Responsibilities

AI may assist with:

- code generation;
- code explanation;
- test generation;
- refactoring proposals;
- documentation;
- dependency investigation;
- error diagnosis;
- architecture review;
- security review support.

### 13.2 Human Responsibilities

A human must verify:

- architecture decisions;
- security-sensitive code;
- dependency changes;
- transaction logic;
- wallet logic;
- smart contract interactions;
- environment configuration;
- generated tests;
- production deployment.

### 13.3 Required Verification

Every AI-generated change must pass:

- code review;
- TypeScript validation;
- linting;
- tests;
- production build;
- manual verification when user interaction is involved.

### 13.4 AI Change Scope

AI tools should receive narrowly scoped tasks.

A task should define:

- exact files;
- intended behavior;
- non-goals;
- commands to run;
- acceptance criteria;
- prohibited changes.

AI must not perform unrelated refactoring without approval.

### 13.5 Evidence-Based Diagnosis

AI must not claim a root cause without evidence.

Evidence may include:

- source code;
- installed package types;
- dependency implementation;
- reproducible logs;
- test failures;
- browser behavior;
- build output.

### 13.6 Security Review

AI-generated security-sensitive code requires additional human review.

This includes:

- signing logic;
- transaction preparation;
- contract writes;
- authentication;
- cryptography;
- bridge integration;
- environment handling.

## 14. CI/CD and Deployment

Continuous integration must ensure that invalid code cannot be merged or deployed.

### 14.1 Continuous Integration

The CI pipeline should run:

- dependency installation with lockfile enforcement;
- linting;
- TypeScript validation;
- unit tests;
- integration tests;
- production builds;
- package boundary checks;
- formatting checks;
- secret scanning;
- dependency security checks.

### 14.2 Pull Request Quality Gates

A pull request should not be merged when:

- lint fails;
- TypeScript fails;
- required tests fail;
- production build fails;
- critical security checks fail;
- required review is missing.

### 14.3 Web Deployment

The web application is deployed independently from the mobile application.

The initial deployment platform may be Vercel.

The deployment process must support:

- preview deployments;
- production deployments;
- environment variables;
- rollback;
- deployment logs;
- branch-based environments.

### 14.4 Mobile Deployment

The mobile application may use Expo Application Services.

The deployment process should support:

- development builds;
- preview builds;
- production builds;
- environment-specific configuration;
- platform signing;
- release channels;
- rollback where supported.

### 14.5 Package Validation

Shared packages must be built and type-checked before dependent applications are deployed.

Breaking changes to package APIs must be detected before production deployment.

### 14.6 Environment Separation

The project should support:

- development
- preview
- staging
- production

Each environment may have separate:

- RPC endpoints;
- WalletConnect project configuration;
- analytics;
- feature flags;
- API endpoints;
- contract addresses.

### 14.7 Deployment Safety

Production deployment must not occur when:

- required environment variables are missing;
- contract addresses are invalid;
- unsupported chains are enabled;
- tests fail;
- production build fails.

## 15. Engineering Conventions

Engineering conventions provide consistency across applications and packages.

### 15.1 TypeScript

The codebase must use strict TypeScript.

The following are prohibited without explicit justification:

- `any`;
- unchecked type assertions;
- `@ts-ignore`;
- broad suppression of TypeScript errors;
- untyped external responses.

### 15.2 File Naming

Recommended conventions:

- components: `kebab-case.tsx`
- hooks: `use-name.ts`
- utilities: `name.ts`
- types: `name.types.ts` or domain-specific file
- tests: `name.test.ts`
- end-to-end tests: `name.spec.ts`

Existing project conventions should remain consistent.

### 15.3 Component Design

Components should:

- have one clear responsibility;
- receive explicit props;
- avoid hidden side effects;
- separate presentation from domain logic;
- expose accessible behavior;
- handle loading, empty, error and cancelled states.

Components should not be split when extraction provides no meaningful architectural benefit.

### 15.4 Imports

Imports should prefer:

- public package APIs;
- configured aliases;
- type-only imports where appropriate;
- stable module boundaries.

Deep imports into another package's internal structure are prohibited.

### 15.5 State Management

State should be placed according to ownership.

Examples:

- local UI state — component or local hook;
- server and RPC state — query layer;
- wallet state — wallet integration layer;
- transaction state — transaction domain;
- URL state — router or search parameters;
- persistent state — explicit storage abstraction.

Global state libraries should not be introduced without a demonstrated need.

### 15.6 Error Handling

Every asynchronous operation must define behavior for:

- pending;
- success;
- failure;
- cancellation;
- timeout;
- retry where appropriate.

User cancellation is not a system error.

### 15.7 Accessibility

Interactive components must support:

- keyboard navigation;
- visible focus;
- semantic HTML;
- appropriate ARIA attributes;
- Escape behavior;
- focus restoration;
- reduced motion where appropriate.

### 15.8 Comments

Comments should explain why a decision exists, not repeat what the code does.

Temporary workarounds must include:

- reason;
- scope;
- removal condition;
- related issue where available.

### 15.9 Git Conventions

Commits should be:

- focused;
- descriptive;
- independently understandable;
- free from unrelated changes.

Recommended commit format:

```
type(scope): description
```

Examples:

```
feat(web3): add transaction confirmation tracking
fix(wallet): handle connection cancellation
refactor(ui): extract shared button variants
test(transaction): cover replacement state
docs(architecture): define cross-chain lifecycle
```

## 16. Roadmap

The roadmap defines the order in which ChainSpan capabilities should be implemented.

The roadmap may evolve, but dependencies between stages must be respected.

### Stage 1 — Repository Foundation

- pnpm monorepo;
- web application;
- mobile application;
- shared package structure;
- TypeScript configuration;
- linting;
- production builds;
- deployment foundation.

### Stage 2 — Web Foundation

- production landing interface;
- reusable web UI primitives;
- responsive layout;
- motion system;
- wallet connection UI;
- accessibility foundation.

### Stage 3 — Wallet and Network Management

- injected wallet support;
- WalletConnect support;
- session management;
- balance display;
- network switching;
- cancellation handling;
- error normalization.

### Stage 4 — Shared Web3 Foundation

- chain registry;
- RPC configuration;
- token definitions;
- contract definitions;
- shared error model;
- reusable Web3 types;
- platform-independent utilities.

### Stage 5 — Transaction Lifecycle

- transaction domain model;
- transaction state machine;
- submission;
- confirmation tracking;
- replacement detection;
- failure handling;
- persistence;
- transaction history UI.

### Stage 6 — Smart Contract Interaction

- typed contract reads;
- typed contract writes;
- ABI organization;
- contract address registry;
- simulation;
- gas estimation;
- revert handling.

### Stage 7 — Token Operations

- native balance;
- ERC-20 balance;
- token metadata;
- allowance;
- approval;
- transfer;
- amount parsing;
- precision handling.

### Stage 8 — Cross-Chain Operations

- provider abstraction;
- route discovery;
- source transaction;
- cross-chain state model;
- destination tracking;
- recovery;
- operation history.

### Stage 9 — Mobile Web3

- mobile wallet connection;
- shared Web3 logic;
- mobile transaction views;
- deep links;
- biometric protection where appropriate;
- push notifications.

### Stage 10 — Testing and Quality

- unit tests;
- component tests;
- integration tests;
- end-to-end tests;
- accessibility tests;
- coverage of critical domains.

### Stage 11 — CI/CD and Production Hardening

- CI workflows;
- required quality gates;
- preview deployments;
- production deployments;
- secret scanning;
- dependency review;
- monitoring;
- release validation.

## 17. Architecture Decision Records

Important architectural decisions must be documented as Architecture Decision Records.

ADRs explain why a decision was made and what trade-offs were accepted.

### 17.1 ADR Structure

Each ADR should include:

- Title;
- Status;
- Date;
- Context;
- Decision;
- Alternatives considered;
- Consequences;
- Follow-up actions.

### 17.2 ADR Statuses

Allowed statuses include:

- proposed;
- accepted;
- superseded;
- deprecated;
- rejected.

### 17.3 Decisions Requiring ADRs

Examples include:

- pnpm monorepo selection;
- Next.js for web;
- Expo for mobile;
- wagmi and viem selection;
- WalletConnect integration;
- shared package boundaries;
- transaction state model;
- RPC provider strategy;
- cross-chain provider selection;
- state management library introduction;
- testing framework selection;
- persistence strategy;
- backend introduction;
- authentication architecture.

### 17.4 ADR Location

ADRs should be stored in `docs/adr/`.

Recommended naming:

- `0001-pnpm-monorepo.md`
- `0002-nextjs-web-application.md`
- `0003-wagmi-viem-wallet-layer.md`

ADRs must not be silently rewritten after acceptance.

A new ADR should supersede an old decision when architecture changes.

## 18. Implementation Roadmap

The implementation roadmap converts architecture into executable development stages.

Each stage must have:

- scope;
- entry conditions;
- implementation tasks;
- validation commands;
- manual verification;
- acceptance criteria;
- commit boundary;
- documentation updates.

### 18.1 Stage Execution Rules

Before starting a stage:

- the previous stage must be stable;
- the working tree should be clean;
- the intended scope must be documented;
- dependencies must be understood.

During implementation:

- changes should remain within scope;
- unrelated refactoring is prohibited;
- every functional change should include validation;
- errors must be investigated before bypasses are introduced.

After implementation:

- lint must pass;
- TypeScript must pass;
- tests must pass;
- production build must pass;
- manual behavior must be checked;
- Git diff must be reviewed;
- documentation must be updated where required.

### 18.2 Current Implementation Sequence

The current recommended sequence is:

1. Complete wallet accessibility;
2. Add wallet and network tests;
3. Stabilize shared Web3 package boundaries;
4. Define transaction domain types;
5. Implement transaction state machine;
6. Add transaction submission flow;
7. Add confirmation and replacement tracking;
8. Add smart contract read example;
9. Add smart contract write example;
10. Add token operations;
11. Add cross-chain domain model;
12. Add mobile wallet integration;
13. Add CI quality gates;
14. Complete production hardening.

### 18.3 Definition of Done

A module is considered complete only when:

- behavior is implemented;
- types are strict;
- loading, error and cancellation states exist;
- tests cover critical logic;
- accessibility is verified;
- production build passes;
- documentation matches implementation;
- no unresolved critical issues remain.

A visual implementation without domain logic, testing and failure handling is not considered complete.

### 18.4 Current Project Progress

This section tracks the actual, project-specific implementation stages of ChainSpan against the general roadmap and implementation process defined in sections 16 and 18.

#### Stage 1. Project Foundation — COMPLETE

- pnpm monorepo
- Next.js web application
- Expo mobile application
- shared Web3 package
- TypeScript configuration
- lint and production build
- GitHub and Vercel deployment

#### Stage 2. Wallet Infrastructure — COMPLETE

- Wagmi and Viem integration
- Web3 and React Query providers
- browser wallet connection
- WalletConnect integration
- wallet connection modal
- address, network and native balance
- disconnect flow
- supported network switching
- desktop and mobile Web support

#### Stage 3. Landing Page Structure

- extract Header from `page.tsx`
- extract Hero from `page.tsx`
- create reusable Container
- preserve the approved visual design
- improve mobile layout
- connect navigation and CTA actions

#### Stage 4. Shared Token Foundation

- shared ERC-20 ABI
- token types
- token registry by chain
- native token configuration
- public exports from `@chainspan/web3`

#### Stage 5. Wallet Portfolio

- native balance
- ERC-20 balances
- loading, empty and error states
- chain-aware token list
- portfolio UI
- React Query caching

#### Stage 6. Message Signing

- sign-message interface
- wallet confirmation flow
- signature result
- signature verification
- rejected-request handling

#### Stage 6.5. Contract Inspector (Curated ERC-20 Reads)

- curated ERC-20 contract lookup via the existing token registry (no separate contract address registry)
- typed `name` / `symbol` / `decimals` / `totalSupply` reads over public RPC, independent of wallet connection
- curated-vs-on-chain metadata comparison with an explicit `unavailable` state (a failed read is never shown as a mismatch)
- custom accessible listbox selectors for network and token
- read-only landing page section, no write capability

Delivered out of the general roadmap's numeric order (ahead of Stage 7 Transaction Lifecycle) as an intentional sequencing choice; functionally corresponds to the read-only portion of the general roadmap's Stage 8 (Smart Contract Interaction).

#### Stage 7. Transaction Lifecycle

- native asset transfer form
- transaction simulation
- wallet confirmation
- pending state
- transaction hash
- receipt confirmation
- rejected, reverted and failed states
- explorer link

#### Stage 8. Smart Contract Interaction

- contract address validation
- ABI input
- read contract calls
- write contract calls
- simulation before writing
- decoded results and errors

#### Stage 9. Activity and Network Data

- current block
- gas information
- recent wallet activity
- transaction details
- explorer integration
- automatic refresh and caching

#### Stage 10. Cross-Chain Foundation

- source and destination chain selection
- asset and amount validation
- quote model
- cross-chain lifecycle state machine
- provider adapter interface
- demo bridge flow without unsafe custody

#### Stage 11. Testing and Reliability

- unit tests for shared Web3 utilities
- component tests
- wallet flow tests
- transaction state tests
- mocked RPC tests
- error boundaries
- CI quality gates

#### Stage 12. Production Readiness

- responsive review
- accessibility review
- Lighthouse optimization
- security review
- environment validation
- metadata and social preview
- monitoring and analytics
- documentation and architecture updates

#### Stage 13. Interview Preparation

- complete `INTERVIEW.md`
- explain every architectural decision
- prepare Web3 lifecycle demonstrations
- prepare failure scenarios
- prepare project walkthrough
- prepare common React, Next.js, TypeScript and Web3 questions

#### Stage 14. React Native Application

- reuse `@chainspan/web3`
- mobile wallet connection
- WalletConnect deep links
- secure local storage
- native portfolio UI
- native transaction flow
- iOS and Android testing
