import React, { Suspense, lazy } from 'react'; // 1. Importar Suspense e lazy
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute.jsx';
import './styles/globals.css';

// Componente simples para mostrar enquanto as páginas carregam
// (Pode criar um ficheiro separado para isto ou um spinner mais bonito)
const PageLoader = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    A carregar...
  </div>
);

// --- Páginas Carregadas de forma "Lazy" (Preguiçosa) ---
// 2. Alterar as importações estáticas para dinâmicas com lazy()

// Páginas Públicas
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const TarotPage = lazy(() => import('./pages/TarotPage'));

// Autenticação
const CadastroPage = lazy(() => import('./pages/auth/CadastroPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RequestPasswordResetPage = lazy(() => import('./pages/auth/RequestPasswordResetPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Leitura
const PastReadingPage = lazy(() => import('./pages/reading/PastReadingPage/PastReadingPage'));
const CardDetailPage = lazy(() => import('./pages/reading/CardDetailPage/CardDetailPage'));

// Perfil Público
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

// Aprendizagem (Protegida)
const CardLibraryPage = lazy(() => import('./pages/learning/CardLibraryPage'));
const LearningCardDetailPage = lazy(() => import('./pages/learning/LearningCardDetailPage'));

// Dashboard (Protegida)
const MeuGrimorioPage = lazy(() => import('./pages/dashboard/MeuGrimorioPage'));
const EditarPerfilPage = lazy(() => import('./pages/dashboard/EditarPerfilPage'));

// Comunidade (Protegida)
const CommunityFeedPage = lazy(() => import('./pages/community/CommunityFeedPage'));


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
          {/* 3. Envolver as Rotas com o Suspense */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* --- Rotas Públicas --- */}
              <Route path="/" element={<WelcomePage />} /> 
              <Route path="/tarot" element={<TarotPage />} /> 

              {/* Rotas de Autenticação */}
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/recuperar-senha" element={<RequestPasswordResetPage />} />
              <Route path="/resetar-senha" element={<ResetPasswordPage />} />
              
              {/* Rotas de Leitura */}
              <Route path="/leitura/:readingId" element={<PastReadingPage />} />
              <Route path="/leitura/:readingId/carta/:position" element={<CardDetailPage />} />

              {/* Rota do Perfil Público */}
              <Route path="/perfil/:username" element={<ProfilePage />} /> 
              
              {/* --- Rotas Protegidas --- */}
              <Route 
                path="/meu-grimorio" 
                element={<ProtectedRoute><MeuGrimorioPage /></ProtectedRoute>} 
              /> 
              <Route 
                path="/perfil/editar" 
                element={<ProtectedRoute><EditarPerfilPage /></ProtectedRoute>} 
              />
              <Route 
                path="/biblioteca" 
                element={<ProtectedRoute><CardLibraryPage /></ProtectedRoute>} 
              />
              <Route 
                path="/biblioteca/:cardSlug" 
                element={<ProtectedRoute><LearningCardDetailPage /></ProtectedRoute>} 
              />
              <Route 
                path="/comunidade" 
                element={<ProtectedRoute><CommunityFeedPage /></ProtectedRoute>} 
              />

            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;