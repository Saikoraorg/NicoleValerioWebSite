# 📸 Nicole Valerio | Fotografía Profesional & Digital Studio
## Documento Handoff de Funcionalidad, Arquitectura y Guía de Personalización

¡Bienvenido/a a tu nueva plataforma web! Este sitio ha sido diseñado y desarrollado especialmente para combinar la **sensibilidad artística de un estudio fotográfico de alta gama** con la **precisión, velocidad e innovación de un perfil Desarrollador Full Stack**.

El diseño está inspirado en la estética editorial de lujo de la referencia proporcionada (tonalidades cálidas, tipografía *Cormorant Garamond*, composición equilibrada y limpia), potenciado con micro-interacciones, efectos cinemáticos, un carrusel dinámico para fotos pequeñas, un visor Lightbox de alta resolución y un cotizador interactivo.

---

## 🗂️ Estructura del Proyecto

```text
Pagina para Fotos/
│
├── index.html              # Estructura semántica, accesibilidad y metadatos SEO
├── HANDOFF.md              # Este manual exhaustivo de operación y personalización
├── README.md               # Resumen rápido de inicio y despliegue
│
├── css/
│   └── styles.css          # Sistema de diseño de lujo editorial, variables y animaciones
│
├── js/
│   └── main.js             # Motor de interactividad: fondo animado, carrusel, lightbox y modales
│
└── assets/
    └── images/             # Carpeta local para tus fotografías en alta resolución
```

---

## 🚀 Desglose de Funcionalidades por Sección

### 1. Hero Cinemático con Fondo Animado y Foto Principal
- **Concepto:** Una foto principal del fotógrafo/a en primer plano con tarjetas flotantes *glassmorphism* (sesiones capturadas, calificación 5.0, galerías 4K) y de fondo una secuencia animada de fotografías que pasan suavemente con efecto *Ken Burns* y transiciones cruzadas.
- **Cómo funciona técnicamente:**
  - En [index.html](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/index.html), el contenedor `#heroBgStream` contiene elementos `.bg-slide`.
  - En [main.js](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/js/main.js), la función `startHeroSlideTimer()` alterna automáticamente la clase `.active` cada 5 segundos y sincroniza los puntos de control (`bg-dots`).
- **Cómo cambiar tu foto principal:**
  - Busca en [index.html](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/index.html) la etiqueta `<img>` con `id="heroPhotographerImg"`.
  - Reemplaza el atributo `src` con la ruta de tu foto:
    ```html
    <img src="assets/images/mi-foto.jpg" alt="Tu Nombre - Fotógrafo" class="photographer-photo" id="heroPhotographerImg">
    ```
- **Cómo cambiar las fotos del fondo animado:**
  - En [index.html](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/index.html), dentro de `#heroBgStream`:
    ```html
    <div class="bg-slide active" style="background-image: url('assets/images/fondo-1.jpg');"></div>
    <div class="bg-slide" style="background-image: url('assets/images/fondo-2.jpg');"></div>
    <div class="bg-slide" style="background-image: url('assets/images/fondo-3.jpg');"></div>
    ```

---

### 2. Carrusel Interactivo de Fotos Pequeñas (Portafolio)
- **Concepto:** Fiel a tu solicitud, adaptamos la fila de fotos pequeñas del diseño en un **carrusel interactivo y fluido**. Muestra 5 fotos en pantalla simultáneamente (como en la maqueta) con controles de flechas, deslizamiento táctil y barra de progreso.
- **Características integradas:**
  - **Filtros por categoría:** *Todo*, *Retratos*, *Parejas*, *Familia*, *Bodas*, *Marca personal*, *Eventos*. Al hacer clic en un filtro, solo se muestran las fotos pertenecientes a esa categoría sin recargar la página.
  - **Arrastre y Swipe:** Compatible tanto con arrastre de ratón (*mouse drag*) como con gestos táctiles en teléfonos móviles (*touch swipe*).
  - **Barra de Progreso y Contador:** Muestra la posición actual (ej. `1 / 8`) y una barra dorada que se llena progresivamente según el avance.
  - **Hover con Overlay Elegante:** Al pasar el cursor sobre cualquier foto pequeña, se despliega una capa oscura con el título, categoría y un botón de lupa para ver en grande.
- **Cómo agregar o editar fotos en el carrusel:**
  1. En [index.html](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/index.html) dentro de `#carouselTrack`:
     ```html
     <div class="carousel-card" data-category="bodas" data-id="9">
       <div class="card-image-box">
         <img src="assets/images/tu-foto.jpg" alt="Título" loading="lazy">
         <div class="card-overlay">
           <span class="card-category">Bodas</span>
           <h3 class="card-caption">Nombre de la Foto</h3>
           <button class="card-zoom-btn">...</button>
         </div>
       </div>
     </div>
     ```
  2. En [main.js](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/js/main.js), agrega los detalles de esa foto al arreglo `photoCollection`:
     ```javascript
     {
       id: 9,
       category: 'bodas',
       title: 'Nombre de la Foto',
       desc: 'Descripción emotiva de la toma.',
       camera: 'Sony A7IV',
       lens: '35mm f/1.4',
       iso: 'ISO 200',
       src: 'assets/images/tu-foto.jpg'
     }
     ```

---

