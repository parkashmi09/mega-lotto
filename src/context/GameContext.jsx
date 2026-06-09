import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchGisGames, launchGisGame, launchJsGame } from '@/services/api/gamesService';
import { getUID } from '@/utils/helper';
import { useScreenSize } from '@/hooks';
import { useToast } from '@/hooks/useToast';

const DEFAULT_PROVIDERS = ['spribe', 'pragmaticplay', 'netent', 'playtech', 'bgaming'];
const GAMES_PER_PAGE = 21;
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

const GIS_PROVIDERS = [
  'Amarix', 'AmigoGaming', 'ApolloGames', 'Apparat', 'Aviatrix', 'BFGames',
  'BGaming', 'BarbaraBang', 'Belatra Games', 'Big Time Gaming', 'Blueprint',
  'Boldplay', 'Booongo', 'CTInteractive', 'Caleta', 'Clawbuster', 'ConceptGaming',
  'Dlv', 'Dragoon Soft', 'Elbet', 'Endorphina', 'EnjoyGaming', 'Espressogames',
  'Ezugi', 'FBastards', 'FaChai', 'FormulaSpin', 'Fugaso', 'FunkyGames',
  'Gamebeat', 'Hacksaw Gaming', 'HoGaming', 'ICONIC21', 'Igrosoft', 'JDB',
  'JiliGames', 'KAGaming', 'KajotGames', 'Kalamba', 'Live88', 'Lotto Instant Win',
  'Lucksome', 'MPlay', 'MacawGaming', 'NetEnt', 'No Limit City', 'Novomatic',
  'Nucleus', 'Octoplay', 'OneTouch', 'OnlyPlay', 'OrbitalGaming', 'Penguin King',
  'PeterAndSons', 'PlayHub', 'PlayNGo', 'Playtech', 'PopiPlay', 'Quickspin',
  'RTG SLOTS', 'Relax Gaming', 'RevolverGaming', 'Rich88', 'RivalGames',
  'RubyPlay', 'SA Gaming', 'Salsa', 'SevenMojos Slots', 'SimplePlay',
  'Skywind Slot', 'SmartBet', 'Spearhead Studios', 'Spinmatic', 'Spribe',
  'SuperlottoFast', 'SuperlottoSlots', 'SuperlottoTV', 'TaDaGaming',
  'Thunderkick', 'TripleCherry', 'TripleProfitsGames', 'Turbogames',
  'VibraGaming', 'Vivogaming', 'Wazdan', 'XProgaming', 'Yggdrasil',
  'ZeusPlay', 'Zillion Games'
];

const VENDOR_DISPLAY_NAMES = {
  'amarix': 'Amarix', 'amigogaming': 'AmigoGaming', 'apollogames': 'ApolloGames',
  'apparat': 'Apparat', 'aviatrix': 'Aviatrix', 'bfgames': 'BFGames',
  'bgaming': 'BGaming', 'barbarabang': 'BarbaraBang', 'belatra': 'Belatra Games',
  'bigtimegaming': 'Big Time Gaming', 'blueprint': 'Blueprint', 'boldplay': 'Boldplay',
  'booongo': 'Booongo', 'ctinteractive': 'CTInteractive', 'caleta': 'Caleta',
  'clawbuster': 'Clawbuster', 'conceptgaming': 'ConceptGaming', 'dlv': 'Dlv',
  'dragoonsoft': 'Dragoon Soft', 'elbet': 'Elbet', 'endorphina': 'Endorphina',
  'enjoygaming': 'EnjoyGaming', 'espressogames': 'Espressogames', 'ezugi': 'Ezugi',
  'fbastards': 'FBastards', 'fachai': 'FaChai', 'formulaspin': 'FormulaSpin',
  'fugaso': 'Fugaso', 'funkygames': 'FunkyGames', 'gamebeat': 'Gamebeat',
  'hacksawgaming': 'Hacksaw Gaming', 'hogaming': 'HoGaming', 'iconic21': 'ICONIC21',
  'igrosoft': 'Igrosoft', 'jdb': 'JDB', 'jiligames': 'JiliGames',
  'kagaming': 'KAGaming', 'kajotgames': 'KajotGames', 'kalamba': 'Kalamba',
  'live88': 'Live88', 'lottoinstantwin': 'Lotto Instant Win', 'lucksome': 'Lucksome',
  'mplay': 'MPlay', 'macawgaming': 'MacawGaming', 'netent': 'NetEnt',
  'nolimitcity': 'No Limit City', 'novomatic': 'Novomatic', 'nucleus': 'Nucleus',
  'octoplay': 'Octoplay', 'onetouch': 'OneTouch', 'onlyplay': 'OnlyPlay',
  'orbitalgaming': 'OrbitalGaming', 'penguinking': 'Penguin King',
  'peterandsons': 'PeterAndSons', 'playhub': 'PlayHub', 'playngo': 'PlayNGo',
  'playtech': 'Playtech', 'popiplay': 'PopiPlay', 'quickspin': 'Quickspin',
  'rtgslots': 'RTG SLOTS', 'relaxgaming': 'Relax Gaming',
  'revolvergaming': 'RevolverGaming', 'rich88': 'Rich88', 'rivalgames': 'RivalGames',
  'rubyplay': 'RubyPlay', 'sagaming': 'SA Gaming', 'salsa': 'Salsa',
  'sevenmojos': 'SevenMojos Slots', 'simpleplay': 'SimplePlay',
  'skywindslot': 'Skywind Slot', 'smartbet': 'SmartBet',
  'spearheadstudios': 'Spearhead Studios', 'spinmatic': 'Spinmatic', 'spribe': 'Spribe',
  'superlottofast': 'SuperlottoFast', 'superlottoslots': 'SuperlottoSlots',
  'superlottotv': 'SuperlottoTV', 'tadagaming': 'TaDaGaming',
  'thunderkick': 'Thunderkick', 'triplecherry': 'TripleCherry',
  'tripleprofitsgames': 'TripleProfitsGames', 'turbogames': 'Turbogames',
  'vibragaming': 'VibraGaming', 'vivogaming': 'Vivogaming', 'wazdan': 'Wazdan',
  'xprogaming': 'XProgaming', 'yggdrasil': 'Yggdrasil', 'zeusplay': 'ZeusPlay',
  'zilliongames': 'Zillion Games'
};

