import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const { user, loading, signOut } = useAuth(); 
  
  return (
    <header className={styles.header}>
      {/* Navegação Esquerda */}
      <nav className={`${styles.nav} ${styles.navLeft}`}>
        {!loading && user && ( 
          <> 
            {/* <<< NOVO LINK PARA NUMEROLOGIA >>> */}
            <NavLink 
              to="/numerologia" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Numerologia
            </NavLink>
            {/* <<< FIM DO NOVO LINK >>> */}

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
      {/* Placeholder para manter layout quando deslogado */}
        {!loading && !user && <div style={{ minWidth: '100px' }}></div>} 
      </nav>

      {/* Título Central */}
      <div className={styles.headerCenter}>
        <Link to="/" className={styles.headerLogo}>
          ESOTERICON
        </Link>
      </div>

      {/* Navegação Direita */}
      <nav className={`${styles.nav} ${styles.navRight}`}>
        {!loading && (
          <>
            {/* Botão Fazer Leitura */}
            <Link to="/tarot" className={styles.ctaButton}>
              Fazer Leitura
            </Link>

            {/* Links/Botões de Autenticação/Perfil */}
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