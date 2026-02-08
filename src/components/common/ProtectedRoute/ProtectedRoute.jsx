// src/components/common/ProtectedRoute/ProtectedRoute.jsx

import React from 'react';
// 1. Importar o Outlet
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Importe o hook useAuth
import Loader from '../Loader/Loader';
import { isProfileComplete } from '../../../utils/profileCompletion';
import { useUserProfile } from '../../../hooks/useUserProfile';

// 2. Remover a prop { children } da função
function ProtectedRoute() {
  const { user, loading } = useAuth(); // Pegue o usuário E o estado de loading do contexto
  const location = useLocation();
  const { profile, isLoading: isProfileLoading } = useUserProfile(user?.id);

  // A tua lógica de "loading" está perfeita e mantém-se.
  if (loading || isProfileLoading) {
    return <Loader />;
  }

  // A tua lógica de "não autenticado" está perfeita e mantém-se.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const needsProfileSetup = !isProfileComplete(profile);
  if (needsProfileSetup && location.pathname !== '/perfil/editar') {
    return <Navigate to="/perfil/editar" state={{ from: location }} replace />;
  }

  // 3. Se a verificação terminou e existe um usuário, renderize o Outlet.
  // O Outlet vai renderizar a rota filha (ex: <MeuGrimorioPage />)
  return <Outlet />;
}

export default ProtectedRoute;
