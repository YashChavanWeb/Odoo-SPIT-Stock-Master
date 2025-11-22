import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/navigation/Navbar';

const AppLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <Container maxWidth="lg" className="py-10">
      <Outlet />
    </Container>
  </div>
);

export default AppLayout;

