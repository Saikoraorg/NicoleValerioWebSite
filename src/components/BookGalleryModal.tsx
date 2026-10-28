'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BookGalleryModal.module.css';

export interface BookGalleryData {
  slug: string;
  title: string;
  photoCount: number;
  cover: string;
  photos: {
    name?: string;
    large: string;
    thumb?: string;
  }[];
}

interface BookGalleryModalProps {
  bookSlug: string | null;
  onClose: () => void;
  onInquire: (bookTitle: string) => void;
}

export const BookGalleryModal: React.FC<BookGalleryModalProps> = ({
  bookSlug,
  onClose,
  onInquire
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [bookData, setBookData] = useState<BookGalleryData | null>(null);

  useEffect(() => {
    if (!bookSlug) {
      setBookData(null);
      return;
    }

    setPhotoIndex(0);
    // Fetch or import catalog
    fetch('/studionvf_all_photos.json')
      .then(res => res.json())
      .then(data => {
        if (data[bookSlug]) {
          const col = data[bookSlug];
          setBookData({
            slug: bookSlug,
            title: col.title.replace('\\x20', ' ').replace('\\u00F1', 'ñ'),
            photoCount: col.photoCount,
            cover: `/assets/images/studionvf/cover_${bookSlug}.jpg`,
            photos: col.photos.map((p: any) => ({
              name: p.name,
              large: p.large,
              thumb: p.thumb || p.large
            }))
          });
        }
      })
      .catch(() => {
        // Fallback with cover
        setBookData({
          slug: bookSlug,
          title: bookSlug.toUpperCase(),
          photoCount: 1,
          cover: `/assets/images/studionvf/cover_${bookSlug}.jpg`,
          photos: [{ large: `/assets/images/studionvf/cover_${bookSlug}.jpg` }]
        });
      });
  }, [bookSlug]);

  useEffect(() => {
    if (!bookSlug) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && bookData && bookData.photos.length > 0) {
        setPhotoIndex(i => (i + 1) % bookData.photos.length);
      }
      if (e.key === 'ArrowLeft' && bookData && bookData.photos.length > 0) {
        setPhotoIndex(i => (i - 1 + bookData.photos.length) % bookData.photos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookSlug, bookData, onClose]);

  if (!bookSlug || !bookData) return null;

  const currentPhoto = bookData.photos[photoIndex] || { large: bookData.cover };

  const handleNext = () => {
    if (bookData.photos.length > 0) {
      setPhotoIndex((photoIndex + 1) % bookData.photos.length);
    }
  };

  const handlePrev = () => {
    if (bookData.photos.length > 0) {
      setPhotoIndex((photoIndex - 1 + bookData.photos.length) % bookData.photos.length);
    }
  };

  return (
    <div className={styles.lightboxModal} role="dialog" aria-label="Visor de fotografía y Books">
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
            <img src={currentPhoto.large} alt={currentPhoto.name || bookData.title} />
          </div>

          <div className={styles.meta}>
            <span className={styles.metaTag}>STUDIO NVF · {bookData.title.toUpperCase()}</span>
            <h3 className={styles.metaTitle}><em>Book {bookData.title}</em></h3>
            <p className={styles.metaDesc}>
              Colección fotográfica de autor con {bookData.photoCount} imágenes en alta resolución.
            </p>

            <div className={styles.filmstripWrap}>
              <span className={styles.filmstripLabel}>
                FOTO {photoIndex + 1} DE {bookData.photos.length}
              </span>
              <div className={styles.filmstrip}>
                {bookData.photos.slice(0, 24).map((p, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.filmstripThumb} ${idx === photoIndex ? styles.active : ''}`}
                    onClick={() => setPhotoIndex(idx)}
                  >
                    <img src={p.thumb || p.large} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={styles.inquireBtn}
              onClick={() => onInquire(bookData.title)}
            >
              QUIERO UNA SESIÓN COMO ESTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
