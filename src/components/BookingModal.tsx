'use client';

import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  isOpen: boolean;
  preselectedService?: string;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  preselectedService,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: 'Embarazo',
    date: '',
    location: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, sessionType: preselectedService }));
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          sessionType: 'Embarazo',
          date: '',
          location: '',
          message: '',
        });
      }, 3000);
    }, 1200);
  };

  return (
    <div className={styles.modal} role="dialog" aria-label="Reservar sesión">
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.card}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar modal">
          <X size={20} />
        </button>

        <div className={styles.header}>
          <span className={styles.sub}>RESERVA TU FECHA</span>
          <h3 className={`${styles.title} font-serif`}>Agenda tu sesión fotográfica</h3>
          <p className={styles.intro}>
            Elige el tipo de sesión y cuéntame tus ideas. Te responderé en menos de 24 horas.
          </p>
        </div>

        {isSuccess ? (
          <div className={styles.successBox}>
            <h4>¡Solicitud enviada con éxito!</h4>
            <p>Gracias por contactarme. Revisaré la disponibilidad de la fecha y te responderé en breve por WhatsApp o correo.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.group}>
                <label>Nombre completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ana García"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.group}>
                <label>Correo electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="ana@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.group}>
                <label>Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+52 55 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className={styles.group}>
                <label>Tipo de sesión *</label>
                <select
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                >
                  <option value="Embarazo">Embarazo & Maternidad</option>
                  <option value="Familiares">Familiares & Parejas</option>
                  <option value="Cumpleaños">Cumpleaños & Festejos</option>
                  <option value="Bodas">Bodas & Elopements</option>
                  <option value="Gastronómica">Gastronómica & Comercial</option>
                  <option value="Eventos">Eventos Especiales</option>
                  <option value="Personalizado">Otro proyecto personalizado</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.group}>
                <label>Fecha tentativa deseada</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className={styles.group}>
                <label>Ciudad / Ubicación deseada</label>
                <input
                  type="text"
                  placeholder="Ej. Estudio, exterior o a domicilio"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.group}>
              <label>Cuéntame sobre tu proyecto o visión</label>
              <textarea
                rows={3}
                placeholder="¿Cuántas personas son? ¿Tienes alguna idea o inspiración en mente?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Enviando solicitud...' : 'Enviar solicitud de reserva'}</span>
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
