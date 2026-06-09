/**
 * Theme registry – map theme_name (enum) to theme module.
 * Add new theme file here; no component changes needed.
 */
import { ThemeName } from '../config/enums.js';
import thrill_template from './thrill_template.js';
import royal_template from './royal_template.js';
import premium from './premium.js';
import dark from './dark.js';
import light from './light.js';

const themeMap = {
  [ThemeName.THRILL_TEMPLATE]: thrill_template,
  [ThemeName.ROYAL_TEMPLATE]: royal_template,
  [ThemeName.PREMIUM]: premium,
  [ThemeName.DARK]: dark,
  [ThemeName.LIGHT]: light,
};

export function getTheme(themeName) {
  return themeMap[themeName] ?? themeMap[ThemeName.DARK];
}

export { themeMap };
export default getTheme;
