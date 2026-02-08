import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const { user, loading, signOut } = useAuth(); 
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const isInternal = Boolean(user) && !isWelcome;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);
  
  return (
    <header className={`${styles.header} ${isWelcome ? styles.headerWelcome : ''} ${isInternal ? styles.headerInternal : ''}`}>
      {/* Navegação Esquerda */}
      <nav className={`${styles.nav} ${styles.navLeft}`} aria-label="Navegação principal">
        {isInternal && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleToggleMenu}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            aria-controls="menu-interno"
          >
            <span className={styles.menuIcon} />
          </button>
        )}
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
      {!isWelcome && (
        <div className={styles.headerCenter}>
          <Link to="/" className={styles.headerLogo}>
            ESOTERICON
          </Link>
        </div>
      )}

      {/* Navegação Direita */}
      <nav className={`${styles.nav} ${styles.navRight}`} aria-label="Ações do usuário">
        {!loading && (
          <>
            {isInternal && (
              <Link to="/tarot" className={styles.primaryButton}>
                Fazer leitura
              </Link>
            )}
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

      {isInternal && (
        <div
          id="menu-interno"
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
        >
          <div className={styles.mobileMenuContent}>
            <NavLink to="/meu-grimorio" className={styles.mobileLink} onClick={handleCloseMenu}>
              Meu Grimório
            </NavLink>
            <NavLink to="/biblioteca" className={styles.mobileLink} onClick={handleCloseMenu}>
              Biblioteca
            </NavLink>
            <NavLink to="/comunidade" className={styles.mobileLink} onClick={handleCloseMenu}>
              Comunidade
            </NavLink>
            <NavLink to="/numerologia" className={styles.mobileLink} onClick={handleCloseMenu}>
              Numerologia
            </NavLink>
            <button type="button" className={styles.mobileGhostButton} onClick={signOut}>
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
