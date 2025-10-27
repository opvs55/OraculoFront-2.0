import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes'; // 1. Importar o novo componente de rotas
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
          <AppRoutes /> {/* 2. Usar o componente de rotas aqui */}
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;