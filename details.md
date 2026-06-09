# Casino Web – Project Details & Setup

**All chosen decisions and changes for this project are documented here.**

---

## Overview

White-label, config-driven React platform: one codebase, deploy to multiple clients. Each client gets different branding, theme, features, and subscription plan. Config is enum-driven (no magic strings); later it can be loaded from an API.

---

## Tech Stack

| Choice | Details |
|--------|---------|
| **React** | JavaScript (JSX) |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | v4 with `@tailwindcss/vite`; theme colors via CSS variables |
| **React Router** | `react-router-dom` (BrowserRouter in `main.jsx`) |
| **i18n** | `react-i18next` + `i18next`; locales in `src/i18n/locales/`; uses `Language` enum and config `supported_languages` |

---

## Folder Structure

```
src/
  config/           # Enums + default config + validation
    enums.js
    defaultConfig.js
    validateConfig.js
    index.js
  themes/           # Color tokens per theme (theme_name → file)
    thrill_template.js
    royal_template.js
    premium.js
    dark.js
    light.js
    index.js
  services/
    configService.js   # loadSiteConfig() – default now, API later
    themeService.js   # applyTheme(), applyThemeClass(), applyThemeBaseClass()
  context/
    SiteConfigContext.jsx
  hooks/
    useScreenSize.js   # Responsive: mobile / tablet / desktop
    index.js
  i18n/
    index.js          # i18next init, Language enum, resources
    locales/
      en.json, es.json, de.json, fr.json, pt.json, it.json
  styles/
    variables.css     # Thrill brand CSS variables (colors, radii, spacing)
configs/             # Future: clientA.json, clientB.json (multi-tenant)
  README.md
public/
  api/
    config.json      # Mock API – site config (title, favicon, theme, features, etc.)
  favicon.svg
  logo.svg
```

---

## All Chosen Decisions (Summary)

1. **Config is enum-driven** – No static JSON for structure; all valid values live in `src/config/enums.js`. Default config and any future API payload must use these enums; `validateConfig()` checks them.
2. **Single source of truth for config** – `configService.js` is the only place that loads config. Now it returns `defaultConfig`; later it will fetch from API and validate/merge.
3. **Themes are color-only** – Each theme file under `src/themes/` exports `{ colors: { primary, secondary, accent, background, surface, text_primary, text_secondary, success, danger, warning, button_primary, button_primary_foreground, header_background } }`. Theme loader injects them as CSS variables on `:root`; components use `var(--color-primary)` etc. **Single source of truth:** All themes map to `src/styles/variables.css` (Thrill base palette + Royal/Dark/Light/Premium palettes). Change a theme by changing `theme_name` in config; change a palette by editing variables.css.
4. **Theme applied at startup** – `SiteConfigProvider` loads config, then calls `applyTheme(config.theme_name, config.theme_colors)` and `applyThemeClass(config.theme_name)`. Body gets `theme-{theme_name}`. **Config:** Only `theme_name` is required (e.g. `thrill_template`, `royal_template`, `dark`, `light`, `premium`). Optional `theme_colors` from API can override specific tokens; when omitted, the theme file in `src/themes/` fully defines the colors from variables.css.
5. **Site meta from mock API** – Title, favicon, `<html lang>`, and `<meta name="description">` are set at **runtime** from config. Config is loaded from the **mock API** (`/api/config.json`); `configService.js` fetches it, validates with enums, merges with defaultConfig. No env vars for index.html; `index.html` has static fallbacks until the app runs.
6. **Feature flags via enums** – Sports, tables, originals, etc. use enums (`Sport`, `TableGame`, `Original`, `CasinoOriginal`). Components use `isSportEnabled(Sport.FOOTBALL)` etc., never raw strings.
7. **Multi-client ready** – `configs/` is reserved for per-client JSON; selection can be by domain or env (e.g. `VITE_CLIENT_ID`). Not implemented yet; config loader is the only place that will change.
8. **No component changes for new themes** – Add a new file in `src/themes/` and one entry in `themes/index.js` (and optionally a new value in `ThemeName` in `enums.js`). No UI components are edited.
9. **i18n with react-i18next** – Locales keyed by `Language` enum (en, es, de, fr, pt, it). Initial language synced from config `supported_languages` when config loads. Context exposes `supportedLanguages` and `setLanguage()`; language switcher only shows config-allowed languages.
10. **useScreenSize hook** – `src/hooks/useScreenSize.js` returns `{ width, height, breakpoint, isMobile, isTablet, isDesktop }`. Breakpoints: mobile &lt; 949px, tablet 949–1330px, desktop ≥ 1331px (matches CSS `--breakpoint-sm` / `--breakpoint-lg`). Resize is throttled for smooth UI updates.

