'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { PhotoItem, PHOTO_ITEMS } from './PortfolioCarousel';
import styles from './LightboxModal.module.css';

interface LightboxModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onNavigate: (photo: PhotoItem) => void;
  onInquire: (category: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  onClose,
  onNavigate,
  onInquire,
}) => {
  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        const nextIdx = (PHOTO_ITEMS.findIndex((p) => p.id === photo.id) + 1) % PHOTO_ITEMS.length;
        onNavigate(PHOTO_ITEMS[nextIdx]);
      }
      if (e.key === 'ArrowLeft') {
        const prevIdx = (PHOTO_ITEMS.findIndex((p) => p.id === photo.id) - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length;
        onNavigate(PHOTO_ITEMS[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onNavigate]);

  if (!photo) return null;

  const handleNext = () => {
    const nextIdx = (PHOTO_ITEMS.findIndex((p) => p.id === photo.id) + 1) % PHOTO_ITEMS.length;
    onNavigate(PHOTO_ITEMS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (PHOTO_ITEMS.findIndex((p) => p.id === photo.id) - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length;
    onNavigate(PHOTO_ITEMS[prevIdx]);
  };

  return (
    <div className={styles.lightboxModal} role="dialog" aria-label="Visor de fotografía">
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.container}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar visor">
          <X size={24} />
        </button>

        <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev} aria-label="Foto anterior">
          <ChevronLeft size={28} />
        </button>
        <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext} aria-label="Foto siguiente">
          <ChevronRight size={28} />
        </button>

        <div className={styles.body}>
          <div className={styles.imageBox}>
            <img src={photo.src} alt={photo.title} />
          </div>
          <div className={styles.meta}>
            <div className={styles.category}>{photo.category.toUpperCase()}</div>
            <h3 className={`${styles.title} font-serif`}>{photo.title}</h3>
            <p className={styles.desc}>{photo.desc}</p>
            <div className={styles.specs}>
              <span>📷 {photo.camera}</span>
              <span>🎯 {photo.lens}</span>
              <span>⚡ {photo.iso}</span>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => {
                onClose();
                onInquire(photo.category);
              }}
            >
              Quiero una sesión como esta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
