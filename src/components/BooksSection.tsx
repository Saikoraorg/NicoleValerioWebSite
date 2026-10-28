'use client';

import React from 'react';
import styles from './BooksSection.module.css';

export interface BookItem {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  count: number;
  cover: string;
}

export const BOOKS_DATA: BookItem[] = [
  { slug: 'boda', number: 'BOOK 01', title: 'Boda', subtitle: 'Historias Cinematográficas', count: 75, cover: '/assets/images/studionvf/cover_boda.jpg' },
  { slug: 'embarazo', number: 'BOOK 02', title: 'Embarazo', subtitle: 'La Dulce Espera', count: 26, cover: '/assets/images/studionvf/cover_embarazo.jpg' },
  { slug: 'marcapersonal', number: 'BOOK 03', title: 'Marca Personal', subtitle: 'Retrato & Estilo Editorial', count: 70, cover: '/assets/images/studionvf/cover_marcapersonal.jpg' },
  { slug: 'parejas', number: 'BOOK 04', title: 'Parejas', subtitle: 'Complicidad & Amor Real', count: 25, cover: '/assets/images/studionvf/cover_parejas.jpg' },
  { slug: 'parejasplaya', number: 'BOOK 05', title: 'Parejas Playa', subtitle: 'Costa, Viento & Luz Dorada', count: 12, cover: '/assets/images/studionvf/cover_parejasplaya.jpg' },
  { slug: 'familia', number: 'BOOK 06', title: 'Familia', subtitle: 'Momentos Genuinos', count: 49, cover: '/assets/images/studionvf/cover_familia.jpg' },
  { slug: 'revelaciondegenero', number: 'BOOK 07', title: 'Revelación de Género', subtitle: 'Emociones & Sorpresas', count: 43, cover: '/assets/images/studionvf/cover_revelaciondegenero.jpg' },
  { slug: 'cumpleanos', number: 'BOOK 08', title: 'Cumpleaños', subtitle: 'Celebración de la Vida', count: 156, cover: '/assets/images/studionvf/cover_cumpleanos.jpg' },
  { slug: 'gastronomia', number: 'BOOK 09', title: 'Gastronomía', subtitle: 'Sabor, Textura & Alta Cocina', count: 63, cover: '/assets/images/studionvf/cover_gastronomia.jpg' },
  { slug: 'eventos', number: 'BOOK 10', title: 'Eventos', subtitle: 'Galas, Lanzamientos & Fiestas', count: 32, cover: '/assets/images/studionvf/cover_eventos.jpg' },
  { slug: 'navidad', number: 'BOOK 11', title: 'Navidad', subtitle: 'Magia & Calidez Familiar', count: 24, cover: '/assets/images/studionvf/cover_navidad.jpg' },
];

interface BooksSectionProps {
  onSelectBook: (slug: string) => void;
  onRequestTarifas: () => void;
}

export const BooksSection: React.FC<BooksSectionProps> = ({ onSelectBook, onRequestTarifas }) => {
  return (
    <section className={styles.booksCatalogSection} id="books">
      <div className={styles.sectionContainer}>
        {/* Section Header with Italic Elegance */}
        <div className={styles.booksHeader}>
          <span className={styles.booksEyebrow}>CATÁLOGO EDITORIAL STUDIO NVF</span>
          <h2 className={styles.booksTitle}><em>Books</em></h2>
          <p className={styles.booksDescription}>
            Explora cada colección fotográfica en formato libro de arte. Haz clic en cualquier portada para hojear el book completo con todas las fotos en alta resolución.
          </p>
        </div>

        {/* 4-Column Book Jacket Grid */}
        <div className={styles.booksGrid}>
          {BOOKS_DATA.map((book) => (
            <div 
              key={book.slug} 
              className={styles.bookCard}
              onClick={() => onSelectBook(book.slug)}
            >
              <div className={styles.bookJacket}>
                <div className={styles.bookSpine}></div>
                <img src={book.cover} alt={`Book ${book.title}`} loading="lazy" />
                <div className={styles.bookOverlayTag}>
                  <span className={styles.bookNumber}>{book.number}</span>
                  <span className={styles.bookCount}>{book.count} FOTOS</span>
                </div>
                <div className={styles.bookHoverAction}>
                  <span>ABRIR BOOK &rarr;</span>
                </div>
              </div>
              <div className={styles.bookMeta}>
                <h3 className={styles.bookName}><em>{book.title}</em></h3>
                <span className={styles.bookSubtitle}>{book.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Book Action Button at Bottom */}
        <div className={styles.booksFooterAction}>
          <button className={styles.btnBoxMinimal} onClick={onRequestTarifas}>
            SOLICITAR CATÁLOGO DE TARIFAS & FECHAS 2026
          </button>
        </div>
      </div>
    </section>
  );
};
