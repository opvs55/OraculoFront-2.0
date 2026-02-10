import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAutoHideHeader } from '../../hooks/useAutoHideHeader';
import styles from './Header.module.css';

const centerLinks = [
  { to: '/tarot', label: 'Tarot' },
  { to: '/numerologia', label: 'Numerologia' },
  { to: '/mapa-astral', label: 'Mapa Astral' },
  { to: '/leitura-unificada', label: 'Leitura Unificada' },
];

function Header() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const accountRef = useRef(null);
  const exploreRef = useRef(null);

  const [isLeftDropdownOpen, setIsLeftDropdownOpen] = useState(false);
  const accountRef = useRef(null);
  const leftDropdownRef = useRef(null);
  const accountAnimationTimeout = useRef(null);
  const [isAccountAnimating, setIsAccountAnimating] = useState(false);

  const { isHidden, reveal } = useAutoHideHeader(false);

  const isPublicHome = location.pathname === '/' && !user;
  const isInternal = Boolean(user);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);

    setIsExploreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
    };

    if (isAccountOpen || isExploreOpen) {
      document.addEventListener('mousedown', onDocumentClick);
    }

    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [isAccountOpen, isExploreOpen]);

  useEffect(() => {
    if (isMenuOpen || isAccountOpen || isExploreOpen) {
      reveal();
    }
  }, [isMenuOpen, isAccountOpen, isExploreOpen, reveal]);

    setIsLeftDropdownOpen(false);
  }, [location.pathname]);

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

  useEffect(() => {
    if (isMenuOpen || isAccountOpen || isLeftDropdownOpen) reveal();
  }, [isMenuOpen, isAccountOpen, isLeftDropdownOpen, reveal]);

  useEffect(
    () => () => {
      if (accountAnimationTimeout.current) {
        clearTimeout(accountAnimationTimeout.current);
      }
    },
    [],
  );


  const onExploreKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsExploreOpen(false);
    }
  };

  return (

    <header className={`${styles.header} ${isInternal ? styles.headerInternal : ''} ${isPublicHome ? styles.headerWelcome : ''} ${isInternal && isHidden && !isMenuOpen && !isAccountOpen ? styles.headerHidden : ''}`}>
      <nav className={`${styles.navZone} ${styles.leftZone}`} aria-label="Explorar">
        {isInternal && (
          <>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Abrir menu principal"
              aria-controls="mobile-header-menu"
              aria-expanded={isMenuOpen}
            >
              <span className={styles.mobileMenuIcon} />
            </button>

            <div className={styles.dropdownWrapper} ref={exploreRef} onKeyDown={onExploreKeyDown}>
              <button
                type="button"
                className={styles.dropdownTrigger}
                onClick={() => setIsExploreOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isExploreOpen}
                aria-label="Abrir menu Explorar"
              >
                Explorar
              </button>
              {isExploreOpen && (
                <div className={styles.dropdownMenu} role="menu">
                  <NavLink className={styles.dropdownLink} to="/meu-grimorio" role="menuitem">
                    Meu Grimório
                  </NavLink>
                  <NavLink className={styles.dropdownLink} to="/biblioteca" role="menuitem">
                    Biblioteca
                  </NavLink>
                  <NavLink className={styles.dropdownLink} to="/comunidade" role="menuitem">

    <header
      className={`${styles.header} ${isPublicHome ? styles.headerWelcome : ''} ${isInternal ? styles.headerInternal : ''} ${isInternal && isHidden && !isMenuOpen && !isAccountOpen ? styles.headerHidden : ''}`}
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

          </>
        )}
      </nav>

      <nav className={`${styles.navZone} ${styles.centerZone}`} aria-label="Oráculos principais">
        {isInternal && centerLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.centerLink} ${isActive ? styles.centerLinkActive : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
        {!isInternal && !isPublicHome && (
          <Link to="/" className={styles.brandLink}>ESOTERICON</Link>
        )}
      </nav>

      <nav className={`${styles.navZone} ${styles.rightZone}`} aria-label="Conta">
        {!loading && (
          user ? (
            <div className={styles.accountWrapper} ref={accountRef}>
              <button
                type="button"
                className={styles.accountButton}
                onClick={() => setIsAccountOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
                aria-label="Abrir menu da conta"
              >
                ✦
              </button>
              {isAccountOpen && (
                <div className={styles.accountMenu} role="menu">
                  <Link className={styles.accountLink} role="menuitem" to="/perfil">Perfil</Link>
                  <Link className={styles.accountLink} role="menuitem" to="/perfil/editar">Editar perfil</Link>
                  <button type="button" role="menuitem" className={styles.accountLinkButton} onClick={signOut}>Sair</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authLinks}>
              <NavLink to="/login" className={styles.authLink}>Entrar</NavLink>
              <NavLink to="/cadastro" className={styles.authButton}>Cadastrar</NavLink>
            </div>
          )

            <NavLink to="/tarot" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
              Tarot
            </NavLink>
            <NavLink to="/numerologia" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
              Numerologia
            </NavLink>
            <NavLink to="/mapa-astral" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
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
                    <polygon points="32 6 38.5 24 57 24 42 35.5 47.5 54 32 43 16.5 54 22 35.5 7 24 25.5 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
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
                <NavLink to="/login" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
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

        <div id="mobile-header-menu" className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuLinks}>
            {[...centerLinks, { to: '/meu-grimorio', label: 'Meu Grimório' }, { to: '/biblioteca', label: 'Biblioteca' }, { to: '/comunidade', label: 'Comunidade' }, { to: '/perfil', label: 'Perfil' }].map((link) => (
              <NavLink key={link.to} to={link.to} className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className={styles.mobileOraclesRail} aria-label="Atalhos de oráculos">
            {centerLinks.map((link) => (
              <NavLink key={`rail-${link.to}`} to={link.to} className={styles.mobileOracleChip} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}

        <div id="menu-interno" className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuContent}>
            <NavLink to="/tarot" className={styles.mobileLink} onClick={handleCloseMenu}>Tarot</NavLink>
            <NavLink to="/numerologia" className={styles.mobileLink} onClick={handleCloseMenu}>Numerologia</NavLink>
            <NavLink to="/mapa-astral" className={styles.mobileLink} onClick={handleCloseMenu}>Mapa Astral</NavLink>
            <NavLink to="/meu-grimorio" className={styles.mobileLink} onClick={handleCloseMenu}>Grimório</NavLink>
            <NavLink to="/biblioteca" className={styles.mobileLink} onClick={handleCloseMenu}>Biblioteca</NavLink>
            <NavLink to="/comunidade" className={styles.mobileLink} onClick={handleCloseMenu}>Comunidade</NavLink>
            <NavLink to="/perfil/editar" className={styles.mobileLink} onClick={handleCloseMenu}>Perfil</NavLink>
            <button type="button" className={styles.mobileGhostButton} onClick={signOut}>Sair</button>

          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