---

## Enums (All Choices)

- **ThemeName** – `dark`, `light`, `thrill_template`, `royal_template`, `premium`
- **SubscriptionPlan** – `basic`, `standard`, `premium`, `enterprise`
- **GameProvider** – `provider_a`, `provider_b`, `provider_c`, `evolution`, `pragmatic`, `netent`
- **PaymentMethod** – `card`, `bank_transfer`, `e_wallet`, `crypto`, `paypal`
- **Language** – `en`, `es`, `de`, `fr`, `pt`, `it`
- **Sport** – `football`, `basketball`, `tennis`, `horse_racing`, `esports`
- **TableGame** – `blackjack`, `roulette`, `baccarat`, `poker`
- **Original** – `slots`, `live_casino`, `crash`, `dice`
- **CasinoOriginal** – `megaways`, `jackpots`, `buy_bonus`

Validator helpers: `isThemeName()`, `isSubscriptionPlan()`, `isGameProvider()`, etc.

---

## Config Shape (Default)

Defined in `defaultConfig.js` using only enum values:

- `platform_name`, `website_name`, `domain_name`, `site_email_address`
- `logo`, `favicon`, `default_language`, `meta_description`, `theme_name`, `theme_colors` (optional), `subscription_plan`
- `game_providers[]`, `platform_config{}`, `payment_methods[]`
- `active_sports[]`, `active_tables[]`, `active_originals[]`, `active_casino_originals[]`
- `affiliate{}`, `supported_languages[]`

---

## Startup Flow

1. `main.jsx` mounts `SiteConfigProvider` (inside `BrowserRouter`).
2. `SiteConfigProvider` calls `loadSiteConfig()` → gets config (default or future API).
3. `applyThemeBaseClass(config.theme_name)` adds `theme-base-{theme_name}` on `<body>` once (template from config; not removed when user toggles theme).
4. `applyTheme(theme_name, theme_colors)` injects preset theme colors into `:root`, then any `theme_colors` overrides from config (admin panel).
5. `applyThemeClass(theme_name)` adds `theme-{theme_name}` on `<body>` (only removes `theme-*`, keeps `theme-base-*`).
6. Document title and favicon are set from config.
7. App and children use `useSiteConfig()` and enums for logo, features, and theme.

---

## Theme selection (theme_name only)

Config controls the color template via **`theme_name`** only. No static `theme_colors` in config.

- **`theme_name`** – Preset: `thrill_template`, `royal_template`, `dark`, `light`, `premium`. The matching file in `src/themes/` (e.g. `thrill_template.js`, `royal_template.js`, `dark.js`, `light.js`) defines all colors by referencing `src/styles/variables.css` (e.g. `var(--color-green-3)`, `var(--color-royal-primary)`, `var(--color-dark-bg)`, `var(--color-light-bg)`). Changing `theme_name` in config (or API) switches the whole theme automatically.
- **`theme_colors`** – Optional overrides from API. If the backend sends `theme_colors: { primary: "#00a685" }`, that overrides the theme preset for that key. Omit or `null` to use only the theme file.

**Palette source:** `variables.css` holds the Thrill base palette (--color-base-*, --color-green-*, etc.) and one palette per theme (--color-royal-*, --color-dark-*, --color-light-*, --color-premium-*). To change how “Royal”, “Dark”, or “Light” looks, edit variables.css; no config or theme file edits needed for the palette values.

**Light theme same as dark:** The light theme (`theme_name: 'light'`) is configured the same way as the dark theme: palette tokens in `variables.css` (--color-light-primary, --color-light-bg, etc.), theme file `src/themes/light.js` with the same color keys. `themeService.applyTheme()` and `applyThemeClass()` treat both identically; set `theme_name: "light"` in config to use the light palette.

### Light theme color config (strict)

When `theme_name: 'light'`, the theme file sets these semantic variables (via themeService) so layout and nav match the light template. **These differ per theme template** (e.g. dark vs light).

| Variable | Light theme value | Purpose |
|----------|-------------------|---------|
| `--color-background-primary` | `var(--color-base-1)` | Page/main background |
| `--color-background-secondary` | `var(--color-white)` | LeftNav panel, secondary surfaces |
| `--color-background-overlay` | `var(--color-white)` | Overlays / modals base |

**Transitions** (in `variables.css`, shared by all themes):

- `--default-transition-duration: 0.15s`
- `--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`

**LeftNav:** The left nav uses `bg-[var(--color-background-secondary)]` (see `LeftNav.jsx`). With the light theme, `--color-background-secondary` is set to `var(--color-white)` by the light theme file, so the nav panel uses the light background. With dark/thrill_template, it uses the dark/secondary value from that theme. No component change is required; the theme drive ensures correct appearance per `theme_name`.

