'use client';

import React from 'react';
import { Calendar, Users, Heart, Gift, Send, ArrowRight } from 'lucide-react';
import styles from './CtaSection.module.css';

interface CtaSectionProps {
  onOpenBooking: (service?: string) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="section" id="contacto" style={{ backgroundColor: '#f7f3ec' }}>
      <div className="section-container">
        <div className={styles.ctaGrid}>
          {/* Left: Big Visual Banner */}
          <div className={styles.bannerCard}>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              alt="Paisaje atardecer"
              className={styles.bannerBg}
            />
            <div className={styles.bannerOverlay} />
            <div className={styles.bannerContent}>
              <span className={styles.tagline}>TU HISTORIA TAMBIÉN</span>
              <h2 className={`${styles.heading} font-serif`}>
                merece ser contada
              </h2>
              <p className={styles.subtext}>
                Reserva tu sesión o contáctame para proyectos personalizados y fotografía en destino.
              </p>
              <button className="btn btn-white-pill" onClick={() => onOpenBooking()}>
                <Calendar size={18} />
                <span>Reservar sesión</span>
              </button>
            </div>
          </div>

          {/* Right: Standardized Services List & Special Projects */}
          <div className={styles.infoCol}>
            <div className={styles.standardBox}>
              <h3 className={`${styles.boxTitle} font-serif`}>Servicios estandarizados</h3>
              <p className={styles.boxDesc}>
                Estas sesiones pueden reservarse directamente a través de nuestro calendario interactivo.
              </p>

              <ul className={styles.standardList}>
                <li className={styles.listItem} onClick={() => onOpenBooking('Embarazo')}>
                  <div className={styles.itemLeft}>
                    <Heart size={18} color="#996e3b" />
                    <span>Embarazo & Maternidad</span>
                  </div>
                  <ArrowRight size={16} />
                </li>
                <li className={styles.listItem} onClick={() => onOpenBooking('Familiares')}>
                  <div className={styles.itemLeft}>
                    <Users size={18} color="#996e3b" />
                    <span>Familiares & Parejas</span>
                  </div>
                  <ArrowRight size={16} />
                </li>
                <li className={styles.listItem} onClick={() => onOpenBooking('Cumpleaños')}>
                  <div className={styles.itemLeft}>
                    <Gift size={18} color="#996e3b" />
                    <span>Cumpleaños & Quinceañeras</span>
                  </div>
                  <ArrowRight size={16} />
                </li>
              </ul>
            </div>

            <div className={styles.specialBox}>
              <h4 className={`${styles.specialTitle} font-serif`}>¿Tienes un proyecto especial?</h4>
              <p className={styles.specialDesc}>
                Bodas, eventos, fotografía gastronómica o ubicaciones especiales. Escríbeme y lo platicamos.
              </p>
              <button className="btn btn-outline-dark" onClick={() => onOpenBooking('Personalizado')}>
                <Send size={16} />
                <span>Contáctame</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
