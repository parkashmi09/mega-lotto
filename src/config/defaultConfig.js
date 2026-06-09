/**
 * Default site config – uses enums only. No magic strings.
 * Later: replace with API response validated through validateConfig().
 */
import {
  ThemeName,
  SubscriptionPlan,
  GameProvider,
  PaymentMethod,
  Language,
  Sport,
  TableGame,
  Original,
  CasinoOriginal,
  Lottery,
} from './enums.js';

export const defaultConfig = Object.freeze({
  platform_name: 'Mega Lotto',
  website_name: 'Mega Lotto',
  domain_name: 'megalotto.com',
  site_email_address: 'support@megalotto.com',
  logo: 'https://claps.com/minio/logos/claps-logo.svg',
  favicon: '/favicon.svg',
  default_language: Language.EN,
  meta_description: 'Mega Lotto – Play global lottery draws, pick your numbers, and win big jackpots.',
  theme_name: ThemeName.THRILL_TEMPLATE,
  /** Optional: admin-set color overrides (e.g. from admin panel). Keys: primary, secondary, accent, background, surface, text_primary, text_secondary, success, danger, warning, button_primary, header_background, etc. Values: hex or var(--color-*). */
  theme_colors: null,
  subscription_plan: SubscriptionPlan.STANDARD,
  game_providers: [GameProvider.PRAGMATIC, GameProvider.NETENT, GameProvider.EVOLUTION],
  platform_config: {
    max_bet: 10000,
    min_bet: 0.1,
    currency: 'USD',
    maintenance_mode: false,
  },
  payment_methods: [PaymentMethod.CARD, PaymentMethod.E_WALLET, PaymentMethod.CRYPTO],
  // Lottery-only platform: casino & sports are disabled.
  casino_active: false,
  active_sports: [],
  active_tables: [],
  active_originals: [],
  active_casino_originals: [],
  lottery_active: true,
  active_lotteries: [
    Lottery.MEGA_MILLIONS,
    Lottery.POWERBALL,
    Lottery.EURO_JACKPOT,
    Lottery.DAILY_PICK,
    Lottery.KENO_DRAW,
  ],
  affiliate: {
    enabled: false,
    commission_rate: 0,
  },
  supported_languages: [Language.EN, Language.TA],
  default_coin: 'USDT',
  native_coin: {
    available: false,
    details: null,
  },
});

export default defaultConfig;
