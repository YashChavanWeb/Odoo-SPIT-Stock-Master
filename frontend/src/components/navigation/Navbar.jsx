import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Button from '../ui/Button';
import { NAV_LINKS, APP_NAME } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      className="backdrop-blur-lg border-b border-transparent"
    >
      <Toolbar className="flex justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <IconButton className="md:hidden" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <span className="text-xl font-semibold text-brand-600">{APP_NAME}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-brand-500 transition">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <IconButton onClick={toggleTheme} color="primary">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm font-medium text-muted">
                {user?.name}
              </span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" href="/login">
                Login
              </Button>
              <Button size="sm" href="/signup">
                Get Started
              </Button>
            </>
          )}
        </div>
      </Toolbar>
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div className="w-64 p-6 space-y-6">
          <span className="text-lg font-semibold text-brand-500">{APP_NAME}</span>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton key={link.label} component="a" href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </ListItemButton>
            ))}
          </List>
          {isAuthenticated ? (
            <Button fullWidth onClick={logout}>
              Logout
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="ghost" fullWidth href="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Button>
              <Button fullWidth href="/signup" onClick={() => setMobileOpen(false)}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

