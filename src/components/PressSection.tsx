'use client';

import React from 'react';
import styles from './PressSection.module.css';

interface PressSectionProps {
  onOpenBook: (slug: string) => void;
  onOpenBooking: () => void;
}

const PRESS_ARTICLES = [
  {
    slug: 'boda',
    badge: 'VOGUE WEDDINGS',
    title: 'Amor Eterno en el Valle',
    excerpt: 'Una ceremonia íntima bajo robles centenarios con fotografía documental en luz dorada.',
    img: '/assets/images/studionvf/press_1.jpg'
  },
  {
    slug: 'marcapersonal',
    badge: "HARPER'S BAZAAR",
    title: 'El Rostro de la Autenticidad',
    excerpt: 'Retratos de marca personal que conectan con la esencia humana y profesional de cada creador.',
    img: '/assets/images/studionvf/press_2.jpg'
  },
  {
    slug: 'parejas',
    badge: "L'OFFICIEL LIFESTYLE",
    title: 'Brisas & Sentimientos',
    excerpt: 'Sesión de pareja al atardecer en acantilados costeros, capturando la quietud del mar.',
    img: '/assets/images/studionvf/press_3.jpg'
  },
  {
    slug: 'embarazo',
    badge: 'MATERNITY JOURNAL',
    title: 'La Dulce Espera de la Vida',
    excerpt: 'Retratos íntimos de embarazo en tonos suaves, celebrando el milagro de una nueva vida.',
    img: '/assets/images/studionvf/press_4.jpg'
  },
  {
    slug: 'familia',
    badge: 'FAMILY CHRONICLES',
    title: 'El Vínculo Familiar',
    excerpt: 'Historias generacionales sin poses rígidas, donde la ternura y la espontaneidad son protagonistas.',
    img: '/assets/images/studionvf/press_5.jpg'
  },
  {
    slug: 'gastronomia',
    badge: 'GOURMET & ART',
    title: 'Texturas de Alta Cocina',
    excerpt: 'Fotografía gastronómica comercial que exalta ingredientes, composición y estética contemporánea.',
    img: '/assets/images/studionvf/press_6.jpg'
  }
];

export const PressSection: React.FC<PressSectionProps> = ({ onOpenBook, onOpenBooking }) => {
  return (
    <section className={styles.pressSection} id="press">
      <div className={styles.sectionContainer}>
        <div className={styles.pressLayoutGrid}>
          {/* Left side: Vertical Title & Branding */}
          <div className={styles.pressTitleColumn}>
            <div className={styles.pressWatermarkVertical} aria-hidden="true">PRESS</div>
            <h2 className={styles.editorialMainTitle}><em>Press</em> & Publicaciones</h2>
            <p className={styles.pressIntroText}>
              Historias visuales publicadas y destacadas en medios editoriales, blogs de bodas y campañas de autor.
            </p>
            <button className={styles.btnBoxMinimal} onClick={onOpenBooking}>
              SOLICITAR PUBLICACIÓN
            </button>
          </div>

          {/* Right side: 6 Press editorial articles */}
          <div className={styles.pressArticlesGrid}>
            {PRESS_ARTICLES.map((art, idx) => (
              <article key={idx} className={styles.pressItem}>
                <div className={styles.pressMedia}>
                  <img src={art.img} alt={art.title} loading="lazy" />
                  <div className={styles.pressLogoBadge}>
                    <span>{art.badge}</span>
                  </div>
                </div>
                <div className={styles.pressContent}>
                  <h3 className={styles.pressHeadline}><em>{art.title}</em></h3>
                  <p className={styles.pressExcerpt}>{art.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
