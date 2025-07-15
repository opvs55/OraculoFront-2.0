// src/components/common/ProtectedRoute/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Importe o hook useAuth
import Loader from '../Loader/Loader';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Pegue o usuário E o estado de loading do contexto
  const location = useLocation();

  // 1. Enquanto a verificação de autenticação estiver em andamento, mostre um loader.
  // Isso previne um "flash" da página de login antes da verificação terminar.
  if (loading) {
    return <Loader />;
  }

  // 2. Após a verificação, se não houver usuário, redirecione para o login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se a verificação terminou e existe um usuário, renderize a página protegida.
  return children;
}

export default ProtectedRoute;