-- ==============================================================================
-- STUDIO NVF - NICOLE VALERIO FOTOGRAFÍA EDITORIAL
-- Arquitectura de Base de Datos para Supabase (PostgreSQL + RLS + Storage)
-- ==============================================================================
-- Instrucciones de montaje:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard/project/_/sql
-- 2. Abre el SQL Editor, pega todo este script y haz clic en "Run" (Ejecutar).
-- 3. Crea los dos Storage Buckets públicos en Storage > New Bucket:
--    - "covers" (Público)
--    - "photos" (Público)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. FUNCIÓN DE TRIGGER PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLA 1: books (Catálogo de Colecciones / Libros de Arte)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                          -- ej: 'familia', 'boda', 'embarazo'
    badge_number TEXT NOT NULL,                         -- ej: '01', '02', '03'
    title TEXT NOT NULL,                                -- ej: 'Familia', 'Boda de Autor'
    subtitle TEXT,                                      -- ej: 'Momentos Genuinos'
    category TEXT DEFAULT 'EDITORIAL',                  -- ej: 'EDITORIAL', 'RETRATO'
    description TEXT,                                   -- Descripción del book
    cover_url TEXT NOT NULL,                            -- URL local o de Supabase Storage
    photo_count INTEGER DEFAULT 0,                      -- Total de fotos sincronizado
    sort_order INTEGER DEFAULT 0,                       -- Orden de aparición en el mosaico
    is_published BOOLEAN DEFAULT true,                  -- Si está visible en la web
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLA 2: photos (Galería de Fotografías de Alta Resolución)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                                 -- ej: 'DSC_0548.jpg'
    caption TEXT,                                       -- Título o pie de foto
    url_large TEXT NOT NULL,                            -- Foto principal en alta resolución
    url_xlarge TEXT,                                    -- Versión 4K / extra grande
    url_thumb TEXT,                                     -- Miniatura para tira de negativos
    width INTEGER,                                      -- Ancho en píxeles (ej: 2400)
    height INTEGER,                                     -- Alto en píxeles (ej: 3600)
    is_cover BOOLEAN DEFAULT false,                     -- Si es la portada actual del libro
    sort_order INTEGER DEFAULT 0,                       -- Orden dentro de la galería
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_book_id ON public.photos(book_id);
CREATE INDEX IF NOT EXISTS idx_photos_is_cover ON public.photos(is_cover);

-- Trigger para mantener actualizado automáticamente photo_count en books
CREATE OR REPLACE FUNCTION sync_book_photo_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.books
        SET photo_count = photo_count + 1
        WHERE id = NEW.book_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.books
        SET photo_count = GREATEST(photo_count - 1, 0)
        WHERE id = OLD.book_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_book_photo_count
AFTER INSERT OR DELETE ON public.photos
FOR EACH ROW EXECUTE FUNCTION sync_book_photo_count();

-- ==============================================================================
-- TABLA 3: bookings (Reservas y Citas del Calendario)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio TEXT UNIQUE NOT NULL,                         -- Folio de control, ej: 'NVF-2026-0842'
    client_name TEXT NOT NULL,                          -- Nombre completo del cliente
    client_email TEXT NOT NULL,                         -- Correo electrónico del cliente
    client_phone TEXT NOT NULL,                         -- Teléfono o WhatsApp
    session_type TEXT NOT NULL,                         -- 'Familia', 'Boda', 'Embarazo', etc.
    booking_date DATE NOT NULL,                         -- Fecha de la cita (AAAA-MM-DD)
    booking_time TIME NOT NULL DEFAULT '10:30:00',      -- Hora de la cita (HH:MM)
    estimated_duration_hours NUMERIC(3,1) DEFAULT 1.5,  -- Duración en horas
    location TEXT,                                      -- Estudio, exteriores, domicilio
    message TEXT,                                       -- Visión o detalles del cliente
    status TEXT DEFAULT 'Pendiente' CHECK (
        status IN ('Pendiente', 'Confirmada', 'Completada', 'Cancelada')
    ),
    internal_notes TEXT,                                -- Notas privadas para Nicole
    -- Campos de Comprobante PDF y Notificación por Correo
    pdf_url TEXT,                                       -- Enlace al PDF guardado en Storage
    pdf_generated BOOLEAN DEFAULT true,                 -- Bandera de PDF emitido
    admin_email_recipient TEXT DEFAULT 'santi2345ma@gmail.com', -- Correo receptor de Nicole
    notification_sent_to_admin BOOLEAN DEFAULT false,   -- Estado de envío a Nicole
    notification_sent_to_client BOOLEAN DEFAULT false,  -- Estado de envío al cliente
    email_sent_at TIMESTAMPTZ,                          -- Timestamp de envío del correo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_folio ON public.bookings(folio);

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLA 4: app_settings (Configuración Dinámica y Notificaciones)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLA 5: reviews (Reseñas y Calificaciones con Estrellas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,                          -- Nombre del autor
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    session_type TEXT,                                  -- Sesión realizada
    review_text TEXT NOT NULL,                          -- Comentario o testimonio
    is_approved BOOLEAN DEFAULT true,                   -- Moderación de comentarios
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 6: site_assets (Imágenes Globales: Hero, Work, Press, Instagram)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,                              -- 'hero', 'work', 'press', 'social'
    key_name TEXT NOT NULL,                             -- ej: 'hero_main', 'work_1', 'press_1'
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    external_link TEXT,
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Configuración: Lectura pública de ajustes no sensibles, modificación sólo admin
CREATE POLICY "Public can view app settings"
ON public.app_settings FOR SELECT
USING (true);

CREATE POLICY "Admin can manage app settings"
ON public.app_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 1. Libros y Fotos: Lectura pública, modificación sólo admin autenticado
CREATE POLICY "Public can view published books"
ON public.books FOR SELECT
USING (is_published = true);

CREATE POLICY "Admin can manage all books"
ON public.books FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view photos"
ON public.photos FOR SELECT
USING (true);

CREATE POLICY "Admin can manage all photos"
ON public.photos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Reservas: Cualquier visitante puede insertar, sólo admin puede leer/modificar
CREATE POLICY "Public can insert bookings"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin can manage all bookings"
ON public.bookings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Reseñas: Público puede insertar y leer aprobadas, admin gestiona todo
CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = true);

