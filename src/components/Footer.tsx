'use client';

import React from 'react';
import { Instagram, Github, Facebook } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.container}>
        <div className={styles.left}>
          <a href="#inicio" className={styles.logoLink}>
            <span className={styles.logoTitle}>NICOLE VALERIO</span>
            <span className={styles.logoSubtitle}>F O T O G R A F Í A</span>
          </a>
        </div>

        <div className={styles.center}>
          <div className={styles.socialList}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub Developer Profile"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <span className={styles.motto}>Momentos que permanecen</span>
        </div>
      </div>

      <div className={styles.bottomCopyright}>
        <p>&copy; 2026 Nicole Valerio. Todos los derechos reservados. Desarrollado con Next.js y código limpio.</p>
      </div>
    </footer>
  );
};
