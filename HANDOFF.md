# 📸 STUDIO NVF | Nicole Valerio Fotografía Editorial
## Documento Handoff: Arquitectura, Sección Books (Catálogo) y Explicación de Scripts en Python

¡Tu sitio web ha sido transformado por completo siguiendo la estética editorial de alta gama (**estilo Rihan Asaya**), integrando la sección de **Catálogo de Books**, eliminando la barra negra superior y utilizando **100% fotos reales de tu estudio Pixieset**!

---

## 🐍 Explicación Rápida de los Scripts de Python

En el proyecto existen **4 scripts clave de Python** creados para automatizar la obtención, descarga y preparación de las fotografías de Pixieset:

| Script | ¿Qué hace? | ¿Por qué es necesario? |
| :--- | :--- | :--- |
| **`fetch_all_pixieset.py`** | **Extractor de colecciones y API:** Se conecta a `studionvf.pixieset.com`, descubre el `collectionId` de cada una de las 11 sesiones (Boda, Embarazo, Marca Personal, etc.) y consulta la API privada de Pixieset para obtener los enlaces en alta definición de más de 575 fotografías. Guarda todo en `studionvf_all_photos.json`. | Pixieset usa *lazy loading* y oculta las fotos detrás de JavaScript; este script las extrajo todas automáticamente sin tener que copiarlas una por una. |
| **`download_assets.py`** | **Descargador de fotos locales:** Lee `studionvf_all_photos.json` y descarga directamente a la carpeta `assets/images/studionvf/` las 27 fotografías esenciales (las 11 portadas de los Books, fotos del Hero, Work, Press y la tira de Instagram). | Permite que la página cargue al instante y funcione offline sin depender de servidores externos lentos. |
| **`make_catalog_js.py`** | **Generador del catálogo web:** Convierte la información del JSON maestro en un archivo JavaScript ligero (`js/catalog-data.js`) con la variable global `window.STUDIO_NVF_CATALOG`. | Permite que el visor interactivo de libros de la página web abra al instante las galerías y miniaturas de cada sesión sin requerir una base de datos ni servidor backend. |
| **`scrape_pixieset.py`** | **Script explorador preliminar:** Inspecciona las páginas de las colecciones buscando patrones de URLs de imágenes (`images.pixieset.com`) y genera `pixieset_photos.json`. | Sirvió para la verificación inicial de rutas y resoluciones de imagen. |

---

## 🐍 ¿Por qué se utilizó Python y para qué sirvió cada archivo?

Para cumplir con tu requerimiento:
> *"Usa solamente las fotos de esta pagina: https://studionvf.pixieset.com/ Las descargas y revisa por seccion porfa"*

Plataformas de fotografía profesional como **Pixieset** no colocan todas las fotos directamente en el código HTML estático. En su lugar, utilizan un motor en JavaScript que carga las fotos de forma diferida (*lazy loading*) mediante llamadas internas a su API. Si se intentaba guardar la página manualmente, solo se obtenían las fotos de portada y se perdían los cientos de fotos de cada sesión.

Por esta razón, como desarrolladores web e ingenieros de software, utilizamos **Python** como herramienta de automatización, ingeniería inversa e inspección de datos. Esto nos permitió extraer con precisión milimétrica las **11 colecciones completas (más de 575 fotos en ultra alta resolución)** sin perder calidad.

A continuación se detalla la función exacta de cada script creado durante el proceso:

### 1. Descubrimiento e Inspección del Sistema Pixieset
- **`test_pixie.py`**: Hizo una primera petición HTTP simulando un navegador real a la galería de bodas para verificar si las imágenes venían en el HTML o se inyectaban dinámicamente con JavaScript.
- **`find_gallery_data.py`**: Analizó los 18 bloques `<script>` presentes en el HTML de Pixieset buscando variables globales relacionadas con las fotos (`photo`, `collection_id`, `gallery_id`).
- **`find_client_init.py`**: Inspeccionó la función `PixiesetClient.init()` y descubrió los metadatos clave: el ID interno de la colección (`collectionId: 124765091`), el slug de galería (`destacados`) y el conteo de fotos (`collectionPhotoCount: 75`).
- **`find_scripts.py`**: Listó todas las librerías JavaScript que Pixieset carga en el navegador para identificar el archivo principal del motor (`client.combined.min.js`).

