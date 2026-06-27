import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAlert } from 'react-alert';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL, FRONTEND_BASE_URL } from '../lib/config';

export const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const alert = useAlert();
  const [error, setError] = useState<string | null>(null);
  const ranOnce = useRef(false);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const code = params.get('code');
  const state = params.get('state');
  const token = params.get('token');

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const fail = (msg: string) => {
      setError(msg);
      alert.error(msg);
    };

    // Flow A: backend redirected here with ?token=...
    if (token) {
      setAuthToken(token);
      navigate('/', { replace: true });
      return;
    }

    // Flow B: Discord redirected here with ?code=...&state=...
    if (code && state) {
      const url = new URL('/auth/callback', API_BASE_URL);
      url.searchParams.set('code', code);
      url.searchParams.set('state', state);

      void (async () => {
        try {
          const res = await fetch(url.toString(), { method: 'POST' });
          if (!res.ok) {
            throw new Error(`Auth exchange failed (${res.status})`);
          }
          const data = (await res.json()) as { token?: string; redirect?: string };
          if (!data.token) {
            throw new Error('Missing token in auth response');
          }
          setAuthToken(data.token);
          const redirectTarget =
            data.redirect?.startsWith(FRONTEND_BASE_URL)
              ? new URL(data.redirect).pathname
              : '/';
          navigate(redirectTarget || '/', { replace: true });
        } catch {
          fail('Something went wrong during authentication. Please try again.');
        }
      })();
      return;
    }

    fail('Missing OAuth parameters. Please try signing in again.');
  }, [alert, code, navigate, setAuthToken, state, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="rounded-2xl bg-white px-6 py-5 shadow-soft"
      >
        <p className="text-sm text-text-muted">
          {error ? 'Login failed. Please try again.' : 'Finishing sign-in with Discord...'}
        </p>
      </motion.div>
    </div>
  );
};
