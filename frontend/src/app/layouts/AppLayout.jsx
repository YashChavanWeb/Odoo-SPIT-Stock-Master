import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/navigation/Navbar';

const AppLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <Navbar />
    <Container maxWidth="lg" className="py-10">
      <Outlet />
    </Container>
  </div>
);

export default AppLayout;

