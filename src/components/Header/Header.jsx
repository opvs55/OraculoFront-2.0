// src/components/Header/Header.jsx - VERSÃO ATUALIZADA

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const { user, loading } = useAuth();
  
  // REMOVIDO: O logo foi movido para a HomePage.
  // REMOVIDO: A função handleSignOut e o botão "Sair".

  return (
    <header className={styles.header}>
      {/* A navegação agora é o elemento principal do header */}
      <nav className={styles.nav}>
        {/* Não mostra nada enquanto a autenticação carrega para evitar "piscar" de conteúdo */}
        {!loading && (
          user ? (
            <>
              <NavLink to="/" className={styles.newReadingLink}>
                Fazer Leitura
              </NavLink>
              {/* Este NavLink já funciona como solicitado para o "Meu Perfil" */}
              <NavLink 
                to="/painel" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Meu Perfil
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Entrar
              </NavLink>
              <NavLink 
                to="/cadastro" 
                className={styles.signUpButton}
              >
                Cadastrar
              </NavLink>
            </>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;