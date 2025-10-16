import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link } from 'react-router-dom'; // Adicionamos 'Link' para o logo do cabeçalho
import styles from './Header.module.css';

function Header() {
  const { user, loading, signOut } = useAuth(); // Recuperamos a função signOut
  
  return (
    <header className={styles.header}>
      {/* NOVO: Logo clicável no canto esquerdo do cabeçalho */}
      <Link to="/" className={styles.headerLogo}>
        Oráculo IA
      </Link>
      
      <nav className={styles.nav}>
        {!loading && (
          <>
            {/* NOVO: Link da Biblioteca, visível para todos */}
            <NavLink 
              to="/biblioteca" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Biblioteca
            </NavLink>

            {user ? (
              <>
                <NavLink 
                  to="/painel" 
                  className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                >
                  Meu Painel
                </NavLink>
                {/* NOVO: Botão de Sair para usuários logados */}
                <button onClick={signOut} className={styles.logoutButton}>
                  Sair
                </button>
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
            )}
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;