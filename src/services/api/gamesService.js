import { getApiUrl, getJsGamesV2Url } from './gamesConfig';

const normalizeProviderName = (provider) => {
  if (!provider) return provider;
  return provider.replace(/\s+/g, '');
};

export const fetchGisGames = async (provider, page = 1, perPage = 20, search = '', isMobile = false) => {
  try {
    const normalized = normalizeProviderName(provider);
    let url = getApiUrl(`gis/gamesgis?provider=${encodeURIComponent(normalized)}&page=${page}&limit=${perPage}&is_mobile=${isMobile}`);
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    if (json?.success && Array.isArray(json.data) && json.pagination) {
      return {
        games: json.data,
        pagination: {
          current_page: json.pagination.currentPage || page,
          total_pages: json.pagination.totalPages || 1,
          total: json.pagination.totalItems || json.data.length,
        },
      };
    }
    return {
      games: json.data || [],
      pagination: { current_page: page, total_pages: 1, total: json.data?.length || 0 },
    };
  } catch (error) {
    console.error(`fetchGisGames error for ${provider}:`, error);
    return { games: [], pagination: { current_page: page, total_pages: 1 } };
  }
};

export const fetchHotGames = async (page = 1, perPage = 20, isMobile = false) => {
  try {
    const url = getApiUrl(`gis/hotgames?page=${page}&limit=${perPage}&is_mobile=${isMobile}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data || result || [];
  } catch (error) {
    console.error('Error fetching hot games:', error);
    return [];
  }
};

export const launchGisGame = async (gameData) => {
  try {
    const response = await fetch(getApiUrl('gis/games/init'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    const result = await response.json();
    return result.url ? { url: result.url } : { message: result.message || 'Failed to launch game' };
  } catch (error) {
    console.error('Error launching GIS game:', error);
    return { message: error.message || 'Unexpected error' };
  }
};

export const launchJsGame = async (gameData) => {
  try {
    const response = await fetch(getJsGamesV2Url('launch'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    const result = await response.json();
    if (result.success && result.data?.game_launch_url) {
      return { game_launch_url: result.data.game_launch_url };
    }
    return { message: result.message || 'Failed to launch game' };
  } catch (error) {
    console.error('Error launching JS game:', error);
    return { message: error.message || 'Unexpected error' };
  }
};
