/**
 * Global site config – loaded at startup, consumed by app (logo, title, theme, features).
 */
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { loadSiteConfig } from '../services/configService.js';
import { applyTheme, applyThemeClass, applyThemeBaseClass } from '../services/themeService.js';
import { Sport, TableGame, Original, CasinoOriginal } from '../config/enums.js';
import i18n from '../i18n/index.js';

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeName, setThemeName] = useState(null);

  useEffect(() => {
    loadSiteConfig()
      .then((c) => {
        setConfig(c);
        // Restore user's saved theme preference, fall back to config default
        const savedTheme = localStorage.getItem('user_theme');
        const themeToApply = savedTheme || c.theme_name;
        setThemeName(themeToApply);
        applyThemeBaseClass(c.theme_name);
        applyTheme(themeToApply, c.theme_colors);
        applyThemeClass(themeToApply);
        const langs = c.supported_languages;
        const savedLang = localStorage.getItem('user_language');
        const defaultLang = c.default_language ?? langs?.[0];
        if (savedLang && langs?.includes(savedLang)) {
          i18n.changeLanguage(savedLang);
        } else if (defaultLang && langs?.includes(defaultLang)) {
          i18n.changeLanguage(defaultLang);
        } else if (langs?.length) {
          i18n.changeLanguage(langs[0]);
        }
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const setTheme = useCallback(
    (name) => {
      if (!name) return;
      setThemeName(name);
      localStorage.setItem('user_theme', name);
      applyTheme(name, config?.theme_colors);
      applyThemeClass(name);
    },
    [config?.theme_colors]
  );

  // Apply site meta from config (title, favicon, html lang, meta description) – same source as API later
  useEffect(() => {
    if (!config) return;
    const title = config.website_name || config.platform_name || 'Casino';
    document.title = title;
    document.documentElement.lang = config.default_language || config.supported_languages?.[0] || 'en';
    const faviconHref = config.favicon || '/favicon.svg';
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconHref;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (config.meta_description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', config.meta_description);
    }
  }, [config]);

  const value = useMemo(() => {
    if (!config) return { config: null, loading, error, themeName: null, setTheme: () => {} };
    return {
      config,
      loading,
      error,
      platformName: config.platform_name,
      websiteName: config.website_name,
      logo: config.logo,
      favicon: config.favicon,
      themeName: themeName ?? config.theme_name,
      setTheme,
      subscriptionPlan: config.subscription_plan,
      isCasinoActive: config.casino_active !== false,
      isLotteryActive: config.lottery_active === true,
      isLotteryEnabled: (lottery) => (config.active_lotteries || []).includes(lottery),
      activeLotteries: config.active_lotteries || [],
      isSportEnabled: (sport) => (config.active_sports || []).includes(sport),
      isTableEnabled: (table) => (config.active_tables || []).includes(table),
      isOriginalEnabled: (original) => (config.active_originals || []).includes(original),
      isCasinoOriginalEnabled: (original) => (config.active_casino_originals || []).includes(original),
      hasPaymentMethod: (method) => (config.payment_methods || []).includes(method),
      hasLanguage: (lang) => (config.supported_languages || []).includes(lang),
      supportedLanguages: config.supported_languages || [],
      setLanguage: (lang) => i18n.changeLanguage(lang),
      gameProviders: config.game_providers || [],
      platformConfig: config.platform_config || {},
      affiliate: config.affiliate || {},
      defaultCoin: config.default_coin || 'USDT',
      nativeCoin: config.native_coin || { available: false, details: null },
    };
  }, [config, loading, error, themeName, setTheme]);

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
}

export default SiteConfigContext;
