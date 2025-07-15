// src/components/Header/Header.jsx - VERSÃO CORRIGIDA

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // 1. Usa o hook customizado em vez do useContext genérico
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  // 2. O hook nos dá o estado de autenticação de forma limpa e confiável.
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        ORÁCULO IA
      </Link>
      
      <nav className={styles.nav}>
        {/* Enquanto a autenticação carrega, não mostramos os botões para evitar um "flash" */}
        {!loading && (
          user ? (
            <>
              <NavLink to="/" className={styles.newReadingLink}>
                Fazer Leitura
              </NavLink>
              <NavLink to="/painel" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                Meu Perfil
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.signUpButton}` : `${styles.navLink} ${styles.signUpButton}`}>
                Cadastrar
              </NavLink>
            </>
          )
        )}
      </nav>
      
      {/* 3. O botão de sair só aparece se não estiver carregando E se o usuário existir. */}
      {!loading && user && (
         <button onClick={handleSignOut} className={styles.signOutButtonHeader}>Sair</button>
      )}
    </header>
  );
}

export default Header;