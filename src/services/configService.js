/**
 * Config loader – fetches from mock API; falls back to defaultConfig on failure.
 * Swap API_URL to real backend when ready. All site meta (title, favicon, lang, description) come from API.
 */
import { defaultConfig } from '../config/defaultConfig.js';
import { validateConfig } from '../config/validateConfig.js';

const MOCK_API_CONFIG_URL = '/api/config.json';

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] != null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

/**
 * Load site config from mock API. Validates response, merges with defaultConfig for missing keys.
 * @returns {Promise<typeof defaultConfig>} Site config
 */
export async function loadSiteConfig() {
  try {
    const res = await fetch(MOCK_API_CONFIG_URL);
    if (!res.ok) throw new Error(`Config API ${res.status}`);
    const data = await res.json();
    validateConfig(data);
    const config = deepMerge({ ...defaultConfig }, data);
    return config;
  } catch (err) {
    console.warn('[configService] Using default config after API failure:', err?.message ?? err);
    validateConfig(defaultConfig);
    return defaultConfig;
  }
}

export default loadSiteConfig;
