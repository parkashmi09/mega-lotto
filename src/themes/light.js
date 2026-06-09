/**
 * Light theme – maps to variables.css (Light palette).
 * Same structure as dark.js; themeService applies the same keys.
 * Background primary/secondary/overlay drive LeftNav and page chrome; see details.md.
 */
export default {
  colors: {
    primary: 'var(--color-light-primary)',
    secondary: 'var(--color-light-secondary)',
    accent: 'var(--color-light-accent)',
    background: 'var(--color-light-bg)',
    background_primary: 'var(--color-base-1)',
    background_secondary: 'var(--color-white)',
    background_overlay: 'var(--color-white)',
    surface: 'var(--color-light-surface)',
    text_primary: 'var(--color-light-text)',
    text_secondary: 'var(--color-light-text-muted)',
    success: 'var(--color-green-3)',
    danger: 'var(--color-red-2)',
    warning: 'var(--color-yellow-2)',
    button_primary: 'var(--color-light-accent)',
    button_primary_foreground: 'var(--color-light-bg)',
    header_background: 'var(--color-light-secondary)',
  },
};
