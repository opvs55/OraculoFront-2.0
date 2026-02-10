import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAutoHideHeader } from '../../hooks/useAutoHideHeader';
import styles from './Header.module.css';

function Header() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const isInternal = Boolean(user);
  const isPublicHome = isWelcome && !user;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLeftDropdownOpen, setIsLeftDropdownOpen] = useState(false);
  
  const accountRef = useRef(null);
  const leftDropdownRef = useRef(null);
  const accountAnimationTimeout = useRef(null);
  const [isAccountAnimating, setIsAccountAnimating] = useState(false);
  
  const { isHidden, reveal } = useAutoHideHeader(false);

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);

  // Fecha menus ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
    setIsLeftDropdownOpen(false);
  }, [location.pathname]);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (leftDropdownRef.current && !leftDropdownRef.current.contains(event.target)) {
        setIsLeftDropdownOpen(false);
      }
    };

    if (isAccountOpen || isLeftDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountOpen, isLeftDropdownOpen]);

  // Revela o header se algum menu estiver aberto
  useEffect(() => {
    if (isMenuOpen || isAccountOpen || isLeftDropdownOpen) {
      reveal();
    }
  }, [isMenuOpen, isAccountOpen, isLeftDropdownOpen, reveal]);

  // Cleanup da animação
  useEffect(() => {
    return () => {
      if (accountAnimationTimeout.current) {
        clearTimeout(accountAnimationTimeout.current);
      }
    };
  }, []);

  const handleAccountToggle = () => {
    setIsAccountOpen((prev) => !prev);
    setIsAccountAnimating(true);
    if (accountAnimationTimeout.current) {
      clearTimeout(accountAnimationTimeout.current);
    }
    accountAnimationTimeout.current = setTimeout(() => {
      setIsAccountAnimating(false);
    }, 220);
  };

  return (
    <header
      className={`${styles.header} ${isPublicHome ? styles.headerWelcome : ''} ${
        isInternal ? styles.headerInternal : ''
      } ${isInternal && isHidden && !isMenuOpen && !isAccountOpen ? styles.headerHidden : ''}`}
    >
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
            <div className={styles.leftDropdownWrapper} ref={leftDropdownRef}>
              <button
                type="button"
                className={styles.leftDropdownButton}
                onClick={() => setIsLeftDropdownOpen((prev) => !prev)}
                aria-expanded={isLeftDropdownOpen}
              >
                Explorar
              </button>
              {isLeftDropdownOpen && (
                <div className={styles.leftDropdownMenu}>
                  <NavLink to="/meu-grimorio" className={styles.accountMenuLink}>
                    Grimório
                  </NavLink>
                  <NavLink to="/biblioteca" className={styles.accountMenuLink}>
                    Biblioteca
                  </NavLink>
                  <NavLink to="/comunidade" className={styles.accountMenuLink}>
                    Comunidade
                  </NavLink>
                </div>
              )}
            </div>
            <NavLink
              to="/tarot"
              className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}
            >
              Tarot
            </NavLink>
            <NavLink
              to="/numerologia"
              className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}
            >
              Numerologia
            </NavLink>
            <NavLink
              to="/mapa-astral"
              className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}
            >
              Mapa Astral
            </NavLink>
          </>
        )}
        {!loading && !user && <div style={{ minWidth: '100px' }} />}
      </nav>

      {!isPublicHome && !isInternal && (
        <div className={styles.headerCenter}>
          <Link to="/" className={styles.headerLogo}>
            ESOTERICON
          </Link>
        </div>
      )}

      <nav className={`${styles.nav} ${styles.navRight}`} aria-label="Ações do usuário">
        {!loading && (
          <>
            {isInternal && (
              <Link to="/tarot" className={styles.primaryButton}>
                <span className={styles.ctaFull}>Fazer leitura</span>
                <span className={styles.ctaShort}>Leitura</span>
              </Link>
            )}
            {user ? (
              <div className={styles.accountWrapper} ref={accountRef}>
                <button
                  type="button"
                  className={`${styles.accountButton} ${isAccountAnimating ? styles.accountButtonActive : ''}`}
                  onClick={handleAccountToggle}
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                  aria-label="Menu do perfil"
                >
                  <svg className={styles.accountIcon} viewBox="0 0 64 64" role="presentation" aria-hidden="true">
                    <polygon
                      points="32 6 38.5 24 57 24 42 35.5 47.5 54 32 43 16.5 54 22 35.5 7 24 25.5 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
                {isAccountOpen && (
                  <div className={styles.accountMenu} role="menu">
                    <Link to="/perfil/editar" role="menuitem" className={styles.accountMenuLink}>
                      Perfil
                    </Link>
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
                  className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}
                >
                  Entrar
                </NavLink>
                <NavLink to="/cadastro" className={styles.signUpButton}>
                  Cadastrar
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>

      {isInternal && (
        <div id="menu-interno" className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuContent}>
            <NavLink to="/tarot" className={styles.mobileLink} onClick={handleCloseMenu}>
              Tarot
            </NavLink>
            <NavLink to="/numerologia" className={styles.mobileLink} onClick={handleCloseMenu}>
              Numerologia
            </NavLink>
            <NavLink to="/mapa-astral" className={styles.mobileLink} onClick={handleCloseMenu}>
              Mapa Astral
            </NavLink>
            <NavLink to="/meu-grimorio" className={styles.mobileLink} onClick={handleCloseMenu}>
              Grimório
            </NavLink>
            <NavLink to="/biblioteca" className={styles.mobileLink} onClick={handleCloseMenu}>
              Biblioteca
            </NavLink>
            <NavLink to="/comunidade" className={styles.mobileLink} onClick={handleCloseMenu}>
              Comunidade
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
