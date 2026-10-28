'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ReviewsSection.module.css';

const REVIEWS = [
  {
    id: 1,
    quote: 'Nicole tiene un talento increíble para capturar la esencia de cada momento. Nos hizo sentir súper cómodos y el resultado fue más de lo que imaginamos. La galería digital fue sencillamente de otro nivel.',
    name: 'Daniela y Andrés',
    tag: 'Boda en Valle de Bravo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 2,
    quote: 'Las fotos de nuestro embarazo son un recuerdo invaluable. Nicole fue muy atenta, paciente con nosotros y profesional en todo momento. Su estilo luminoso y cálido es único.',
    name: 'Mariana López',
    tag: 'Sesión de Maternidad',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 3,
    quote: 'La sesión familiar fue una experiencia hermosa. Con dos niños pequeños pensé que sería un caos, pero nos hizo sentir relajados y el resultado fue simplemente espectacular.',
    name: 'Valeria Torres',
    tag: 'Sesión Familiar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
];

export const ReviewsSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: dir === 'right' ? 340 : -340,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section" id="resenas">
      <div className="section-container">
        <div className={styles.headerRow}>
          <div>
            <span className="section-tag">RESEÑAS</span>
            <h2 className="section-title">Lo que dicen <em>mis clientes</em></h2>
          </div>
          <div className={styles.navControls}>
            <button className={styles.ctrlBtn} onClick={() => scroll('left')} aria-label="Anterior">
              <ChevronLeft size={20} />
            </button>
            <button className={styles.ctrlBtn} onClick={() => scroll('right')} aria-label="Siguiente">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className={styles.slider} ref={sliderRef}>
          <div className={styles.grid}>
            {REVIEWS.map((r) => (
              <div key={r.id} className={styles.card}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.quote}>"{r.quote}"</p>
                <div className={styles.meta}>
                  <img src={r.avatar} alt={r.name} className={styles.avatar} />
                  <div>
                    <h4 className={`${styles.name} font-serif`}>{r.name}</h4>
                    <span className={styles.tag}>{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
