import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAutoHideHeader } from '../../hooks/useAutoHideHeader';
import styles from './Header.module.css';

function Header() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const isInternal = Boolean(user) && !isWelcome;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { isHidden, reveal } = useAutoHideHeader(isInternal);

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);

  const accountInitial = useMemo(() => {
    const name = user?.user_metadata?.full_name || user?.email || '';
    return name ? name.trim().charAt(0).toUpperCase() : 'U';
  }, [user]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAccountOpen) return;
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountOpen]);

  useEffect(() => {
    if (isMenuOpen || isAccountOpen) reveal();
  }, [isMenuOpen, isAccountOpen, reveal]);
  
  return (
    <header
      className={`${styles.header} ${isWelcome ? styles.headerWelcome : ''} ${isInternal ? styles.headerInternal : ''} ${isInternal && isHidden && !isMenuOpen && !isAccountOpen ? styles.headerHidden : ''}`}
    >
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
            <NavLink 
              to="/numerologia" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Numerologia
            </NavLink>
            <NavLink 
              to="/perfil/editar" 
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
            >
              Perfil
            </NavLink>
          </>
        )}
      {/* Placeholder para manter layout quando deslogado */}
        {!loading && !user && <div style={{ minWidth: '100px' }}></div>} 
      </nav>

      {/* Título Central */}
      {!isWelcome && !isInternal && (
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
                <span className={styles.ctaFull}>Fazer leitura</span>
                <span className={styles.ctaShort}>Leitura</span>
              </Link>
            )}
            {/* Links/Botões de Autenticação/Perfil */}
            {user ? (
              <div className={styles.accountWrapper} ref={accountRef}>
                <button
                  type="button"
                  className={styles.accountButton}
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                >
                  <span>{accountInitial}</span>
                </button>
                {isAccountOpen && (
                  <div className={styles.accountMenu} role="menu">
                    <button type="button" role="menuitem" onClick={signOut}>
                      Sair
                    </button>
                  </div>
                )}
              </div>
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
            <NavLink to="/perfil/editar" className={styles.mobileLink} onClick={handleCloseMenu}>
              Perfil
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
