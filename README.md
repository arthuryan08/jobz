# Onda Finance

> Modern banking web application built with React, TypeScript, and Domain-Driven Design.

<p align="center">
  <img src="public/wave.svg" alt="Onda Finance" width="64" />
</p>

<p align="center">
  <strong>Login</strong> &nbsp;|&nbsp; <strong>Dashboard</strong> &nbsp;|&nbsp; <strong>Transfer</strong> &nbsp;|&nbsp; <strong>Dark Mode</strong>
</p>

---

## Demo

[Live on Vercel](#) <!-- Replace with actual URL after deploy -->

**Credentials:** `user@onda.com` / `123456`

---

## Features

| Feature | Description |
|---------|-------------|
| **Mock Authentication** | Login with session persistence via Zustand + localStorage |
| **Dashboard** | Real-time balance display, transaction list with category icons, sparkline chart |
| **Transfer Flow** | Category dropdown with icons, banking-style currency mask (R$), confirmation dialog, animated receipt with copy/share |
| **Dark Mode** | Light / Dark / System toggle with smooth fade transition and full token override |
| **Responsive Design** | Desktop top nav + mobile bottom tab bar |
| **Search & Filters** | Full-text search and type filter (credit/debit) on transactions |
| **Entrance Animations** | Staggered fade-in-up, scale-in, shimmer skeletons — all respecting `prefers-reduced-motion` |
| **Toast Notifications** | Animated, auto-dismiss, accessible (`aria-live`) |
| **404 Page** | Custom styled page with navigation back |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Installation

```bash
git clone <repository-url>
cd onda-finance
npm install
```

### Running

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

```bash
npm run test            # Run all tests (50 specs)
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run typecheck       # TypeScript strict check
npm run lint            # ESLint
```

### Build

```bash
npm run build           # Production build (~435 KB JS, ~39 KB CSS gzipped)
```

---

## Architecture

The project follows **Domain-Driven Design (DDD)** with a strict layered architecture. Each layer has a single responsibility, and dependencies flow inward — the domain layer has zero framework imports.

```
src/
├── domain/                 # Pure business rules (entities, value objects, errors)
├── application/            # Use cases and DTOs
├── infrastructure/         # Mock repositories, HTTP client, storage adapters
├── presentation/           # React UI (pages, layouts, components, hooks)
├── stores/                 # Zustand global state (auth, balance, theme)
├── shared/                 # Utilities, schemas, test helpers, categories
└── routes/                 # React Router config + protected route guard
```

### Layer Responsibilities

| Layer | What lives here | Framework deps? |
|-------|----------------|-----------------|
| **Domain** | `Money`, `Email`, `Account`, `Transaction`, `User`, domain errors | None — pure TypeScript |
| **Application** | `Authenticate`, `GetBalance`, `ListTransactions`, `TransferFunds` | None |
| **Infrastructure** | `InMemoryUserRepository`, `InMemoryAccountRepository`, `InMemoryTransactionRepository`, Axios instance, localStorage adapter | Axios |
| **Presentation** | Pages, layouts, UI components, React hooks | React, React Router, React Query, RHF |
| **Stores** | `authStore` (persist), `balanceStore`, `themeStore` (persist) | Zustand |

---

## Technical Decisions

### Why DDD Architecture

Domain-Driven Design isolates business logic from framework concerns. The domain layer contains pure TypeScript classes — `Money` handles all currency arithmetic in cents to avoid floating-point errors, `Account.debit()` returns a new immutable instance, and `InsufficientBalanceError` is a typed domain error. This makes the core logic fully testable without React, and swapping from in-memory repositories to a real API requires zero changes to business rules.

### Why Zustand over Context API

Zustand provides a simpler API than React Context with built-in `persist` middleware and selector-based subscriptions that prevent unnecessary re-renders. The auth store automatically syncs to `localStorage` via one line of middleware config. The theme store cycles between light/dark/system with instant DOM class toggling — something that would require complex Context plumbing.

### Why React Query for Server State

TanStack Query separates server state (balance, transactions) from client state (auth, theme), providing automatic caching, loading/error states, and query invalidation after mutations. When a transfer succeeds, `invalidateQueries(['balance', 'transactions'])` ensures the dashboard reflects the new state immediately.

### Form Validation Strategy (RHF + Zod)

React Hook Form minimizes re-renders through uncontrolled inputs. Zod schemas provide a single source of truth for validation rules and TypeScript types (`TransferFormData` is inferred from the schema). The `zodResolver` bridges both libraries seamlessly.

### Component Styling (Tailwind + CVA + shadcn/ui)

Tailwind CSS v4 with `@theme` provides design tokens as CSS custom properties — this is how the dark mode works: a `.dark` class overrides the token values and every component updates automatically. CVA adds type-safe variants (`Button` has 6 visual variants and 4 sizes). Radix UI primitives (via shadcn patterns) handle accessibility (ARIA, keyboard nav) for labels, slots, and focus management.

### Banking-Style Currency Input

The `CurrencyInput` component emulates real banking apps — digits enter from the right, shifting left through the decimal. Typing `3` → `0,03`, then `2` → `0,32`, then `5` → `3,25`. Backspace reverses (`Math.floor(cents / 10)`). All arithmetic is integer-based to prevent floating-point drift.

### Dark Mode Implementation

Instead of adding `dark:` variants to every class, the theme system overrides CSS custom properties in a `.dark` class on `<html>`. The surface color scale is inverted, a `--color-elevated` token replaces all `bg-white` usage, and semantic colors (danger, success, brand) get dark-appropriate values. A `theme-transition` class enables a 300ms fade during toggles.

---

## Security Considerations

> This is a frontend challenge with mock data. The strategies below describe how a production banking application would protect against common attack vectors.

### Reverse Engineering Protection

- **Code obfuscation** — Production builds use Terser for minification, variable mangling, and dead code elimination. This makes decompiled bundles significantly harder to read and reverse-engineer.
- **Environment variables** — Sensitive configuration (API keys, endpoints, feature flags) is injected at build time via environment variables, never hardcoded in source. `.env` files are excluded from version control.
- **API key rotation** — Keys are rotated on a regular schedule. Compromised keys are revoked immediately. Short-lived tokens reduce the window of exploitation.
- **Certificate pinning** — In mobile contexts (React Native, Capacitor), SSL/TLS certificate pinning validates the server certificate against a known fingerprint, preventing man-in-the-middle interceptions even on compromised networks.
- **Anti-tampering checks** — Runtime integrity verification detects if application code has been modified (e.g., via browser DevTools or injected scripts), alerting the backend to potential exploitation attempts.

### Data Leakage Prevention

- **HTTPS everywhere** — All client-server communication uses TLS 1.2+ encryption. HSTS headers ensure browsers never downgrade to HTTP.
- **Secure cookie configuration** — Authentication tokens use `HttpOnly` (not readable by JavaScript), `Secure` (only sent over HTTPS), and `SameSite=Strict` (prevents CSRF). This triple-layer approach makes XSS token theft and cross-site request forgery nearly impossible.
- **Storage encryption** — Sensitive data stored client-side should use the Web Crypto API for encryption rather than plaintext `localStorage`. In this challenge, only non-sensitive user display data (name, email) is persisted.
- **Input sanitization** — All user inputs are validated and sanitized both client-side (Zod schemas enforce type, format, and length constraints) and server-side. This prevents injection attacks (XSS, SQL injection, command injection).
- **Content Security Policy** — CSP headers restrict which scripts, styles, and resources can load, mitigating XSS and data exfiltration. A strict CSP blocks inline scripts and limits resource origins to trusted domains.
- **No sensitive URL params** — Authentication tokens and PII are never passed via URL query parameters, which can appear in browser history, proxy logs, Referer headers, and analytics.
- **Token lifecycle management** — Access tokens use short expiration times (5–15 min) with refresh token rotation. Each refresh issues a new token pair and invalidates the old one, limiting the damage window if a token is compromised.

---

## Test Coverage

The project includes **50 automated tests** across all layers:

| Layer | Tests | What's covered |
|-------|-------|----------------|
| Domain | Value objects (`Money`, `Email`, `TransactionId`), entities (`Account`, `Transaction`, `User`) | Immutability, arithmetic, validation, error cases |
| Application | Use cases (`Authenticate`, `GetBalance`, `ListTransactions`, `TransferFunds`) | Happy paths, insufficient balance, invalid credentials |
| Presentation | Pages (`Login`, `Dashboard`, `Transfer`) | Form rendering, validation errors, currency mask behavior, category dropdown, confirmation flow, receipt display, balance visibility |

```
Test Files  13 passed (13)
     Tests  50 passed (50)
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript (strict mode) |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 + CVA + class-based dark mode |
| Components | shadcn/ui patterns + Radix UI primitives |
| Routing | React Router v6 |
| Server State | TanStack Query v5 |
| Client State | Zustand (with persist middleware) |
| Forms | React Hook Form + Zod v4 |
| HTTP | Axios |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |

---

## Future Improvements

- Real API integration with backend services and WebSocket for real-time updates
- Biometric authentication (fingerprint, Face ID)
- E2E tests with Playwright
- i18n support (multi-language)
- Push notifications for incoming transactions
- Transaction detail view with full history
- Budget tracking and spending analytics
- Scheduled and recurring transfers
- Multi-account support
- PWA with offline mode and service worker caching
