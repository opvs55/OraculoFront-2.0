import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const { user, loading, signOut } = useAuth(); 
  
  return (
    <header className={styles.header}>
      {/* Navegação Esquerda (Vazia para visitantes, com links para logados) */}
      <nav className={`${styles.nav} ${styles.navLeft}`}>
        {!loading && user && ( // MOVIDO: Só mostra Biblioteca e Comunidade se user existir
          <> 
            <NavLink 
              to="/biblioteca" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Biblioteca
            </NavLink>
            <NavLink 
              to="/comunidade" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Comunidade
            </NavLink>
          </>
        )}
        {/* Adiciona um placeholder vazio se não estiver logado para manter o layout do grid */}
        {!loading && !user && <div style={{ minWidth: '100px' }}></div>} 
      </nav>

      {/* Título Central */}
      <div className={styles.headerCenter}>
        <Link to="/" className={styles.headerLogo}>
          EXOTERICON
        </Link>
      </div>

      {/* Navegação Direita (Autenticação / Grimório) */}
      <nav className={`${styles.nav} ${styles.navRight}`}>
        {!loading && (
          <>
            {user ? (
              <>
                <NavLink 
                  to="/meu-grimorio" 
                  className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                >
                  Meu Grimório 
                </NavLink>
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