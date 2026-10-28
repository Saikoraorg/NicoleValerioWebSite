'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './ServicesSection.module.css';

export interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  img: string;
  badge?: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'Embarazo',
    name: 'Embarazo',
    desc: 'Capturando la dulce espera con luz suave, naturalidad y comodidad absoluta.',
    img: 'https://images.unsplash.com/photo-1537655780520-1e392ead81f2?auto=format&fit=crop&w=600&q=80',
    badge: 'Más popular',
  },
  {
    id: 'Familiares',
    name: 'Familiares',
    desc: 'Cero poses rígidas. Risas espontáneas, juegos y la complicidad que los une.',
    img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Cumpleaños',
    name: 'Cumpleaños',
    desc: 'Inmortaliza cada velita, la emoción de soplar el pastel y la alegría de celebrar la vida.',
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Bodas',
    name: 'Bodas',
    desc: 'Cobertura documental y cinematográfica desde los preparativos hasta el baile final.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    badge: 'Exclusivo',
  },
  {
    id: 'Gastronómica',
    name: 'Gastronómica',
    desc: 'Resalta texturas, colores y la maestría culinaria para menús y marcas de autor.',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Eventos',
    name: 'Eventos',
    desc: 'Lanzamientos, galas y aniversarios capturados con discreción y elegancia editorial.',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
  },
];

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section className="section" id="servicios" style={{ backgroundColor: '#f7f3ec' }}>
      <div className="section-container">
        <div className={styles.topRow}>
          <div>
            <span className="section-tag">PORTAFOLIO & PAQUETES</span>
            <h2 className="section-title">Elige tu sesión</h2>
          </div>
          <a href="#portafolio" className={styles.seeAllLink}>
            <span>Ver todo el portafolio</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* 6 Cards Grid */}
        <div className={styles.servicesGrid}>
          {SERVICES.map((s) => (
            <article
              key={s.id}
              className={styles.serviceCard}
              onClick={() => onSelectService(s.name)}
            >
              <div className={styles.mediaWrap}>
                <img src={s.img} alt={s.name} loading="lazy" />
                {s.badge && (
                  <span className={`${styles.badge} ${s.badge === 'Exclusivo' ? styles.badgeAccent : ''}`}>
                    {s.badge}
                  </span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={`${styles.serviceName} font-serif`}>{s.name}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
                <div className={styles.cardAction}>
                  <span className={styles.ctaText}>Ver detalles &rarr;</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