### 3. Visor Lightbox de Alta Definición
- **Cómo funciona:** Al hacer clic en cualquier tarjeta del carrusel o en el botón de lupa, se abre una ventana modal cinematográfica a pantalla completa.
- **Detalles técnicos visibles:**
  - Fotografía en alta resolución.
  - Título y categoría.
  - Ficha técnica de disparo (Cámara, Lente, Apertura e ISO) para denotar profesionalismo.
  - Botón directo *"Quiero una sesión como esta"*, que abre automáticamente el formulario de reserva con la categoría preseleccionada.
  - Navegación con teclado: Puedes navegar entre fotos con las teclas `←` y `→`, y cerrar con `Escape`.

---

### 4. Sección Dual: "Sobre mí" + "Más que una fotografía"
- **Sobre mí:** Tarjeta biográfica con avatar circular, badge de disponibilidad activa ("En línea / Agenda abierta") y mención especial del enfoque híbrido (**Fotógrafo + Desarrollador Full Stack**).
- **Más que una fotografía:** Tarjeta destacada tipo editorial con fotografía en gran formato y botón *"Leer historia completa"*, el cual abre un modal con el relato detrás de la sesión fotográfica.

---

### 5. Servicios & "Elige tu sesión" (6 Tarjetas Interactivas)
- Incluye las 6 categorías de la referencia:
  1. **Embarazo & Maternidad** (Con insignia *"Más popular"*)
  2. **Familiares**
  3. **Cumpleaños & Festejos**
  4. **Bodas & Elopements** (Con insignia *"Exclusivo"*)
  5. **Gastronómica & Comercial**
  6. **Eventos & Galas**
- **Interactividad:** Al hacer clic en cualquier tarjeta de servicio, se abre el modal de reserva con ese servicio automáticamente seleccionado en el formulario.

---

### 6. Reseñas y Testimonios de Clientes
- Carrusel de opiniones con valoración por estrellas doradas (★★★★★), cita textual del cliente, foto de avatar y tipo de evento celebrado.
- Incluye flechas circulares para desplazarse lateralmente.

---

### 7. Banner de Cierre & Cotizador Interactivo
- **Banner Izquierdo:** Fotografía de atardecer con degradado oscuro, tipografía en cursiva elegante (*"merece ser contada"*) y botón de llamada a la acción.
- **Tarjeta Derecha:** Lista interactiva de servicios estandarizados y caja especial para cotizaciones personalizadas.
- **Modal de Reserva:** Formulario completo con:
  - Nombre del cliente
  - Correo electrónico
  - Teléfono / WhatsApp
  - Selector de tipo de sesión
  - Selector de fecha tentativa (Datepicker)
  - Ubicación deseada
  - Mensaje / Visión creativa
  - Simulación de envío con confirmación visual automática y reseteo de campos.

---

### 8. Diferenciador Full Stack: Muestra de "Portal Web Privado"
- Destaca cómo el fotógrafo ofrece un valor agregado que otros no tienen: en lugar de simples carpetas de Google Drive o memorias USB, entrega una **plataforma web privada protegida con contraseña**, optimizada para descarga en 4K, visualización móvil y selección de favoritos para impresión.

---

## 🎨 Paleta de Color & Tipografías

| Token | Código HEX / Valor | Aplicación |
| :--- | :--- | :--- |
| `--color-bg` | `#f9f6f0` | Fondo general estilo lino/papel cálido |
| `--color-surface` | `#ffffff` | Tarjetas blancas limpias |
| `--color-surface-warm` | `#f4eee6` | Tarjetas con tono beige cálido |
| `--color-primary` | `#1f1b18` | Títulos y texto en café espresso oscuro |
| `--color-accent` | `#c49663` | Acentos dorados, terracota y botones hover |
| `--color-accent-dark` | `#996e3b` | Tono bronce intenso para enlaces y estados activos |
| Tipografía Títulos | `'Cormorant Garamond'` | Tipografía serif editorial y de alta costura |
| Tipografía UI/Cuerpo | `'Plus Jakarta Sans'` | Tipografía limpia, geométrica y de máxima legibilidad |

---

## 💻 Cómo Abrir y Probar el Proyecto

### Opción 1: Apertura Directa
1. Haz doble clic en el archivo [index.html](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/index.html) desde tu explorador de archivos. Se abrirá inmediatamente en Chrome, Edge o tu navegador preferido.

### Opción 2: Servidor Local (Recomendado para desarrollo)
Abre PowerShell o tu terminal en la carpeta del proyecto y ejecuta:
```bash
# Con Python:
python -m http.server 3000

# O con Node.js (npx):
npx serve .
```
Luego visita `http://localhost:3000`.

---

## 🌐 Guía de Despliegue en Internet (Gratis en 2 Minutos)

El proyecto está construido con **Vanilla HTML5, CSS3 y JavaScript moderno puro**, lo que significa que no requiere pasos de compilación ni servidores costosos.

1. **Vercel / Netlify:**
   - Arrastra y suelta la carpeta `Pagina para Fotos` en el dashboard de [Netlify Drop](https://app.netlify.com/drop) o impórtalo desde GitHub en [Vercel](https://vercel.com).
   - Estará en línea con certificado SSL gratuito al instante.
2. **GitHub Pages:**
   - Sube estos archivos a un repositorio en GitHub.
   - Ve a **Settings > Pages** y activa la rama `main`. Tu web estará en `https://tuusuario.github.io/tu-repositorio`.