### Light/dark toggle and template branding

The app can toggle between a “light” and “dark” theme at runtime. The **template** from config (e.g. `thrill_template`) is kept so branding stays correct.

- **Base template class:** On config load, `applyThemeBaseClass(config.theme_name)` sets `theme-base-{theme_name}` on `<body>` (e.g. `theme-base-thrill_template`). This class is **not** removed when the user changes theme, so CSS can tell “template is Thrill” even when the current theme is Light.
- **Toggle behaviour (e.g. HomePage):** Toggle to **Light** → `setTheme(ThemeName.LIGHT)` (body gets `theme-light`). Toggle to **Dark** → `setTheme(config.theme_name)` (e.g. `thrill_template`), so the config template is re-applied instead of the generic `ThemeName.DARK`. That keeps Thrill green when switching back from Light.
- **When template is Thrill/Royal/Dark and user selects Light** (`index.css`): Body has both `theme-base-thrill_template` and `theme-light`. Overrides keep **template branding**:
  - Sign up button and primary/accent: stay Thrill green (or Royal/Dark equivalents), not Light’s purple.
  - **Left nav selected item:** `--color-surface-selected-primary` / `--color-surface-selected-secondary` = `var(--color-green-3)` (Thrill); `--color-foreground-selected-primary` = white. So the active nav item (e.g. ORIGINALS) is green with white icon.
  - **Left nav non-selected:** `--color-control-secondary-foreground` and `--color-foreground-muted-1` = `var(--color-base-8)`.
- **Header control buttons (Rewards, Notifications):** When `theme-light` is on, `--color-control-primary` = white so icon buttons stay light; when template is Thrill and user toggles to Light, the rest of the header (e.g. Sign up) still uses Thrill green via the overrides above.
- **Left nav non-selected (icon circle + SVG):** Use semantic variables. **Dark/Thrill** (default in `variables.css`): `--color-control-secondary: var(--color-base-11)`, `--color-control-secondary-foreground: var(--color-base-7)` (SVG icon color). **Light** (`.theme-light` in `index.css`): `--color-control-secondary: var(--color-base-2)`, `--color-control-secondary-foreground: var(--color-base-8)`. LeftNav icon wrapper uses `bg-[var(--color-control-secondary)]` and `text-[var(--color-control-secondary-foreground)]`; the SVG uses `fill="currentColor"` so it follows the foreground.

**themeService:** `applyThemeClass(name)` only removes classes that start with `theme-` and do **not** start with `theme-base-`, so the base template class is preserved. `applyThemeBaseClass(baseName)` is called once at config load and sets/clears only `theme-base-*` classes.

---

## Adding a New Theme

1. Add value to `ThemeName` in `src/config/enums.js` (e.g. `NEW_THEME: 'new_theme'`).
2. In `src/styles/variables.css`, add a palette block (e.g. `--color-newtheme-primary: #...`, `--color-newtheme-bg: #...`).
3. Create `src/themes/new_theme.js` exporting `{ colors: { primary: 'var(--color-newtheme-primary)', secondary: '...', ... } }` (same keys as other themes).
4. In `src/themes/index.js`, import the file and add `[ThemeName.NEW_THEME]: new_theme` to `themeMap`.
5. Set `theme_name: ThemeName.NEW_THEME` in config (default or API). No component changes.

---

## Mock API and switching to real API

- **Mock API:** Config is loaded from `GET /api/config.json` (static file in `public/api/config.json`). All site meta (title, favicon, lang, description), theme, and features come from this response.
- **Real API later:** In `configService.js`, change `MOCK_API_CONFIG_URL` to your backend URL (e.g. `PUBLIC_THRILL_API_BASE_URL` from `publicEnv`). Keep `validateConfig(data)` and `deepMerge` with `defaultConfig` so missing keys are filled. No other code changes needed.

---

## Thrill website setup

- **Branding:** Default config and mock API use Thrill (platform_name, website_name, domain thrill.com, meta description “The Future of Crypto Casino & Sports Betting”).
- **Colors:** All palettes live in `src/styles/variables.css` (Thrill base + Royal, Dark, Light, Premium). Each theme in `src/themes/` maps semantic keys (primary, background, etc.) to `var(--color-*)` from that file. `theme_name` in config selects which theme (and thus which palette) is applied.
- **Public env:** `src/config/publicEnv.js` exports `publicEnv` with PUBLIC_* keys (API base URL, Gamnify/Betby script URLs, Turnstile sitekey, Intercom, banners, etc.). Use for API calls and script tags; switch to `import.meta.env.VITE_*` when using Vite env.

---

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build

---

*All changes and chosen options for this setup are recorded in this file.*
