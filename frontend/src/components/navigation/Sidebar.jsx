import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../constants';

const iconMap = {
  Dashboard: <DashboardIcon />,
  Workspaces: <WorkspacesIcon />,
  Groups: <GroupsIcon />,
  Settings: <SettingsIcon />,
};

const Sidebar = ({ links = [] }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const renderList = () => (
    <div className="w-64 h-full flex flex-col">
      <div className="px-4 py-6 text-xl font-semibold text-brand-500">{APP_NAME}</div>
      <List>
        {links.map((link) => (
          <ListItemButton
            key={link.path}
            selected={location.pathname === link.path}
            onClick={() => {
              navigate(link.path);
              setOpen(false);
            }}
          >
            <ListItemIcon className="text-brand-500">
              {iconMap[link.icon] ?? <DashboardIcon />}
            </ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64">{renderList()}</div>
      <div className="lg:hidden flex items-center p-4">
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {renderList()}
      </Drawer>
    </>
  );
};

export default Sidebar;