### 2. Ingeniería Inversa del Endpoint de Datos
- **`find_ajax_patterns.py`**, **`find_pixie_ajax.py`** y **`find_client_calls.py`**: Escanearon el código fuente minificado de Pixieset (más de 800 KB de JavaScript) buscando las funciones de petición AJAX. Aquí encontramos el endpoint privado exacto que utiliza la plataforma:
  ```http
  GET /client/loadphotos/?cuk={slug}&cid={collectionId}&gs=destacados&page=0&all=1
  ```
- **`check_theme_js.py`**: Inspeccionó el tema visual para verificar si existían animaciones o llamadas adicionales al hacer scroll.
- **`test_endpoints.py`**: Comprobó cuál de las rutas candidatas respondía con código de éxito `200 OK` y entregaba los datos de las fotografías.
- **`check_boda_photos.py`** y **`fetch_pixie_api.py`**: Verificaron la estructura de respuesta JSON y confirmaron la descarga exitosa de los metadatos de las 75 fotografías de bodas (rutas en tamaño `large`, `xlarge`, `xxlarge`, dimensiones y nombres).

### 3. Extracción Masiva de las 11 Colecciones
- **`fetch_all_pixieset.py`**: Automatizó la extracción secuencial de cada una de las 11 colecciones de Studio NVF obteniendo sus IDs, nombres de sesión, fotos de portada y listados completos de imágenes.
- **`fetch_remaining.py`**: Gestionó las peticiones con cabeceras de usuario y pausas inteligentes (*rate limiting*) para evitar bloqueos del servidor y extraer las colecciones restantes (`embarazo`, `familia`, `revelaciondegenero`, `gastronomia`, `eventos`).
- **`summary_photos.py`**: Generó un reporte de validación en consola confirmando que las 11 secciones contaban con fotos de alta calidad verificadas.

### 4. Almacenamiento Local y Generación del Catálogo Web
- **`download_assets.py`**: Descargó automáticamente las 11 portadas oficiales de los Books y las fotos editoriales seleccionadas para el Hero, Work, Press y la tira de Instagram en la carpeta local [assets/images/studionvf/](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/assets/images/studionvf/) y [public/assets/images/studionvf/](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/public/assets/images/studionvf/). Esto garantiza que la web cargue **al instante, sin depender de conexiones lentas ni enlaces rotos**.
- **`make_catalog_js.py`**: Tomó los datos maestros de [studionvf_all_photos.json](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/studionvf_all_photos.json) y los empaquetó en [js/catalog-data.js](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/js/catalog-data.js) como un objeto nativo de JavaScript (`window.STUDIO_NVF_CATALOG`) para que el visor interactivo de libros funcione de inmediato en cualquier navegador sin necesidad de base de datos.

> 💡 **Nota de limpieza:** Los scripts de prueba e inspección ya cumplieron su propósito técnico y fueron depurados del directorio principal para mantener tu repositorio limpio, dejando únicamente los datos maestros y los archivos de descarga de producción.

---

## 🎨 Resumen de las Modificaciones Realizadas en la Web

### 1. Se eliminó la línea negra superior
- Se removió la barra oscura superior (`top-bar`) y la franja negra de categorías.
- El header ahora es completamente limpio, ligero y translúcido sobre fondo marfil cálido (`#FAF8F5`).

