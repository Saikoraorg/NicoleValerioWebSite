'use client';

import React from 'react';
import styles from './TechFeatureSection.module.css';

export const TechFeatureSection: React.FC = () => {
  return (
    <section className="section" id="galeria-privada" style={{ padding: '40px 0 100px' }}>
      <div className="section-container">
        <div className={styles.techCardGlass}>
          <div className={styles.cardBadge}>VENTAJA EXCLUSIVA FULL STACK</div>

          <div className={styles.contentRow}>
            <div className={styles.textCol}>
              <h3 className={`${styles.headline} font-serif`}>
                Tu Propio Portal Web Privado
              </h3>
              <p className={styles.sub}>
                No solo recibes fotos sueltas en una memoria. Diseñé una plataforma web privada con acceso por contraseña para cada cliente: visualización cinematográfica 4K, selección de favoritos para impresión y descarga instantánea optimizada para redes sociales y máxima resolución.
              </p>
              <div className={styles.perks}>
                <span className={styles.perkPill}>⚡ Carga instantánea Next.js</span>
                <span className={styles.perkPill}>🔒 Acceso con contraseña</span>
                <span className={styles.perkPill}>📱 Diseñado para móviles</span>
                <span className={styles.perkPill}>☁️ Respaldo en la nube</span>
              </div>
            </div>

            <div className={styles.previewCol}>
              <div className={styles.macbookMockup}>
                <div className={styles.screenBar}>
                  <span className={`${styles.dot} ${styles.red}`} />
                  <span className={`${styles.dot} ${styles.yellow}`} />
                  <span className={`${styles.dot} ${styles.green}`} />
                  <span className={styles.urlBar}>estudio.nicolevalerio.com/galeria/boda-ana-carlos</span>
                </div>
                <div className={styles.screenContent}>
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                    alt="Preview de galería digital"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
