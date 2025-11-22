import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const NavLink = ({ to, label }) => {
  const { mode } = useThemeMode();
  return (
    <Link
      to={to}
      className={`text-sm px-3 py-2 transition ${
        mode === 'dark'
          ? 'text-yellow-300 hover:text-yellow-200'
          : 'text-yellow-800 hover:text-yellow-600'
      }`}
    >
      {label}
    </Link>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [opsMenu, setOpsMenu] = useState(null);
  const [settingsMenu, setSettingsMenu] = useState(null);
  const [accountMenu, setAccountMenu] = useState(null);

  const { mode, toggleTheme } = useThemeMode();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      className={
        mode === 'dark'
          ? 'bg-black backdrop-blur-lg border-b border-gray-800'
          : 'bg-neutral-800/90 backdrop-blur-lg border-b border-gray-900'
      }
    >
      <Toolbar className="flex justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <IconButton className="md:hidden" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Link
            to="/dashboard"
            className={`text-xl font-bold ${
              mode === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
            }`}
          >
            IMS
          </Link>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center gap-4`}
          >
            <NavLink to="/dashboard" label="Dashboard" />

            {/* OPERATIONS DROPDOWN */}
            <button
              onClick={(e) => setOpsMenu(e.currentTarget)}
              className={`text-sm px-3 py-2 transition ${
                mode === 'dark'
                  ? 'text-yellow-300 hover:text-yellow-200'
                  : 'text-yellow-800 hover:text-yellow-600'
              }`}
            >
              Operations
            </button>
            <Menu
              anchorEl={opsMenu}
              open={Boolean(opsMenu)}
              onClose={() => setOpsMenu(null)}
            >
              <MenuItem component={Link} to="/dashboard/receipts">Receipts</MenuItem>
              <MenuItem component={Link} to="/dashboard/delivery">Delivery</MenuItem>
              <MenuItem component={Link} to="/dashboard/adjustment">Adjustment</MenuItem>
            </Menu>

            <NavLink to="/dashboard/stock" label="Stock" />
            <NavLink to="/dashboard/move-history" label="Move History" />

            {/* SETTINGS DROPDOWN */}
            <button
              onClick={(e) => setSettingsMenu(e.currentTarget)}
              className={`text-sm px-3 py-2 transition ${
                mode === 'dark'
                  ? 'text-yellow-300 hover:text-yellow-200'
                  : 'text-yellow-800 hover:text-yellow-600'
              }`}
            >
              Settings
            </button>
            <Menu
              anchorEl={settingsMenu}
              open={Boolean(settingsMenu)}
              onClose={() => setSettingsMenu(null)}
            >
              <MenuItem component={Link} to="/dashboard/settings/warehouses">Warehouses</MenuItem>
              <MenuItem component={Link} to="/dashboard/settings/locations">Locations</MenuItem>
            </Menu>

            {/* <NavLink to="/dashboard/account" label="Account" /> */}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* THEME TOGGLE */}
          <IconButton onClick={toggleTheme} color="primary">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {isAuthenticated ? (
            <>
              {/* PROFILE ICON WITH DROPDOWN */}
              <IconButton
                onClick={(e) => setAccountMenu(e.currentTarget)}
                className={`text-2xl transition ${
                  mode === 'dark' ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-800 hover:text-yellow-600'
                }`}
              >
                <ion-icon name="person-circle-outline"></ion-icon>
              </IconButton>
              <Menu
                anchorEl={accountMenu}
                open={Boolean(accountMenu)}
                onClose={() => setAccountMenu(null)}
              >
                <MenuItem component={Link} to="/dashboard/account">Account</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm transition ${
                  mode === 'dark' ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-800 hover:text-yellow-600'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-3 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