### 2. Títulos con estilo cursiva (*Italic Serif*)
- Se aplicó la fuente **Cormorant Garamond** con acentos en cursiva italiana (*italics*) en todos los encabezados principales:
  - *WEAR WHAT MAKES YOU FEEL ALIVE*
  - *Work* Editoriales
  - *Press* & Publicaciones
  - *Books* (Catálogo de Colecciones)
  - Follow *@_STUDIONVF*
  - *Nicole Valerio* · Studio NVF
  - *Tu historia merece ser contada*

### 3. Nueva Sección de Catálogo "BOOKS" (Inspirada en la referencia de Rihan Asaya)
- **Fondo lino / arena cálido (`#EFE9E2`)**: El mismo tono cálido beige que destaca en la imagen de referencia.
- **11 Tarjetas en formato libro de arte (*Art Book Jackets*)**: Cada colección cuenta con sombra de lomo realista, badge de número de fotos y portada oficial:
  1. *Book 01: Boda* (75 fotos)
  2. *Book 02: Embarazo* (26 fotos)
  3. *Book 03: Marca Personal* (70 fotos)
  4. *Book 04: Parejas* (25 fotos)
  5. *Book 05: Parejas Playa* (12 fotos)
  6. *Book 06: Familia* (49 fotos)
  7. *Book 07: Revelación de Género* (43 fotos)
  8. *Book 08: Cumpleaños* (156 fotos)
  9. *Book 09: Gastronomía* (63 fotos)
  10. *Book 10: Eventos* (32 fotos)
  11. *Book 11: Navidad* (24 fotos)
- **Visor interactivo con tira de negativos (*Filmstrip*)**: Al hacer clic sobre cualquier libro, se abre el visor modal en alta resolución con miniaturas navegables para recorrer la sesión completa y un botón de consulta directa por WhatsApp.

