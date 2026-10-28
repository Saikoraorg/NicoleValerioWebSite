'use client';

import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [typedName, setTypedName] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fullName = 'Nicole Valerio';
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= fullName.length) {
        setTypedName(fullName.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRevealed(true);
      }
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.heroWrapper} id="inicio">
      <div className={styles.filmstripBg} aria-hidden="true">
        {/* Row 1 */}
        <div className={`${styles.filmstripRow} ${styles.moveLeft}`}>
          <div className={styles.filmstripTrack}>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_boda.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_2.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_embarazo.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_familia.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_4.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_marcapersonal.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_cumpleanos.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_6.jpg" alt="" /></div>
          </div>
          <div className={styles.filmstripTrack} aria-hidden="true">
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_boda.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_2.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_embarazo.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_familia.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_4.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_marcapersonal.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_cumpleanos.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_6.jpg" alt="" /></div>
          </div>
        </div>

        {/* Row 2 */}
        <div className={`${styles.filmstripRow} ${styles.moveRight}`}>
          <div className={styles.filmstripTrack}>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_parejas.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_gastronomia.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_1.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_revelaciondegenero.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_navidad.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_3.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_parejasplaya.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_eventos.jpg" alt="" /></div>
          </div>
          <div className={styles.filmstripTrack} aria-hidden="true">
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_parejas.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_gastronomia.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_1.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_revelaciondegenero.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_navidad.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_3.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_parejasplaya.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/cover_eventos.jpg" alt="" /></div>
          </div>
        </div>

        {/* Row 3 */}
        <div className={`${styles.filmstripRow} ${styles.moveLeft} ${styles.moveStagger}`}>
          <div className={styles.filmstripTrack}>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_5.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/work_1.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/work_2.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/work_3.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/follow_1.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/follow_3.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/follow_5.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/hero_nicole.jpg" alt="" /></div>
          </div>
          <div className={styles.filmstripTrack} aria-hidden="true">
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/press_5.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/work_1.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/work_2.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/work_3.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/follow_1.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/follow_3.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/follow_5.jpg" alt="" /></div>
            <div className={styles.filmFrame}><img src="/assets/images/studionvf/hero_nicole.jpg" alt="" /></div>
          </div>
        </div>

        <div className={styles.filmstripOverlay}></div>
      </div>

      <div className={styles.heroTypingContent}>
        <span className={styles.heroEyebrowBadge}>
          <span className={styles.pulseDot}></span> STUDIO NVF &nbsp;&middot;&nbsp; FOTOGRAFÍA EDITORIAL
        </span>
        <h1 className={styles.heroTypingTitle}>
          <span className={styles.typingName}>{typedName}</span>
          <span className={styles.typingCursor}>|</span>
        </h1>
        <p className={`${styles.heroTypingStatement} ${isRevealed ? styles.revealed : ''}`}>
          <em>Historias que trascienden el tiempo</em>
        </p>
        <div className={`${styles.heroTypingActions} ${isRevealed ? styles.revealed : ''}`}>
          <button className={styles.btnDarkMinimal} onClick={onOpenBooking}>RESERVAR SESIÓN</button>
        </div>
      </div>
    </section>
  );
};
