'use client';

import React from 'react';
import styles from './WorkSection.module.css';

interface WorkSectionProps {
  onOpenBook: (slug: string) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onOpenBook }) => {
  return (
    <section className={styles.workSection} id="work">
      <div className={styles.sectionContainer}>
        <div className={styles.editorialSectionHeader}>
          <div className={styles.watermarkTitle} aria-hidden="true">WORK</div>
          <h2 className={styles.editorialMainTitle}><em>Work</em> Editoriales</h2>
        </div>

        <div className={styles.workGrid}>
          {/* Work Card 1: Marca Personal */}
          <article className={styles.workCard} onClick={() => onOpenBook('marcapersonal')}>
            <div className={styles.workImageWrap}>
              <img src="/assets/images/studionvf/work_1.jpg" alt="Marca Personal Editorial" loading="lazy" />
              <div className={styles.workOverlay}>
                <span className={styles.workTag}>EDITORIAL / RETRATOS</span>
                <h3 className={styles.workCardTitle}><em>Marca Personal</em></h3>
                <button className={styles.workQuickBtn}>ABRIR BOOK &rarr;</button>
              </div>
            </div>
          </article>

          {/* Work Card 2: Boda Editorial */}
          <article className={styles.workCard} onClick={() => onOpenBook('boda')}>
            <div className={styles.workImageWrap}>
              <img src="/assets/images/studionvf/work_2.jpg" alt="Boda de Autor" loading="lazy" />
              <div className={styles.workBadgeCenter}>
                <span>HARPER&apos;S BAZAAR · VOGUE</span>
              </div>
              <div className={styles.workOverlay}>
                <span className={styles.workTag}>WEDDING STORIES</span>
                <h3 className={styles.workCardTitle}><em>Boda de Autor</em></h3>
                <button className={styles.workQuickBtn}>ABRIR BOOK &rarr;</button>
              </div>
            </div>
          </article>

          {/* Work Card 3: Parejas Playa */}
          <article className={styles.workCard} onClick={() => onOpenBook('parejasplaya')}>
            <div className={styles.workImageWrap}>
              <img src="/assets/images/studionvf/work_3.jpg" alt="Parejas Costa & Sol" loading="lazy" />
              <div className={styles.workOverlay}>
                <span className={styles.workTag}>LIFESTYLE & NATURE</span>
                <h3 className={styles.workCardTitle}><em>Parejas Playa</em></h3>
                <button className={styles.workQuickBtn}>ABRIR BOOK &rarr;</button>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
};
