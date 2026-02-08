// src/components/common/ProtectedRoute/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../Loader/Loader';

function ProtectedRoute() {
  const { user, loading, needsOnboarding } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (needsOnboarding && !location.pathname.startsWith('/perfil/editar')) {
    return <Navigate to="/perfil/editar" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
