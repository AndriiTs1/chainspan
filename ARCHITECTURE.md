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

## 8. Web3 Architecture

## 9. Transaction Lifecycle

## 10. Cross-Chain Architecture

## 11. Security Principles

## 12. Testing Strategy

## 13. AI-Assisted Engineering Workflow

## 14. CI/CD and Deployment

## 15. Engineering Conventions

## 16. Roadmap

## 17. Architecture Decision Records

```

```
