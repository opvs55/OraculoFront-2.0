import React, { useEffect } from 'react';
// Importamos as ferramentas de navegação
import { BrowserRouter, useLocation } from 'react-router-dom';

// Importamos os contextos (a memória global do App)
import { AuthProvider } from './context/AuthContext';
// Dica: No futuro, podes importar um TarotContext aqui também.

// Importamos os componentes visuais
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import { trackPageview } from './lib/analytics';

// Importamos o estilo global
import './styles/globals.css';

// Precisa estar dentro do <BrowserRouter> para ter acesso a useLocation().
// Como é uma SPA, cada troca de rota conta como um novo "pageview" pro PostHog.
function AnalyticsPageviewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    /* 1. AuthProvider: É o "pai" de todos.
      Tudo o que estiver dentro dele sabe quem é o utilizador logado.
    */
    <AuthProvider>

      {/* 2. BrowserRouter: Permite a navegação entre páginas (URL).
      */}
      <BrowserRouter>

        <AnalyticsPageviewTracker />

        {/* O Header fica fora das rotas para aparecer em todas as páginas */}
        <Header />

        {/* 3. tag <main>: Semanticamente correta para o conteúdo principal.
           A classe 'content-container' pode ajudar a ajustar a altura mínima.
        */}
        <main className="content-container">
          <AppRoutes />
        </main>

        <Footer />

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
