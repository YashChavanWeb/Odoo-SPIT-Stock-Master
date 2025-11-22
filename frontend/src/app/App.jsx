// src/app/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import AppLayout from './layouts/AppLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from '../components/navigation/ProtectedRoute';
import { publicRoutes, protectedRoutes } from './routes';
import '../App.css';

// Optional loading component while lazy loads
const Loading = () => <div className="text-center mt-20">Loading...</div>;

const App = () => (
  <div className="app-shell">
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route element={<AppLayout />}>
          {publicRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {protectedRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<div className="text-center mt-20 text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  </div>
);

export default App;