### 4. Nuevas Secciones y Mejoras Visuales Recientes
- **Hero con Fondo de Cintas en Movimiento:** 3 tiras continuas estilo rollo de película 35mm con perforaciones y marcos que se desplazan infinitamente en direcciones contrarias de fondo.
- **Animación de Escritura para "Nicole Valerio":** El nombre de la fotógrafa se redacta trazo por trazo al ingresar a la página con cursor titilante dorado, seguido de la revelación de la frase y botones.
- **Sección WORK**: 3 portadas verticales de autor con insignias editoriales (*Harper's Bazaar · Vogue*).
- **Sección PRESS**: Cuadrícula de 2 columnas con artículos tipo revista, limpia y sin botones `READ MORE`.
- **Sección FOLLOW @nicolevaleriofotografia**: Tira de 6 fotos con enlace al Instagram oficial y efecto *hover* interactivo con tarjeta de previsualización.
- **Sección de Reseñas y Calificaciones Integrada**: Testimonios reales con estrellas doradas `★★★★★`, promedio `5.0` y panel desplegable para dejar nuevas opiniones sin sobrecargar la página.
- **Favicon de Cámara Fotográfica**: Ícono SVG minimalista de cámara profesional en tonos dorado y negro.
- **Animación de Scroll Suave**: Desplazamiento fluido y revelación progresiva de elementos (*fade-up*) al hacer scroll.

### 5. Limpieza y Refinamiento (2026-10-28)
Los siguientes cambios fueron aplicados para simplificar la navegación y mejorar la experiencia de calificación:

| Elemento | Cambio | Archivos modificados |
| :--- | :--- | :--- |
| Botón **"VER CATÁLOGO & BOOKS →"** | **Eliminado** del Hero. Queda solo el CTA principal `RESERVAR SESIÓN`. | `index.html`, `src/components/Hero.tsx` |
| Enlace **"VER TODOS LOS BOOKS Y SESIONES"** | **Eliminado** del pie de la sección Work. | `index.html`, `src/components/WorkSection.tsx` |
| Nav link **"Sobre mí"** | **Eliminado** del menú desktop y del drawer mobile. | `index.html`, `src/components/Header.tsx` |
| Sección **`#sobre-mi`** (cuadro de perfil Nicole + story spotlight) | **Eliminada** por completo. | `index.html` |
| **Story Modal** (`#storyModal`) | **Eliminado** junto a todos sus event listeners. | `index.html`, `js/main.js` |
| Componentes React **`AboutSection`** y **`StoryModal`** | **Eliminados** de `page.tsx` (imports, estado y JSX). | `src/app/page.tsx` |
| Botón **★ DEJAR MI CALIFICACIÓN** | **Añadido** como CTA prominente en el header de la sección Reseñas, visible de inmediato. Al hacer clic realiza *smooth scroll* al formulario y auto-enfoca el primer campo. | `index.html`, `css/styles.css`, `js/main.js` |

### 6. Muro de Galería Rombo (Gallery Wall) y Nueva Paleta de Color (2026-10-29)
| Elemento | Descripción del cambio |
| :--- | :--- |
| **Paleta Natural Editorial** | Se actualizaron todos los tokens de diseño con la nueva paleta: Crema (`#F4EFE8`), Carbón Oliva (`#3F3B34`), Verde Salvia (`#939E7E`), Rosa Polvoso (`#D8B8AF`) y Taupe Cálido (`#B8AA9E`). |
| **Muro de Galería (Rombo)** | Se rediseñó la sección Books como una composición tipo *Gallery Wall* en 5 columnas con silueta de rombo: las 3 fotos horizontales en el centro (ratio 3:2) y las 8 verticales a los costados (ratio 2:3). Sin huecos vacíos ni recortes forzados. |
| **Formulario de Reseñas Desplegable** | El botón "DEJAR MI CALIFICACIÓN" abre suavemente el formulario y se oculta; el formulario incluye botón "Cancelar" y se autocierra tras publicar con éxito. |
| **Comando `npm run dev`** | Configurado para servir inmediatamente el sitio estático (`index.html`) en el puerto 3000. |

---

## 🗂️ Estructura Final del Proyecto

```text
Pagina para Fotos/
│
├── assets/images/studionvf/       # Fotos reales descargadas de Pixieset (portadas y editoriales)
├── css/
│   └── styles.css                 # Sistema de diseño editorial, paleta de colores y estilos de books
├── js/
│   ├── catalog-data.js            # Base de datos local de las 11 colecciones con 575+ fotos
│   └── main.js                    # Motor interactivo de modales, visor de libros y WhatsApp
├── index.html                     # Archivo HTML principal listo para abrir en el navegador
│
├── studionvf_all_photos.json      # JSON maestro con metadatos completos de Pixieset
├── public/assets/images/studionvf/# Mismas fotos optimizadas para Next.js
├── src/                           # Componentes React + TypeScript sincronizados
│   ├── app/page.tsx               # Página principal Next.js
│   └── components/
│       ├── Header.tsx             # Navegación sin barra negra
│       ├── Hero.tsx               # Hero editorial split
│       ├── WorkSection.tsx        # 3 tarjetas verticales
│       ├── PressSection.tsx       # 6 artículos de prensa
│       ├── BooksSection.tsx       # Catálogo de 11 books
│       ├── FollowSection.tsx      # Tira de 6 fotos sociales
│       ├── BookGalleryModal.tsx   # Visor de libros con miniaturas
│       └── BookingModal.tsx       # Formulario interactivo de reserva
└── HANDOFF.md                     # Este documento explicativo
```

---

## 🚀 Cómo Visualizar los Cambios

1. **Modo Directo (Navegador):** Puedes abrir directamente el archivo [index.html](file:///c:/Users/santi/OneDrive/Desktop/Pagina%20para%20Fotos/index.html) con doble clic o usando Live Server.
2. **Modo Next.js:** Si tienes `npm run dev` en ejecución, la versión en React/TypeScript se encuentra sincronizada con las mismas secciones y componentes.
