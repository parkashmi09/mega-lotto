/**
 * Thrill theme – maps to variables.css tokens via var().
 * Single source of truth: change colors in src/styles/variables.css only.
 * themeService sets these on :root as --color-* (e.g. primary → --color-primary).
 */
export default {
  colors: {
    primary: 'var(--color-green-3)',
    secondary: 'var(--color-base-14)',
    accent: 'var(--color-green-1)',
    background: 'var(--color-base-14)',
    background_primary: 'var(--color-base-14)',
    background_secondary: 'var(--color-base-13)',
    background_overlay: 'var(--color-base-13)',
    surface: 'var(--color-base-13)',
    text_primary: 'var(--color-white)',
    text_secondary: 'var(--color-base-15)',
    success: 'var(--color-green-3)',
    danger: 'var(--color-red-2)',
    warning: 'var(--color-yellow-2)',
    button_primary: 'var(--color-green-1)',
    button_primary_foreground: 'var(--color-base-14)',
    header_background: 'var(--color-base-14)',
  },
};
