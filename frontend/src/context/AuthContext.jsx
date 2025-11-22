import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import axios from 'axios';

const STORAGE_KEYS = {
  token: 'hackathon_token',
};

const isBrowser = typeof window !== 'undefined';

const getStoredToken = () => (isBrowser ? window.localStorage.getItem(STORAGE_KEYS.token) : null);
const setStoredToken = (value) => {
  if (!isBrowser) return;
  if (value) {
    window.localStorage.setItem(STORAGE_KEYS.token, value);
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.token);
  }
};

const delay = (timeout = 800) => new Promise((resolve) => setTimeout(resolve, timeout));
const simulateNetwork = async (payload, timeout = 600) => {
  await delay(timeout);
  return payload;
};

const placeholderUser = {
  id: 'demo-1',
  name: 'Demo Founder',
  email: 'demo@hackathon.dev',
  role: 'Product Lead',
  avatar: 'https://i.pravatar.cc/100?u=hackathon',
};

const tokenPayload = {
  token: 'demo-token-123',
  user: placeholderUser,
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setStoredToken(null);
    }
    return Promise.reject(error);
  },
);

const authService = {
  async login(credentials) {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    } catch {
      return simulateNetwork({
        ...tokenPayload,
        user: {
          ...placeholderUser,
          email: credentials.email,
          name: credentials.email?.split('@')[0] ?? placeholderUser.name,
        },
      });
    }
  },

  async signup(payload) {
    try {
      const { data } = await apiClient.post('/auth/signup', payload);
      return data;
    } catch {
      return simulateNetwork({
        ...tokenPayload,
        user: {
          ...placeholderUser,
          name: payload.name ?? placeholderUser.name,
          email: payload.email,
        },
      });
    }
  },

  async getProfile() {
    try {
      const { data } = await apiClient.get('/auth/profile');
      return data;
    } catch {
      return simulateNetwork(placeholderUser);
    }
  },
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setAuthToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      if (!token || user) return;
      setLoading(true);
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to hydrate session', error);
        setStoredToken(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [token, user]);

  const handleLogin = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);
        setUser(response.user);
        setAuthToken(response.token);
        setStoredToken(response.token);
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSignup = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await authService.signup(payload);
        setUser(response.user);
        setAuthToken(response.token);
        setStoredToken(response.token);
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    setStoredToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login: handleLogin,
      signup: handleSignup,
      logout,
    }),
    [user, token, loading, handleLogin, handleSignup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

