'use client';

import React from 'react';
import { Instagram } from 'lucide-react';
import styles from './FollowSection.module.css';

const INSTAGRAM_URL = 'https://www.instagram.com/nicolevaleriofotografia?xtok=aDByb3Nuazg5aTFv';

const FOLLOW_PHOTOS = [
  '/assets/images/studionvf/follow_1.jpg',
  '/assets/images/studionvf/follow_2.jpg',
  '/assets/images/studionvf/follow_3.jpg',
  '/assets/images/studionvf/follow_4.jpg',
  '/assets/images/studionvf/follow_5.jpg',
  '/assets/images/studionvf/follow_6.jpg',
];

export const FollowSection: React.FC = () => {
  return (
    <section className={styles.followSection} id="social-grid">
      <div className={styles.sectionContainer}>
        <div className={styles.followHeaderRow}>
          <div className={styles.followTitleGroup}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.followIgBadge}>
              <Instagram size={18} />
              <span>@nicolevaleriofotografia</span>
            </a>
            <h2 className={styles.followTitle}>Síguenos en <em>Instagram</em></h2>
          </div>
          <div className={styles.followDividerLine}></div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.followProfileBtn}>
            <span>SEGUIR EN INSTAGRAM &rarr;</span>
          </a>
        </div>

        <div className={styles.followPhotosRow}>
          {FOLLOW_PHOTOS.map((src, i) => (
            <div key={i} className={styles.followPhotoItem}>
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.followPhotoLink}
                aria-label="Ver foto en Instagram de Nicole Valerio"
              >
                <img src={src} alt={`Nicole Valerio Instagram ${i + 1}`} loading="lazy" />
                <div className={styles.followHoverOverlay}>
                  <div className={styles.followHoverBadge}>
                    <Instagram size={24} />
                    <span className={styles.followHandle}>@nicolevaleriofotografia</span>
                    <span className={styles.followCtaText}>VER EN INSTAGRAM &rarr;</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
