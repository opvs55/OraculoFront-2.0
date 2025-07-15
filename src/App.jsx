// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute.jsx';
import './styles/globals.css';

// Páginas
import HomePage from './pages/HomePage';
import CadastroPage from './pages/auth/CadastroPage';
import LoginPage from './pages/auth/LoginPage';
import PainelPage from './pages/dashboard/PainelPage';
import EditarPerfilPage from './pages/dashboard/EditarPerfilPage';
import PastReadingPage from './pages/reading/PastReadingPage/PastReadingPage';
import CardDetailPage from './pages/reading/CardDetailPage/CardDetailPage';

function App() {
  return (
    // ReadingProvider foi REMOVIDO. Sua lógica foi substituída pela TanStack Query.
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas Protegidas */}
            <Route path="/painel" element={<ProtectedRoute><PainelPage /></ProtectedRoute>} />
            <Route path="/perfil/editar" element={<ProtectedRoute><EditarPerfilPage /></ProtectedRoute>} />
            <Route path="/leitura/:readingId" element={<ProtectedRoute><PastReadingPage /></ProtectedRoute>} />
            <Route path="/leitura/:readingId/carta/:position" element={<ProtectedRoute><CardDetailPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;