import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../../components/navigation/Sidebar';
import { DASHBOARD_LINKS } from '../../constants';

const DashboardLayout = () => (
  <Box className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
    <Sidebar links={DASHBOARD_LINKS} />
    <Box component="main" className="flex-1 p-6 lg:p-10">
      <Outlet />
    </Box>
  </Box>
);

export default DashboardLayout;

