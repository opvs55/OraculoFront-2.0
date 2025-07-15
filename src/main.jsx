// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/globals.css';

// 1. Criamos uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 2. A SOLUÇÃO DEFINITIVA PARA O ALT+TAB:
      // Desativa a busca de dados automática quando a janela ganha foco.
      refetchOnWindowFocus: false,
      
      // Opcional, mas recomendado: Evita múltiplas tentativas de busca em caso de erro.
      retry: 1, 
      
      // Opcional: Mantém os dados em cache por 5 minutos antes de considerá-los "velhos".
      staleTime: 1000 * 60 * 5,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Envolvemos toda a aplicação com o provedor */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);