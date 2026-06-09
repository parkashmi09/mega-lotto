/**
 * White-label config enums – single source of truth.
 * Use these everywhere; swap to API later without changing component code.
 */

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
export const ThemeName = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light',
  THRILL_TEMPLATE: 'thrill_template',
  ROYAL_TEMPLATE: 'royal_template',
  PREMIUM: 'premium',
});

export const themeNames = Object.values(ThemeName);

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------
export const SubscriptionPlan = Object.freeze({
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
});

export const subscriptionPlans = Object.values(SubscriptionPlan);

// ---------------------------------------------------------------------------
// Game providers
// ---------------------------------------------------------------------------
export const GameProvider = Object.freeze({
  PROVIDER_A: 'provider_a',
  PROVIDER_B: 'provider_b',
  PROVIDER_C: 'provider_c',
  EVOLUTION: 'evolution',
  PRAGMATIC: 'pragmatic',
  NETENT: 'netent',
});

export const gameProviders = Object.values(GameProvider);

// ---------------------------------------------------------------------------
// Payment methods
// ---------------------------------------------------------------------------
export const PaymentMethod = Object.freeze({
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  E_WALLET: 'e_wallet',
  CRYPTO: 'crypto',
  PAYPAL: 'paypal',
});

export const paymentMethods = Object.values(PaymentMethod);

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------
export const Language = Object.freeze({
  EN: 'en',
  TA: 'ta',
});

/** Display labels for the language switcher. */
export const LanguageLabel = Object.freeze({
  en: 'English',
  ta: 'தமிழ்',
});

export const supportedLanguagesList = Object.values(Language);

// ---------------------------------------------------------------------------
// Sports (feature flags)
// ---------------------------------------------------------------------------
export const Sport = Object.freeze({
  FOOTBALL: 'football',
  BASKETBALL: 'basketball',
  TENNIS: 'tennis',
  HORSE_RACING: 'horse_racing',
  ESPORTS: 'esports',
  CRICKET: 'cricket',
});

export const sportsList = Object.values(Sport);

// ---------------------------------------------------------------------------
// Table games (feature flags)
// ---------------------------------------------------------------------------
export const TableGame = Object.freeze({
  BLACKJACK: 'blackjack',
  ROULETTE: 'roulette',
  BACCARAT: 'baccarat',
  POKER: 'poker',
});

export const tableGamesList = Object.values(TableGame);

// ---------------------------------------------------------------------------
// Originals / casino originals (feature flags)
// ---------------------------------------------------------------------------
export const Original = Object.freeze({
  SLOTS: 'slots',
  LIVE_CASINO: 'live_casino',
  CRASH: 'crash',
  DICE: 'dice',
});

export const originalsList = Object.values(Original);

export const CasinoOriginal = Object.freeze({
  MEGAWAYS: 'megaways',
  JACKPOTS: 'jackpots',
  BUY_BONUS: 'buy_bonus',
});

export const casinoOriginalsList = Object.values(CasinoOriginal);

// ---------------------------------------------------------------------------
// Lottery games (feature flags)
// ---------------------------------------------------------------------------
export const Lottery = Object.freeze({
  POWERBALL: 'powerball',
  MEGA_MILLIONS: 'mega_millions',
  DAILY_PICK: 'daily_pick',
  EURO_JACKPOT: 'euro_jackpot',
  KENO_DRAW: 'keno_draw',
});

export const lotteriesList = Object.values(Lottery);

// ---------------------------------------------------------------------------
// Helpers: check if value is valid for enum
// ---------------------------------------------------------------------------
export function isThemeName(value) {
  return themeNames.includes(value);
}

export function isSubscriptionPlan(value) {
  return subscriptionPlans.includes(value);
}

export function isGameProvider(value) {
  return gameProviders.includes(value);
}

export function isPaymentMethod(value) {
  return paymentMethods.includes(value);
}

export function isLanguage(value) {
  return supportedLanguagesList.includes(value);
}

export function isSport(value) {
  return sportsList.includes(value);
}

export function isTableGame(value) {
  return tableGamesList.includes(value);
}

export function isOriginal(value) {
  return originalsList.includes(value);
}

export function isCasinoOriginal(value) {
  return casinoOriginalsList.includes(value);
}

export function isLottery(value) {
  return lotteriesList.includes(value);
}
