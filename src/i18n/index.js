/**
 * react-i18next setup — English + Tamil only.
 * Missing Tamil keys fall back to English (fallbackLng: en).
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from '../config/enums.js';

import en from './locales/en.json';
import ta from './locales/ta.json';

const resources = {
  [Language.EN]: { translation: en },
  [Language.TA]: { translation: ta },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Language.EN,
  fallbackLng: Language.EN,
  supportedLngs: Object.values(Language),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
