// src/app/routes.jsx
import { lazy } from 'react';
import Placeholder from '../components/ui/Placeholder';

// Lazy load pages
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));

// Public routes
export const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
];

// Protected routes
export const protectedRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/dashboard/projects', element: <Placeholder title="Projects workspace" /> },
  { path: '/dashboard/team', element: <Placeholder title="Team hub" /> },
  { path: '/dashboard/settings', element: <Placeholder title="Settings" /> },
];
