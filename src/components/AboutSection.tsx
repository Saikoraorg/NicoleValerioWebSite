'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  onOpenStory: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenStory }) => {
  return (
    <section className="section" id="sobre-mi">
      <div className="section-container">
        <div className={styles.aboutGrid}>
          {/* Card 1: Sobre Nicole (Fotógrafa & Full Stack) */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrap}>
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                  alt="Nicole Valerio"
                  className={styles.avatar}
                />
                <span className={styles.badgeDot} />
              </div>
              <div className={styles.profileTitles}>
                <span className="sub-label">SOBRE NICOLE</span>
                <h3 className={`${styles.profileName} font-serif`}>
                  Soy Nicole, fotógrafa & dev full stack.
                </h3>
              </div>
            </div>

            <p className={styles.bio}>
              Creo en el poder de las historias reales, en la belleza de lo cotidiano y en la conexión genuina entre las personas. A través de mi lente, busco capturar lo que te hace único, con un estilo natural, honesto y atemporal.
            </p>

            <div className={styles.bioTech}>
              <strong>El toque tecnológico:</strong> Como desarrolladora de software, transformo tus fotos en una galería web interactiva, privada y de ultra alta velocidad donde tus invitados pueden descargar en resolución original o pedir impresiones en un clic.
            </div>

            <div className={styles.profileFooter}>
              <a href="#contacto" className={styles.textLink}>
                <span>Conoce más sobre mi proceso</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Card 2: Más que una fotografía (Featured Story Banner) */}
          <div className={styles.storyCard}>
            <div className={styles.storyImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
                alt="Sesión en el atardecer"
                className={styles.storyImage}
              />
              <div className={styles.storyTag}>HISTORIA DESTACADA</div>
            </div>

            <div className={styles.storyBody}>
              <span className="sub-label">HISTORIAS</span>
              <h3 className={`${styles.storyTitle} font-serif`}>
                Más que una fotografía
              </h3>
              <p className={styles.storyText}>
                Esta es la historia de una familia que decidió confiar en mí para capturar una etapa muy especial de sus vidas. Una sesión llena de risas, naturaleza y momentos reales que no volverán a repetirse de la misma forma.
              </p>
              <div className={styles.storyFooter}>
                <button className={styles.textLink} onClick={onOpenStory}>
                  <span>Leer historia completa</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
