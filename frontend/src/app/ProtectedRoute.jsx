// src/components/navigation/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../app/provider';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // renders nested dashboard routes
};

export default ProtectedRoute;
