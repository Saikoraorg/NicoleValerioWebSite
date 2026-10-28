'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye, ArrowUpRight } from 'lucide-react';
import styles from './PortfolioCarousel.module.css';

export interface PhotoItem {
  id: number;
  category: string;
  title: string;
  desc: string;
  camera: string;
  lens: string;
  iso: string;
  src: string;
}

export const PHOTO_ITEMS: PhotoItem[] = [
  {
    id: 1,
    category: 'retratos',
    title: 'Luz Dorada',
    desc: 'Sesión individual al atardecer en luz natural. Enfoque suave resaltando la mirada y expresiones sinceras.',
    camera: 'Sony A7IV',
    lens: '85mm f/1.4 GM',
    iso: 'ISO 100',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 2,
    category: 'parejas',
    title: 'Conexión en la Cumbre',
    desc: 'Escapada a las colinas doradas al amanecer. Una atmósfera íntima y cinemática en plena naturaleza.',
    camera: 'Canon R5',
    lens: '50mm f/1.2 L',
    iso: 'ISO 200',
    src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 3,
    category: 'familia',
    title: 'Primeros Pasos',
    desc: 'Momentos espontáneos entre madre e hijo sin poses forzadas, capturando la ternura del vínculo materno.',
    camera: 'Sony A7IV',
    lens: '35mm f/1.4 GM',
    iso: 'ISO 400',
    src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 4,
    category: 'marca',
    title: 'Esencia Botánica',
    desc: 'Fotografía comercial para marca de perfumería artesanal. Composición minimalista con elementos orgánicos.',
    camera: 'Sony A7R V',
    lens: '90mm f/2.8 Macro',
    iso: 'ISO 64',
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 5,
    category: 'bodas',
    title: 'Promesa Eterna',
    desc: 'Detalle de la novia en exteriores con ramo silvestre. Iluminación lateral en tonalidades cálidas.',
    camera: 'Canon R6 II',
    lens: '50mm f/1.4',
    iso: 'ISO 160',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 6,
    category: 'retratos',
    title: 'Mirada Franca',
    desc: 'Retrato de marca profesional con luz lateral en estudio. Carácter, sobriedad y calidez visual.',
    camera: 'Sony A7IV',
    lens: '85mm f/1.8',
    iso: 'ISO 100',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 7,
    category: 'bodas',
    title: 'El Primer Beso',
    desc: 'La emoción pura después de pronunciar los votos en una ceremonia íntima en jardín.',
    camera: 'Canon R5',
    lens: '24-70mm f/2.8',
    iso: 'ISO 320',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 8,
    category: 'eventos',
    title: 'Luces de Velada',
    desc: 'Montaje de banquete nocturno con luces de hadas e iluminación cálida para cena de gala.',
    camera: 'Sony A7S III',
    lens: '24mm f/1.4 GM',
    iso: 'ISO 800',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=85',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'TODO EL PORTAFOLIO' },
  { id: 'retratos', label: 'RETRATOS' },
  { id: 'parejas', label: 'PAREJAS' },
  { id: 'familia', label: 'FAMILIA' },
  { id: 'bodas', label: 'BODAS' },
  { id: 'marca', label: 'MARCA PERSONAL' },
  { id: 'eventos', label: 'EVENTOS' },
];

interface CarouselProps {
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const PortfolioCarousel: React.FC<CarouselProps> = ({ onSelectPhoto }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [offset, setOffset] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredPhotos = selectedCategory === 'all'
    ? PHOTO_ITEMS
    : PHOTO_ITEMS.filter((p) => p.category === selectedCategory);

  const maxOffset = trackRef.current && viewportRef.current
    ? Math.max(0, trackRef.current.scrollWidth - viewportRef.current.offsetWidth)
    : 0;

  const handleScroll = (dir: 'prev' | 'next') => {
    const cardStep = 280; // card width + gap
    if (dir === 'next') {
      setOffset((prev) => Math.min(maxOffset, prev + cardStep));
    } else {
      setOffset((prev) => Math.max(0, prev - cardStep));
    }
  };

  const progressPercent = maxOffset === 0 ? 100 : Math.min(100, Math.max(15, (offset / maxOffset) * 100));

  return (
    <section className={styles.portfolioSection} id="portafolio">
      <div className="section-container">
        {/* Section Header (GAZU "BEST OF" Editorial Style) */}
        <div className={styles.headerRow}>
          <div>
            <span className={styles.editorialEyebrow}>SELECCIÓN EDITORIAL 2026</span>
            <h2 className={styles.editorialTitle}>BEST OF STUDIO</h2>
          </div>

          <div className={styles.navControls}>
            <button
              className={styles.carouselBtn}
              onClick={() => handleScroll('prev')}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={styles.carouselBtn}
              onClick={() => handleScroll('next')}
              aria-label="Siguiente foto"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Minimalist Editorial Category Filter Bar */}
        <div className={styles.filterBar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.filterPill} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOffset(0);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* THE ENHANCED EDITORIAL CAROUSEL TRACK */}
        <div className={styles.carouselViewport} ref={viewportRef}>
          <div
            className={styles.carouselTrack}
            ref={trackRef}
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {filteredPhotos.map((photo, idx) => {
              const isFav = favorites.includes(photo.id);
              const numStr = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={photo.id}
                  className={styles.editorialCard}
                  onClick={() => onSelectPhoto(photo)}
                >
                  {/* Photo Container */}
                  <div className={styles.imageBox}>
                    <img src={photo.src} alt={photo.title} loading="lazy" />

                    {/* Minimal Floating Heart / Favorite Icon (GAZU signature) */}
                    <button
                      className={`${styles.heartBtn} ${isFav ? styles.heartActive : ''}`}
                      onClick={(e) => toggleFavorite(e, photo.id)}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      aria-label="Favorito"
                    >
                      <Heart size={16} fill={isFav ? '#e11d48' : 'none'} stroke={isFav ? '#e11d48' : '#111111'} />
                    </button>

                    {/* Corner Tag: Number & Category */}
                    <div className={styles.cardCornerTag}>
                      <span>{numStr} / {photo.category.toUpperCase()}</span>
                    </div>

                    {/* Quick Lightbox View Overlay Action */}
                    <div className={styles.hoverActionOverlay}>
                      <span className={styles.quickViewText}>
                        <Eye size={14} />
                        <span>AMPLIAR EN 4K</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Metadata Underneath (Editorial Fashion Structure) */}
                  <div className={styles.cardDetails}>
                    <div className={styles.detailsMetaRow}>
                      <span className={styles.cardCategory}>{photo.category}</span>
                      <span className={styles.cardGear}>{photo.lens}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{photo.title}</h3>
                    <div className={styles.cardLinkRow}>
                      <span className={styles.cardLink}>Ver detalles de captura</span>
                      <ArrowUpRight size={14} className={styles.cardLinkIcon} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className={styles.footerBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={styles.counter}>
            <span>MOSTRANDO {filteredPhotos.length} FOTOGRAFÍAS</span>
          </div>
          <div className={styles.hint}>
            <span>&larr; Desliza o usa las flechas para explorar &rarr;</span>
          </div>
        </div>
      </div>
    </section>
  );
};
