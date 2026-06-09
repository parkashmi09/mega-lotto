# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build (vite build)
npm run preview    # Preview production build
npm run lint       # ESLint (flat config, JS/JSX)
```

No test framework is configured.

## Architecture

**White-label, config-driven casino/sportsbook React platform.** One codebase serves multiple clients via enum-driven configuration. Currently uses a mock API (`public/api/config.json`); will switch to a real backend by changing `MOCK_API_CONFIG_URL` in `configService.js`.

### Stack

React 19 (JSX, no TypeScript) + Vite 7 + Tailwind CSS v4 (via `@tailwindcss/vite` plugin) + React Router v7 + TanStack React Query + socket.io-client + react-i18next + Axios.

### Path Alias

`@` → `src/` (configured in `vite.config.js`).

### Key Architectural Patterns

- **Enum-driven config**: All valid values live in `src/config/enums.js`. Config must use these enums; `validateConfig()` enforces this. Never use raw strings for theme names, sports, games, payment methods, etc.
- **Theme system**: Themes are color-only. Each theme file in `src/themes/` maps semantic keys (`primary`, `background`, etc.) to CSS variables defined in `src/styles/variables.css`. To add a theme: add enum → add palette vars in `variables.css` → create theme file → register in `themes/index.js`. No component changes needed.
- **Light/dark toggle with template branding**: `applyThemeBaseClass()` sets a persistent `theme-base-{name}` class on `<body>` at startup. Toggling light/dark only swaps `theme-{name}`. CSS overrides in `index.css` keep template branding (e.g. Thrill green) even when light theme is active.
- **Config as single source of truth**: `configService.js` is the only place that loads config. It deep-merges API response with `defaultConfig.js`. Context (`SiteConfigContext`) exposes config and helpers like `isSportEnabled()`, `setTheme()`, `setLanguage()`.
- **WebSocket auth**: Login and registration happen via socket.io events (not REST). Event names are MD5-hashed constants in `src/constants.js`. Socket instance is a singleton in `src/utils/socketInstance.js`.
- **REST services**: Deposit, withdraw, and swap use Axios-based service modules under `src/services/`.

### Startup Flow

1. `main.jsx` → BrowserRouter → QueryClientProvider → SiteConfigProvider
2. `SiteConfigProvider` fetches `/api/config.json`, merges with defaults, applies theme (CSS vars + body classes), sets document title/favicon/lang
3. `App.jsx` renders routes inside `AppLayout` (Header + LeftNav + Footer + BottomNav + AuthModal)

### Routes

| Path | Component | Notes |
|------|-----------|-------|
| `/` | redirect | → `/casino` |
| `/casino` | HomePage | Main landing, also handles `/login` and `/signup` |
| `/casino/originals`, `/slots`, `/live`, `/gameshows`, `/tables` | ImplementationPage | Placeholder pages |
| `/sports`, `/rewards`, `/support` | ImplementationPage | Placeholder pages |
| `/wallet` | WalletPage | `?mode=deposit\|withdraw\|swap` query param |

### Context Providers

- **SiteConfigContext** — Global config, theme, language, feature flags
- **LeftNavContext** — Sidebar expanded/collapsed state (shared by Header, LeftNav, AppLayout)

### Backend Integration

- **API_URL**: defaults to `https://apithrill.codefactory.games` (from `src/constants.js` or `VITE_API_URL` env)
- **SOCKET_URL**: defaults to `wss://apithrill.codefactory.games`
- Socket event constants (`C.LOGIN_USER`, `C.REGISTER_USER`, etc.) are MD5-hashed strings

### ESLint

Flat config (`eslint.config.js`). `no-unused-vars` ignores variables starting with uppercase or underscore (`^[A-Z_]`).

## Conventions

- All config values use enums from `src/config/enums.js` — never raw strings
- Theme colors reference CSS variables from `src/styles/variables.css` — never hardcode hex in theme files
- Components use Tailwind utility classes with CSS variable references: `bg-[var(--color-background-primary)]`
- i18n locales are in `src/i18n/locales/{lang}.json`, keyed by `Language` enum
- Responsive breakpoints: mobile < 949px, tablet 949–1330px, desktop ≥ 1331px (use `useScreenSize` hook)
