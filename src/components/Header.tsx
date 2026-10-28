'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, ExternalLink } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Sticky Header without top black bar */}
      <header className={`${styles.siteHeader} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerContainer}>
          <a href="#inicio" className={styles.logoLink}>
            <span className={styles.logoTitle}>STUDIO NVF</span>
            <span className={styles.logoSubtitle}>NICOLE VALERIO · FOTOGRAFÍA</span>
          </a>

          {/* Desktop Nav */}
          <nav className={styles.mainNav} aria-label="Navegación principal">
            <ul className={styles.navList}>
              <li><a href="#inicio" className={styles.navLink}>Inicio</a></li>
              <li><a href="#work" className={styles.navLink}>Work</a></li>
              <li><a href="#press" className={styles.navLink}>Press</a></li>
              <li><a href="#books" className={styles.navLink}>Books</a></li>
              <li><a href="#contacto" className={styles.navLink}>Contacto</a></li>
            </ul>
          </nav>

          {/* Header Action & Mobile Menu Toggle */}
          <div className={styles.headerActions}>
            <button 
              className={styles.headerBookBtn}
              onClick={onOpenBooking}
            >
              <span>RESERVAR SESIÓN</span>
            </button>

            <button 
              className={styles.mobileMenuToggle}
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.mobileDrawerHeader}>
          <div className={styles.logoTitle}>STUDIO NVF</div>
          <button 
            className={styles.mobileDrawerClose}
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={26} />
          </button>
        </div>

        <ul className={styles.mobileNavList}>
          <li><a href="#inicio" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Inicio</a></li>
          <li><a href="#work" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Work</a></li>
          <li><a href="#press" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Press</a></li>
          <li><a href="#books" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Books (Catálogo)</a></li>
          <li><a href="#contacto" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Contacto</a></li>
        </ul>

        <div className={styles.mobileDrawerFooter}>
          <button 
            className={styles.mobileBookBtn}
            onClick={() => {
              setMobileOpen(false);
              onOpenBooking();
            }}
          >
            RESERVAR SESIÓN
          </button>
          <div className={styles.socialIconsRow}>
            <a href="https://studionvf.pixieset.com" target="_blank" rel="noopener" aria-label="Pixieset Portfolio">
              <ExternalLink size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
