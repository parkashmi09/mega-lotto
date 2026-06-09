/**
 * Theme loader – applies theme colors to :root as CSS variables.
 * Config comes from API (admin can set theme_name and optional theme_colors).
 */
import { getTheme } from '../themes/index.js';

const CSS_VAR_PREFIX = 'color';

function setColorVar(root, key, value) {
  const varName = `--${CSS_VAR_PREFIX}-${key.replace(/_/g, '-')}`;
  root.style.setProperty(varName, value);
}

/**
 * Injects theme color tokens on :root. Preset from theme_name, then any admin overrides.
 * @param {string} themeName - From config (ThemeName enum); selects preset palette.
 * @param {Record<string, string> | null | undefined} colorOverrides - Optional from config.theme_colors (admin panel). Keys: primary, secondary, accent, background, surface, text_primary, text_secondary, success, danger, warning, button_primary, header_background, etc. Values: hex or var(--color-*).
 */
export function applyTheme(themeName, colorOverrides = null) {
  const root = document.documentElement;

  const theme = getTheme(themeName);
  if (theme?.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => setColorVar(root, key, value));
  }

  if (colorOverrides && typeof colorOverrides === 'object' && !Array.isArray(colorOverrides)) {
    Object.entries(colorOverrides).forEach(([key, value]) => {
      if (value != null && value !== '') setColorVar(root, key, value);
    });
  }
}

/**
 * Applies theme class to body for Tailwind/scope (e.g. .theme-thrill_template, .theme-dark).
 * Only removes theme-* (current theme), not theme-base-* (template from config).
 * @param {string} themeName
 */
export function applyThemeClass(themeName) {
  const body = document.body;
  body.classList.remove(
    ...Array.from(body.classList).filter(
      (c) => c.startsWith('theme-') && !c.startsWith('theme-base-')
    )
  );
  if (themeName) {
    body.classList.add(`theme-${themeName}`);
  }
}

/**
 * Sets the base/template theme class on body (from config). Used so CSS can keep
 * header control button colors tied to the template (e.g. Thrill) when user toggles to light.
 * Call once when config loads; do not remove when user changes theme.
 * @param {string} baseThemeName - From config (e.g. thrill_template, light).
 */
export function applyThemeBaseClass(baseThemeName) {
  const body = document.body;
  body.classList.remove(
    ...Array.from(body.classList).filter((c) => c.startsWith('theme-base-'))
  );
  if (baseThemeName) {
    body.classList.add(`theme-base-${baseThemeName}`);
  }
}

export default applyTheme;