const VENDOR_PROVIDER_IDS = {
  'Amarix': 898, 'AmigoGaming': 504, 'Apparat': 743, 'BGaming': 929,
  'BarbaraBang': 677, 'Belatra Games': 262, 'Blueprint': 88, 'Boldplay': 685,
  'Booongo': 829, 'CTInteractive': 679, 'Caleta': 328, 'Clawbuster': 876,
  'ConceptGaming': 540, 'Dlv': 132, 'Dragoon Soft': 781, 'Elbet': 349,
  'EnjoyGaming': 742, 'Espressogames': 549, 'Ezugi': 226, 'FaChai': 827,
  'FormulaSpin': 902, 'Fugaso': 661, 'FunkyGames': 852, 'Gamebeat': 480,
  'Hacksaw Gaming': 886, 'HoGaming': 636, 'ICONIC21': 880, 'Igrosoft': 52,
  'JDB': 879, 'KAGaming': 298, 'Lotto Instant Win': 250, 'Lucksome': 836,
  'NetEnt': 474, 'No Limit City': 180, 'OneTouch': 202, 'OnlyPlay': 624,
  'PlayHub': 846, 'PlayNGo': 382, 'Playtech': 889, 'PopiPlay': 850,
  'Quickspin': 78, 'RTG SLOTS': 253, 'Relax Gaming': 778, 'Rich88': 833,
  'RivalGames': 766, 'RubyPlay': 835, 'SA Gaming': 843, 'Salsa': 762,
  'SevenMojos Slots': 871, 'SimplePlay': 905, 'Skywind Slot': 783,
  'SmartBet': 841, 'Spearhead Studios': 313, 'Spribe': 779,
  'SuperlottoFast': 630, 'SuperlottoSlots': 633, 'SuperlottoTV': 627,
  'Thunderkick': 84, 'TripleCherry': 189, 'TripleProfitsGames': 358,
  'Turbogames': 609, 'VibraGaming': 543, 'Vivogaming': 6, 'Wazdan': 782,
  'XProgaming': 9, 'Yggdrasil': 181, 'ZeusPlay': 519, 'Zillion Games': 900
};

const getProviderId = (vendorKeyOrDisplayName) => {
  const displayName = VENDOR_DISPLAY_NAMES[vendorKeyOrDisplayName?.toLowerCase()] || vendorKeyOrDisplayName;
  return VENDOR_PROVIDER_IDS[displayName] || null;
};

const DEFAULT_GIS_VENDOR_KEYS = Object.keys(VENDOR_DISPLAY_NAMES).filter(k =>
  GIS_PROVIDERS.includes(VENDOR_DISPLAY_NAMES[k])
);

