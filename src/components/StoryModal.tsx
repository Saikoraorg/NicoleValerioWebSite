'use client';

import React from 'react';
import { X } from 'lucide-react';
import styles from './StoryModal.module.css';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose, onInquire }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal} role="dialog" aria-label="Detalle de historia">
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.box}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar modal">
          <X size={20} />
        </button>

        <div className={styles.imageWrap}>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            alt="Historia completa"
          />
        </div>

        <div className={styles.textWrap}>
          <span className="section-tag">HISTORIA COMPLETA</span>
          <h3 className={`${styles.title} font-serif`}>La tarde dorada en el mirador</h3>
          <p>
            Esta sesión nació de una llamada espontánea de Sofía y Mateo. Querían celebrar su quinto aniversario en el mismo lugar donde se comprometieron, pero sin las poses tradicionales ni luces artificiales invasivas.
          </p>
          <p>
            Subimos al mirador justo una hora antes del ocaso. La brisa templada y la luz rasante crearon un ambiente donde solo existían ellos dos y el viento. Mi trabajo fue simplemente ser un testigo invisible, captando miradas sinceras y risas genuinas.
          </p>
          <blockquote className={styles.quote}>
            "El secreto de una gran fotografía no está en forzar una sonrisa, sino en dar el espacio para que la emoción surja sola."
          </blockquote>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onInquire();
            }}
          >
            Reservar una sesión como esta
          </button>
        </div>
      </div>
    </div>
  );
};
