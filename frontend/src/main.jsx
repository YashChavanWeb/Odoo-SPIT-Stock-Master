import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './app/App.jsx';
import { ThemeProviderWrapper } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProviderWrapper>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProviderWrapper>
    </BrowserRouter>
  </StrictMode>,
);