CREATE POLICY "Public can insert reviews"
ON public.reviews FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin can manage reviews"
ON public.reviews FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Assets generales: Público puede ver, admin gestiona todo
CREATE POLICY "Public can view site assets"
ON public.site_assets FOR SELECT
USING (true);

CREATE POLICY "Admin can manage site assets"
ON public.site_assets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- CONFIGURACIÓN DE STORAGE BUCKETS EN SUPABASE
-- ==============================================================================
-- Inserción de buckets públicos:
-- 1. 'covers'           -> Portadas de los 11 Books
-- 2. 'photos'           -> Fotos individuales de galerías
-- 3. 'booking-vouchers' -> Comprobantes en PDF generados para clientes y Nicole
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('covers', 'covers', true), 
    ('photos', 'photos', true),
    ('booking-vouchers', 'booking-vouchers', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage: Lectura pública, subida y eliminación para autenticados
CREATE POLICY "Public can view covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Authenticated users can update/delete covers"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'covers');

CREATE POLICY "Public can view photos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Authenticated users can update/delete photos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'photos');

-- Vouchers PDF: Lectura pública de comprobantes, subida por anon/auth al reservar
CREATE POLICY "Public can view booking vouchers"
ON storage.objects FOR SELECT
USING (bucket_id = 'booking-vouchers');

CREATE POLICY "Anyone can upload booking voucher on reservation"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'booking-vouchers');

-- ==============================================================================
-- DATOS INICIALES (SEED DATA: AJUSTES & LOS 11 BOOKS DE STUDIO NVF)
-- ==============================================================================
-- 1. Configuración de Correo para Alertas de Reserva y PDF
INSERT INTO public.app_settings (key, value, description)
VALUES 
    ('admin_notification_email', '"santi2345ma@gmail.com"', 'Correo de Nicole para recibir alertas de reservas y comprobantes PDF'),
    ('email_notifications_enabled', 'true', 'Activar o desactivar notificaciones automáticas por correo'),
    ('studio_phone', '"+506 8888 8888"', 'WhatsApp y teléfono oficial del estudio'),
    ('studio_address', '"Studio NVF, San José, Costa Rica"', 'Dirección o base principal del estudio')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description;

-- 2. Catálogo de Books
INSERT INTO public.books (slug, badge_number, title, subtitle, category, cover_url, photo_count, sort_order)
VALUES
('familia', '01', 'Familia', 'Momentos Genuinos', 'EDITORIAL', 'assets/images/studionvf/cover_familia.jpg', 49, 1),
('navidad', '02', 'Navidad', 'Magia & Calidez Familiar', 'EDITORIAL', 'assets/images/studionvf/cover_navidad.jpg', 24, 2),
('marcapersonal', '03', 'Marca Personal', 'Retrato & Estilo Editorial', 'EDITORIAL', 'assets/images/studionvf/cover_marcapersonal.jpg', 70, 3),
('cumpleanos', '04', 'Cumpleaños', 'Celebración de la Vida', 'EDITORIAL', 'assets/images/studionvf/cover_cumpleanos.jpg', 156, 4),
('revelaciondegenero', '05', 'Revelación de Género', 'Emociones & Sorpresas', 'EDITORIAL', 'assets/images/studionvf/cover_revelaciondegenero.jpg', 43, 5),
('parejasplaya', '06', 'Parejas Playa', 'Costa, Viento & Luz Dorada', 'EDITORIAL', 'assets/images/studionvf/cover_parejasplaya.jpg', 12, 6),
('boda', '07', 'Boda de Autor', 'Historias Cinematográficas', 'EDITORIAL', 'assets/images/studionvf/cover_boda.jpg', 75, 7),
('embarazo', '08', 'Embarazo', 'La Dulce Espera & Maternidad', 'EDITORIAL', 'assets/images/studionvf/cover_embarazo.jpg', 26, 8),
('eventos', '09', 'Eventos', 'Galas, Lanzamientos & Fiestas', 'EDITORIAL', 'assets/images/studionvf/cover_eventos.jpg', 32, 9),
('gastronomia', '10', 'Gastronomía', 'Sabor, Textura & Alta Cocina', 'EDITORIAL', 'assets/images/studionvf/cover_gastronomia.jpg', 63, 10),
('parejas', '11', 'Parejas', 'Complicidad & Amor Real', 'EDITORIAL', 'assets/images/studionvf/cover_parejas.jpg', 25, 11)
ON CONFLICT (slug) DO UPDATE SET
badge_number = EXCLUDED.badge_number,
title = EXCLUDED.title,
cover_url = EXCLUDED.cover_url;

