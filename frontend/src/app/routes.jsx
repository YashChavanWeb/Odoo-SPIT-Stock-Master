// src/app/routes.jsx
import { lazy } from 'react';
import Placeholder from '../components/ui/Placeholder';

// Lazy load pages
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));

const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));

const VerifyOtpPage = lazy(() => import('../features/auth/pages/VerifyOtpPage'));

const ResetPasswordPage = lazy(() =>
  import('../features/auth/pages/ResetPasswordPage')
);

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const ReceiptsView = lazy(() => import('../features/dashboard/views/ReceiptsView'));
const DeliveryView = lazy(() => import('../features/dashboard/views/DeliveryView'));
// const AdjustmentView = lazy(() => import('../features/dashboard/views/AdjustmentView'));

// const StockPage = lazy(() => import('../features/stock/pages/StockPage'));
// const MoveHistoryPage = lazy(() => import('../features/moveHistory/pages/MoveHistoryPage'));

// const WarehouseSettings = lazy(() => import('../features/settings/pages/WarehouseSettings'));
// const LocationSettings = lazy(() => import('../features/settings/pages/LocationSettings'));

// const AccountPage = lazy(() => import('../features/account/pages/AccountPage'));

// Public routes
export const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage />},
  { path: '/verify-otp', element: <VerifyOtpPage /> },    // added
  { path: '/reset-password', element: <ResetPasswordPage /> }, // new location        // added
];

// Protected routes
export const protectedRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },

  // Operations
  { path: '/dashboard/receipts', element: <ReceiptsView /> },
  { path: '/dashboard/delivery', element: <DeliveryView /> },
  // { path: '/dashboard/adjustment', element: <AdjustmentView /> },

  // // Stock
  // { path: '/dashboard/stock', element: <StockPage /> },

  // // Move history
  // { path: '/dashboard/move-history', element: <MoveHistoryPage /> },

  // // Settings
  // { path: '/dashboard/settings/warehouses', element: <WarehouseSettings /> },
  // { path: '/dashboard/settings/locations', element: <LocationSettings /> },

  // // Account
  // { path: '/dashboard/account', element: <AccountPage /> },
];
