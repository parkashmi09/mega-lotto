import { API_URL } from '@/constants';

const BASE_URL = `${API_URL}/api`;
const JS_GAMES_BASE_URL = `${API_URL}/jsGames`;
const JS_GAMES_V2_BASE_URL = `${API_URL}/jsGamesv2`;

export const getApiUrl = (endpoint) => {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${BASE_URL}/${clean}`;
};

export const getJsGamesUrl = (endpoint) => {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${JS_GAMES_BASE_URL}/${clean}`;
};

export const getJsGamesV2Url = (endpoint) => {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${JS_GAMES_V2_BASE_URL}/${clean}`;
};
