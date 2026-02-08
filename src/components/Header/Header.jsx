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
            {/* --- "Meu Grimório" MOVIDO PARA A ESQUERDA --- */}
            <NavLink 
              to="/meu-grimorio" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Meu Grimório 
            </NavLink>
            {/* --- FIM DA MUDANÇA --- */}

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
            
            {/* "Numerologia" foi REMOVIDA DAQUI */}
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
            {/* --- "Numerologia" MOVIDA PARA A DIREITA (apenas se logado) --- */}
            {user && (
              <NavLink 
                to="/numerologia" 
                /* Aplicando o novo estilo único */
                className={({ isActive }) => 
                  isActive 
                  ? `${styles.numerologyButton} ${styles.numerologyActive}` 
                  : styles.numerologyButton
                }
              >
                Numerologia
              </NavLink>
            )}
            {/* --- FIM DA MUDANÇA --- */}


            {/* Links/Botões de Autenticação/Perfil */}
            {user ? (
              <>
                {/* "Meu Grimório" foi REMOVIDO DAQUI */}
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