const GameContext = createContext(null);

const getLocalStorageValue = (key, defaultValue = '') => {
  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  try {
    if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
    return value;
  } catch {
    return value;
  }
};

export const GameProvider = ({ children }) => {
  const { showError } = useToast();
  const queryClient = useQueryClient();
  const { isMobile } = useScreenSize();

  const [gameCache, setGameCache] = useState(new Map());
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadedProviders] = useState(DEFAULT_PROVIDERS);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [showIframeLoading, setShowIframeLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedVendors, setSelectedVendors] = useState(DEFAULT_GIS_VENDOR_KEYS);
  const [currentPage, setCurrentPage] = useState(1);

  const abortControllerRef = useRef(null);
  const searchInitiatedRef = useRef(false);

  const getCachedData = useCallback((key) => {
    const cached = gameCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) return cached.data;
    return null;
  }, [gameCache]);

  const setCachedData = useCallback((key, data) => {
    setGameCache(prev => {
      const newMap = new Map(prev);
      newMap.set(key, { data, timestamp: Date.now() });
      return newMap;
    });
  }, []);

  const fetchGamesFromApi = async (vendor, query = '', page = 1) => {
    const vendorName = VENDOR_DISPLAY_NAMES[vendor] || vendor;
    const cacheKey = `gis_${vendorName}_${query}_${page}_${isMobile}`;
    const reactQueryKey = ['gisGames', vendorName, page, isMobile];

    const reactQueryData = queryClient.getQueryData(reactQueryKey);
    if (reactQueryData && !query && page === 1) {
      const games = (reactQueryData.games || []).map(game => ({
        id: game.uuid, title: game.name,
        vendor: (game.provider || vendor).toLowerCase(),
        game_icon: game.image, game_type: game.type,
        uuid: game.uuid, source: 'gis', provider: vendorName
      }));
      return { games, pagination: { currentPage: reactQueryData.pagination?.current_page || page, totalPages: reactQueryData.pagination?.total_pages || 1, total: reactQueryData.pagination?.total || games.length }, hasMore: games.length === GAMES_PER_PAGE };
    }

    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const result = await fetchGisGames(vendorName, page, GAMES_PER_PAGE, query, isMobile);
      if (!query && page === 1) {
        queryClient.setQueryData(reactQueryKey, { games: result.games || [], pagination: result.pagination || { current_page: page, total_pages: 1, total: result.games?.length || 0 } });
      }
      const games = (result.games || []).map(game => ({
        id: game.uuid, title: game.name,
        vendor: (game.provider || vendor).toLowerCase(),
        game_icon: game.image, game_type: game.type,
        uuid: game.uuid, source: 'gis', provider: vendorName
      }));
      const apiResult = { games, pagination: { currentPage: result.pagination?.current_page || page, totalPages: result.pagination?.total_pages || 1, total: result.pagination?.total || games.length }, hasMore: games.length === GAMES_PER_PAGE };
      setCachedData(cacheKey, apiResult);
      return apiResult;
    } catch (err) {
      console.error(`Error fetching games for vendor ${vendor}:`, err);
      return { games: [], pagination: { currentPage: page, totalPages: 1, total: 0 }, hasMore: false };
    }
  };

  const filterGames = useCallback((games, filters) => {
    let filtered = [...games];
    if (filters.gameType && filters.gameType !== 'all') {
      filtered = filtered.filter(game => game.game_type?.toLowerCase().includes(filters.gameType.toLowerCase()));
    }
    return filtered;
  }, []);

  const searchGames = useCallback(async (query = '', vendors = [], page = 1, filters = {}, skipUpdateQuery = false) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    searchInitiatedRef.current = true;

    try {
      const searchVendors = vendors.length > 0 ? vendors : selectedVendors;
      const vendorsToUse = searchVendors.length > 0 ? searchVendors : loadedProviders;
      const cacheKey = `${vendorsToUse.join(',')}_${query}_${page}`;

      const cached = getCachedData(cacheKey);
      if (cached && page === 1) {
        const filtered = filterGames(cached.games, filters);
        setSearchResults(filtered);
        setTotalCount(cached.total);
        setHasMorePages(cached.hasMore);
        setCurrentPage(page);
        if (page === 1 && !skipUpdateQuery) setCurrentQuery(query);
        setIsLoading(false);
        return filtered;
      }

      const maxConcurrent = isMobile ? 3 : vendorsToUse.length;
      const promises = vendorsToUse.map(vendor =>
        fetchGamesFromApi(vendor, query, page)
          .catch(err => {
            if (err.name !== 'AbortError') console.warn(`Failed to fetch from ${vendor}:`, err);
            return { games: [], pagination: { currentPage: page, totalPages: 1, total: 0 }, hasMore: false };
          })
      );

      let results = [];
      if (isMobile && promises.length > maxConcurrent) {
        for (let i = 0; i < promises.length; i += maxConcurrent) {
          const batch = promises.slice(i, i + maxConcurrent);
          const batchResults = await Promise.allSettled(batch);
          results = results.concat(batchResults);
        }
      } else {
        results = await Promise.allSettled(promises);
      }

      const successfulResults = results
        .filter(r => r.status === 'fulfilled' && r.value.games.length > 0)
        .map(r => r.value);

      if (successfulResults.length === 0) {
        setSearchResults([]);
        setTotalCount(0);
        setHasMorePages(false);
        setIsLoading(false);
        return [];
      }

      const allGames = successfulResults.flatMap(r => r.games);
      const uniqueGames = allGames.reduce((acc, game) => {
        const key = game.id || game.uuid || `${game.title}_${game.vendor}`;
        if (!acc.has(key)) acc.set(key, game);
        return acc;
      }, new Map());

      const games = Array.from(uniqueGames.values());
      const hasMore = successfulResults.some(r => r.hasMore);
      const total = Math.max(...successfulResults.map(r => r.pagination?.total || r.games.length));

      setCachedData(cacheKey, { games, total, hasMore });
      const filtered = filterGames(games, filters);

      if (page === 1) setSearchResults(filtered);
      else setSearchResults(prev => [...prev, ...filtered]);

      setTotalCount(total);
      setHasMorePages(hasMore);
      setCurrentPage(page);
      if (page === 1 && !skipUpdateQuery) setCurrentQuery(query);
      setIsLoading(false);
      return filtered;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search error:', err);
        setError(err.message || 'Failed to search games');
        if (page === 1) { setSearchResults([]); setTotalCount(0); setHasMorePages(false); }
      }
      setIsLoading(false);
      throw err;
    }
  }, [selectedVendors, loadedProviders, getCachedData, setCachedData, filterGames, isMobile, queryClient]);

  const loadMoreGames = useCallback(async () => {
    if (!hasMorePages || isLoading) return;
    try {
      await searchGames(currentQuery, loadedProviders, currentPage + 1);
    } catch (err) {
      console.error('Load more error:', err);
    }
  }, [hasMorePages, isLoading, currentQuery, loadedProviders, currentPage, searchGames]);

  const handleGameLaunch = useCallback(async (game, navigate = null) => {
    const isLogged = localStorage.getItem('logged') === 'true';
    if (!isLogged) { showError('Please login to play'); return; }

    setIsLoading(true);
    try {
      const providerName = (game.provider || game.vendor || 'spribe').toLowerCase();
      const gameId = game.uuid || game.id;
      const payload = {
        player_id: getUID(),
        player_name: getLocalStorageValue('name', 'Player'),
        game_uuid: game.uuid || game.id,
        currency: getLocalStorageValue('coin', 'INR'),
        device: isMobile ? 'mobile' : 'desktop',
        return_url: 'https://apithrill.codefactory.games/api/gis/callback/transactions',
        language: 'en'
      };
      const result = await launchGisGame(payload);
      if (result.url) {
        setIframeUrl(result.url);
        setShowIframe(true);
        setShowIframeLoading(true);
        setCurrentGame({ provider: providerName, gameId, title: game.title || game.name || 'Game', url: result.url });
        if (navigate) navigate(`/${providerName}/${gameId}`);
      } else {
        throw new Error(result.message || 'Failed to launch game');
      }
    } catch (err) {
      console.error('Launch error:', err);
      setShowIframe(false); setIframeUrl(''); setShowIframeLoading(false); setCurrentGame(null);
      showError(err.message || 'Failed to launch game');
    } finally {
      setIsLoading(false);
    }
  }, [showError, isMobile]);

  const handleJsGameLaunch = useCallback(async (gameUid, navigate = null) => {
    const isLogged = localStorage.getItem('logged') === 'true';
    if (!isLogged) { showError('Please login to play'); return; }

    setIsLoading(true);
    try {
      const coins = getLocalStorageValue('coin', 'INR');
      if (coins !== 'USDT' && coins !== 'INR') {
        showError('Please swap to USDT or INR to play E-sports');
        setIsLoading(false);
        return;
      }
      const payload = {
        game_uid: gameUid, user_id: getUID(),
        credit_amount: getLocalStorageValue('credit', '0'),
        currency_code: coins, language: 'en'
      };
      const result = await launchJsGame(payload);
      if (result.game_launch_url) {
        setIframeUrl(result.game_launch_url);
        setShowIframe(true);
        setShowIframeLoading(true);
        setCurrentGame({ provider: 'esports', gameId: gameUid, title: 'E-sports', url: result.game_launch_url });
        if (navigate) navigate(`/esports/${gameUid}`);
      } else {
        throw new Error(result.message || 'Failed to launch game');
      }
    } catch (err) {
      console.error('JS Game launch error:', err);
      setShowIframe(false); setIframeUrl(''); setShowIframeLoading(false); setCurrentGame(null);
      showError(err.message || 'Failed to launch game');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  // Fetch games for a specific section (returns results, doesn't touch global state)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSectionGames = useCallback(async (vendors = [], query = '') => {
    if (!vendors.length) return [];
    const results = await Promise.allSettled(
      vendors.map(vendor =>
        fetchGamesFromApi(vendor, query, 1).catch(() => ({ games: [] }))
      )
    );
    const allGames = results
      .filter(r => r.status === 'fulfilled' && r.value.games?.length > 0)
      .flatMap(r => r.value.games);
    const unique = allGames.reduce((acc, game) => {
      const key = game.id || game.uuid || `${game.title}_${game.vendor}`;
      if (!acc.has(key)) acc.set(key, game);
      return acc;
    }, new Map());
    return Array.from(unique.values());
  }, []);

  const closeGame = useCallback((navigate = null) => {
    setShowIframe(false); setIframeUrl(''); setShowIframeLoading(false); setCurrentGame(null);
    if (navigate) {
      const currentPath = window.location.pathname;
      const isGameRoute = currentPath.match(/^\/[^/]+\/[^/]+$/) &&
        !currentPath.startsWith('/sports/') && !currentPath.startsWith('/match/') && !currentPath.startsWith('/menu');
      if (isGameRoute) navigate('/', { replace: true });
      else navigate(-1);
    }
  }, []);

  useEffect(() => {
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  const contextValue = useMemo(() => ({
    searchResults, totalCount, hasMorePages, loadedProviders,
    isLoading, error, currentQuery, selectedVendors, currentPage,
    showIframe, iframeUrl, showIframeLoading, currentGame,
    searchGames, loadMoreGames, fetchSectionGames, handleGameLaunch, handleJsGameLaunch, closeGame,
    setSelectedVendors, clearError: () => setError(null),
    vendorDisplayNames: VENDOR_DISPLAY_NAMES, vendorProviderIds: VENDOR_PROVIDER_IDS,
    getProviderId, gamesPerPage: GAMES_PER_PAGE,
    totalProviders: Object.keys(VENDOR_DISPLAY_NAMES).length
  }), [
    searchResults, totalCount, hasMorePages, isLoading, error, currentQuery,
    selectedVendors, currentPage, showIframe, iframeUrl, showIframeLoading,
    currentGame, loadMoreGames, fetchSectionGames, handleGameLaunch, handleJsGameLaunch, closeGame, searchGames
  ]);

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGames = () => {
  const context = useContext(GameContext);
  if (!context) {
    console.warn('useGames called outside GameProvider, returning fallback context');
    return {
      searchResults: [], totalCount: 0, hasMorePages: false,
      loadedProviders: DEFAULT_PROVIDERS, isLoading: false, error: null,
      currentQuery: '', selectedVendors: DEFAULT_GIS_VENDOR_KEYS, currentPage: 1,
      showIframe: false, iframeUrl: '', showIframeLoading: false, currentGame: null,
      searchGames: () => Promise.resolve([]), loadMoreGames: () => Promise.resolve(), fetchSectionGames: () => Promise.resolve([]),
      handleGameLaunch: () => Promise.resolve(), handleJsGameLaunch: () => Promise.resolve(),
      closeGame: () => { }, setSelectedVendors: () => { }, clearError: () => { },
      vendorDisplayNames: VENDOR_DISPLAY_NAMES, vendorProviderIds: VENDOR_PROVIDER_IDS,
      getProviderId, gamesPerPage: GAMES_PER_PAGE,
      totalProviders: Object.keys(VENDOR_DISPLAY_NAMES).length
    };
  }
  return context;
};
