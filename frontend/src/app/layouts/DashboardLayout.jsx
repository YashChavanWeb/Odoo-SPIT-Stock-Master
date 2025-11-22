import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../../components/navigation/Navbar';

const DashboardLayout = () => (
  <Box className="min-h-screen">
    {/* <Sidebar links={DASHBOARD_LINKS} /> */}
    <Navbar/>
    <Box component="main" className="flex-1 p-6 lg:p-10">
      <Outlet />
    </Box>
  </Box>
);

export default DashboardLayout;

