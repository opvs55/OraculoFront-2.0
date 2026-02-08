import React from 'react';
// Importamos as ferramentas de navegação
import { BrowserRouter } from 'react-router-dom';

// Importamos os contextos (a memória global do App)
import { AuthProvider } from './context/AuthContext';
// Dica: No futuro, podes importar um TarotContext aqui também.

// Importamos os componentes visuais
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';

// Importamos o estilo global
import './styles/globals.css';

function App() {
  return (
    /* 1. AuthProvider: É o "pai" de todos. 
      Tudo o que estiver dentro dele sabe quem é o utilizador logado.
    */
    <AuthProvider>
      
      {/* 2. BrowserRouter: Permite a navegação entre páginas (URL). 
      */}
      <BrowserRouter>
        
        {/* O Header fica fora das rotas para aparecer em todas as páginas */}
        <Header />
        
        {/* 3. tag <main>: Semanticamente correta para o conteúdo principal.
           A classe 'content-container' pode ajudar a ajustar a altura mínima.
        */}
        <main className="content-container">
          <AppRoutes />
        </main>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
