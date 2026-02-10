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
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
