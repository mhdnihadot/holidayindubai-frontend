import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

import { DashboardSkeleton } from '@/components/ui/DashboardSkeleton';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);

  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
