export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.cyronticket.com';

export const FRONTEND_BASE_URL =
  import.meta.env.VITE_FRONTEND_BASE_URL ??
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'https://cyron-assistant-frontend.vercel.app');

export const DISCORD_REDIRECT_URL =
  import.meta.env.VITE_DISCORD_OAUTH_REDIRECT ??
  `${FRONTEND_BASE_URL}/auth/callback`;

export const TOKEN_STORAGE_KEY = 'cyron_token';

