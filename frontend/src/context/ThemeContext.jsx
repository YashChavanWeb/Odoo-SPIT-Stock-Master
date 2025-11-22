import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const THEME_STORAGE_KEY = 'hackathon_theme';

const getThemePreference = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(THEME_STORAGE_KEY);
};

const setThemePreference = (mode) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
};

const ThemeContext = createContext(null);

const getPreferredMode = () => {
  const stored = getThemePreference();
  if (stored) return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState(getPreferredMode);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', mode === 'dark');
    }
    setThemePreference(mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#FFD700',
          },
          secondary: {
            main: '#808080',
          },
          background: {
            default: mode === 'dark' ? '#000000' : '#e5e5e5', // slightly darker grey
            paper: mode === 'dark' ? '#1a1a1a' : '#fafafa', // lighter but not too white
          },
          text: {
            primary: mode === 'dark' ? '#FFD700' : '#000000',
            secondary: mode === 'dark' ? '#CCCCCC' : '#333333',
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = useMemo(() => ({ mode, toggleTheme, isDark: mode === 'dark' }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeProviderWrapper');
  return context;
};
