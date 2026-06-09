/**
 * Validates config (e.g. from API) against enums. Use when loading remote config.
 */
import {
  isThemeName,
  isSubscriptionPlan,
  isGameProvider,
  isPaymentMethod,
  isLanguage,
  isSport,
  isTableGame,
  isOriginal,
  isCasinoOriginal,
  isLottery,
} from './enums.js';

function validateString(value, validator, fieldName) {
  if (value == null) return;
  if (!validator(value)) {
    console.warn(`[validateConfig] Invalid ${fieldName}: ${value}`);
  }
}

function validateArray(value, validator, fieldName) {
  if (!Array.isArray(value)) return;
  value.forEach((v) => validateString(v, validator, fieldName));
}

/** theme_colors: optional object of color key -> string (hex or var()). */
function validateThemeColors(value) {
  if (value == null) return;
  if (typeof value !== 'object' || Array.isArray(value)) {
    console.warn('[validateConfig] theme_colors must be an object');
    return;
  }
  Object.entries(value).forEach(([k, v]) => {
    if (v != null && typeof v !== 'string') {
      console.warn(`[validateConfig] theme_colors.${k} must be a string (hex or var())`);
    }
  });
}

/**
 * Validates a config object. Mutates nothing; logs warnings for invalid values.
 * @param {Record<string, unknown>} config - Raw config (e.g. from API)
 */
export function validateConfig(config) {
  if (!config || typeof config !== 'object') return;
  validateString(config.theme_name, isThemeName, 'theme_name');
  validateString(config.subscription_plan, isSubscriptionPlan, 'subscription_plan');
  validateArray(config.game_providers, isGameProvider, 'game_providers');
  validateArray(config.payment_methods, isPaymentMethod, 'payment_methods');
  validateString(config.default_language, isLanguage, 'default_language');
  validateArray(config.supported_languages, isLanguage, 'supported_languages');
  validateArray(config.active_sports, isSport, 'active_sports');
  validateArray(config.active_tables, isTableGame, 'active_tables');
  validateArray(config.active_originals, isOriginal, 'active_originals');
  validateArray(config.active_casino_originals, isCasinoOriginal, 'active_casino_originals');
  validateArray(config.active_lotteries, isLottery, 'active_lotteries');
  validateThemeColors(config.theme_colors);
}

export default validateConfig;
