/**
 * ==============================================================================
 * NICOLE VALERIO - FOTOGRAFÍA & FULL STACK DIGITAL STUDIO
 * Interactive Logic & Animation Engine
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HERO ANIMATED BACKGROUND SLIDESHOW
     - Simula el pase continuo y cinematográfico de fotografías de fondo
     - Permite que el usuario reemplace las fotos fácilmente
     ========================================================================== */
  const heroSlides = document.querySelectorAll('.hero-bg-stream .bg-slide');
  const bgDotsContainer = document.getElementById('bgDotsContainer');
  let currentSlideIndex = 0;
  let heroSlideInterval = null;

  // Generar indicadores (dots) interactivos según la cantidad de diapositivas
  if (heroSlides.length > 0 && bgDotsContainer) {
    heroSlides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `bg-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ver fondo ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToHeroSlide(idx);
        resetHeroSlideTimer();
      });
      bgDotsContainer.appendChild(dot);
    });
  }

  function goToHeroSlide(index) {
    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });

    const dots = bgDotsContainer ? bgDotsContainer.querySelectorAll('.bg-dot') : [];
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    currentSlideIndex = index;
  }

  function nextHeroSlide() {
    let nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    goToHeroSlide(nextIndex);
  }

  function startHeroSlideTimer() {
    heroSlideInterval = setInterval(nextHeroSlide, 5000); // Cambia cada 5 segundos
  }

  function resetHeroSlideTimer() {
    if (heroSlideInterval) clearInterval(heroSlideInterval);
    startHeroSlideTimer();
  }

  if (heroSlides.length > 0) {
    startHeroSlideTimer();
  }

  /* ==========================================================================
     2. SMALL PHOTOS CAROUSEL (CARRUSEL DE FOTOS PEQUEÑAS)
     - Desplazamiento interactivo suave
     - Botones Previo / Siguiente
     - Soporte para arrastre táctil (touch swipe) y mouse drag
     - Filtros dinámicos por categorías (Retratos, Bodas, Parejas, etc.)
     - Barra de progreso y contador
     ========================================================================== */
  const carouselViewport = document.getElementById('carouselViewport');
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const filterPills = document.querySelectorAll('#portfolioFilters .filter-pill');
  const progressFill = document.getElementById('carouselProgressFill');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlideNum = document.getElementById('totalSlideNum');

  let carouselOffset = 0;
  let maxOffset = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Colección de datos de fotos para el lightbox
  const photoCollection = [
    {
      id: 1,
      category: 'retratos',
      title: 'Luz Dorada',
      desc: 'Sesión individual al atardecer en luz natural. Enfoque suave resaltando la mirada y expresiones sinceras.',
      camera: 'Sony A7IV',
      lens: '85mm f/1.4 GM',
      iso: 'ISO 100',
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 2,
      category: 'parejas',
      title: 'Conexión en la Cumbre',
      desc: 'Escapada a las colinas doradas al amanecer. Una atmósfera íntima y cinemática en plena naturaleza.',
      camera: 'Canon R5',
      lens: '50mm f/1.2 L',
      iso: 'ISO 200',
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 3,
      category: 'familia',
      title: 'Primeros Pasos',
      desc: 'Momentos espontáneos entre madre e hijo sin poses forzadas, capturando la ternura del vínculo materno.',
      camera: 'Sony A7IV',
      lens: '35mm f/1.4 GM',
      iso: 'ISO 400',
      src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 4,
      category: 'marca',
      title: 'Esencia Botánica',
      desc: 'Fotografía comercial para marca de perfumería artesanal. Composición minimalista con elementos orgánicos.',
      camera: 'Sony A7R V',
      lens: '90mm f/2.8 Macro',
      iso: 'ISO 64',
      src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 5,
      category: 'bodas',
      title: 'Promesa Eterna',
      desc: 'Detalle de la novia en exteriores con ramo silvestre. Iluminación lateral en tonalidades cálidas.',
      camera: 'Canon R6 II',
      lens: '50mm f/1.4',
      iso: 'ISO 160',
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 6,
      category: 'retratos',
      title: 'Mirada Franca',
      desc: 'Retrato de marca profesional con luz lateral en estudio. Carácter, sobriedad y calidez visual.',
      camera: 'Sony A7IV',
      lens: '85mm f/1.8',
      iso: 'ISO 100',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 7,
      category: 'bodas',
      title: 'El Primer Beso',
      desc: 'La emoción pura después de pronunciar los votos en una ceremonia íntima en jardín.',
      camera: 'Canon R5',
      lens: '24-70mm f/2.8',
      iso: 'ISO 320',
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 8,
      category: 'eventos',
      title: 'Luces de Velada',
      desc: 'Montaje de banquete nocturno con luces de hadas e iluminación cálida para cena de gala.',
      camera: 'Sony A7S III',
      lens: '24mm f/1.4 GM',
      iso: 'ISO 800',
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85'
    }
  ];

  function getVisibleCards() {
    return Array.from(carouselTrack.querySelectorAll('.carousel-card:not(.hidden)'));
  }

  function updateCarouselMetrics() {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const viewportWidth = carouselViewport.offsetWidth;
    const trackWidth = carouselTrack.scrollWidth;
    maxOffset = Math.max(0, trackWidth - viewportWidth);

    if (totalSlideNum) {
      totalSlideNum.textContent = visibleCards.length;
    }

    // Asegurar que el offset no exceda el límite
    if (carouselOffset > maxOffset) {
      carouselOffset = maxOffset;
    }
    if (carouselOffset < 0) {
      carouselOffset = 0;
    }

    applyCarouselTransform();
    updateProgressBar();
  }

  function applyCarouselTransform() {
    carouselTrack.style.transform = `translateX(-${carouselOffset}px)`;
  }

  function updateProgressBar() {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const cardWidth = visibleCards[0].offsetWidth + 20; // 20px gap
    let currentIndex = Math.min(
      Math.floor(carouselOffset / cardWidth) + 1,
      visibleCards.length
    );

    if (currentSlideNum) {
      currentSlideNum.textContent = Math.max(1, currentIndex);
    }

    if (progressFill) {
      const percentage = maxOffset === 0 ? 100 : Math.min(100, Math.max(15, (carouselOffset / maxOffset) * 100));
      progressFill.style.width = `${percentage}%`;
    }
  }

  function scrollCarousel(direction) {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const step = visibleCards[0].offsetWidth + 20; // Ancho de una tarjeta + gap
    
    if (direction === 'next') {
      carouselOffset = Math.min(maxOffset, carouselOffset + step);
    } else {
      carouselOffset = Math.max(0, carouselOffset - step);
    }

    applyCarouselTransform();
    updateProgressBar();
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => scrollCarousel('next'));
  }

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => scrollCarousel('prev'));
  }

  // Soporte Touch & Mouse Drag para el carrusel
  carouselViewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    prevTranslate = carouselOffset;
    carouselTrack.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.pageX;
    const diff = startX - currentX;
    carouselOffset = Math.max(0, Math.min(maxOffset, prevTranslate + diff));
    applyCarouselTransform();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    carouselTrack.style.transition = 'transform 0.4s var(--ease-smooth)';
    updateProgressBar();
  });

  // Touch eventos
  carouselViewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    prevTranslate = carouselOffset;
    carouselTrack.style.transition = 'none';
  }, { passive: true });

  carouselViewport.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    carouselOffset = Math.max(0, Math.min(maxOffset, prevTranslate + diff));
    applyCarouselTransform();
  }, { passive: true });

  carouselViewport.addEventListener('touchend', () => {
    carouselTrack.style.transition = 'transform 0.4s var(--ease-smooth)';
    updateProgressBar();
  });

  // Filtros de categoría interactivos
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const selectedCategory = pill.getAttribute('data-category');
      const allCards = carouselTrack.querySelectorAll('.carousel-card');

      allCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      carouselOffset = 0;
      setTimeout(updateCarouselMetrics, 50);
    });
  });

  window.addEventListener('resize', updateCarouselMetrics);
  updateCarouselMetrics();

  /* ==========================================================================
     3. LIGHTBOX MODAL (VISOR DE FOTOS EN ALTA RESOLUCIÓN)
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxInquireBtn = document.getElementById('lightboxInquireBtn');

  let activePhotoIndex = 0;

  function openLightbox(photoId) {
    const index = photoCollection.findIndex(item => item.id === Number(photoId));
    if (index === -1) return;

    activePhotoIndex = index;
    renderLightboxPhoto();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderLightboxPhoto() {
    const photo = photoCollection[activePhotoIndex];
    if (!photo) return;

    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    lightboxCategory.textContent = photo.category.toUpperCase();
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.desc;

    // Actualizar specs si existen
    const specsContainer = document.querySelector('.meta-specs');
    if (specsContainer) {
      specsContainer.innerHTML = `
        <span>📷 ${photo.camera}</span>
        <span>🎯 ${photo.lens}</span>
        <span>⚡ ${photo.iso}</span>
      `;
    }
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextLightboxPhoto() {
    activePhotoIndex = (activePhotoIndex + 1) % photoCollection.length;
    renderLightboxPhoto();
  }

  function prevLightboxPhoto() {
    activePhotoIndex = (activePhotoIndex - 1 + photoCollection.length) % photoCollection.length;
    renderLightboxPhoto();
  }

  // Asignar clics en tarjetas del carrusel para abrir el lightbox
  document.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openLightbox(id);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxPhoto);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxPhoto);

  if (lightboxInquireBtn) {
    lightboxInquireBtn.addEventListener('click', () => {
      const currentPhoto = photoCollection[activePhotoIndex];
      closeLightbox();
      openBookingModal(currentPhoto ? currentPhoto.category : null);
    });
  }

  // Teclado para lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxPhoto();
    if (e.key === 'ArrowLeft') prevLightboxPhoto();
  });

  /* ==========================================================================
     4. BOOKING MODAL & INTERACTIVE APPOINTMENT FORM
     ========================================================================== */
  const bookingModal = document.getElementById('bookingModal');
  const bookingBackdrop = document.getElementById('bookingBackdrop');
  const bookingCloseBtn = document.getElementById('bookingCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const sessionTypeSelect = document.getElementById('sessionType');
  const formFeedback = document.getElementById('formFeedback');

  function openBookingModal(preselectedService = null) {
    if (preselectedService && sessionTypeSelect) {
      // Intentar coincidir con las opciones existentes
      for (let option of sessionTypeSelect.options) {
        if (option.value.toLowerCase().includes(preselectedService.toLowerCase()) ||
            preselectedService.toLowerCase().includes(option.value.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Disparadores del modal de reserva en toda la web
  const bookingTriggers = [
    document.getElementById('openBookingModalBtn'),
    document.getElementById('mobileBookBtn'),
    document.getElementById('quickBookHeroBtn'),
    document.getElementById('bannerBookBtn'),
    document.getElementById('contactSpecialBtn')
  ];

  bookingTriggers.forEach(btn => {
    if (btn) btn.addEventListener('click', () => openBookingModal());
  });

  if (bookingCloseBtn) bookingCloseBtn.addEventListener('click', closeBookingModal);
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', closeBookingModal);

  // Clics en tarjetas de servicio "Elige tu sesión"
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const service = card.getAttribute('data-service');
      openBookingModal(service);
    });
  });

  // Clics en la lista estandarizada
  document.querySelectorAll('.standard-item').forEach(item => {
    item.addEventListener('click', () => {
      const service = item.getAttribute('data-service');
      openBookingModal(service);
    });
  });

  // Envío del formulario con simulación visual
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando solicitud...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>¡Solicitud enviada con éxito!</strong><br>
          Gracias por contactarme. Revisaré la disponibilidad de la fecha y te responderé en breve por WhatsApp o correo.
        `;

        bookingForm.reset();

        setTimeout(() => {
          closeBookingModal();
          formFeedback.style.display = 'none';
        }, 3500);
      }, 1200);
    });
  }

  /* ==========================================================================
     5. STORY SPOTLIGHT MODAL ("Más que una fotografía")
     ========================================================================== */
  const storyModal = document.getElementById('storyModal');
  const storyBackdrop = document.getElementById('storyBackdrop');
  const storyCloseBtn = document.getElementById('storyCloseBtn');
  const openStoryModalBtn = document.getElementById('openStoryModalBtn');
  const storyInquireBtn = document.getElementById('storyInquireBtn');

  function openStoryModal() {
    storyModal.classList.add('active');
    storyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeStoryModal() {
    storyModal.classList.remove('active');
    storyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openStoryModalBtn) openStoryModalBtn.addEventListener('click', openStoryModal);
  if (storyCloseBtn) storyCloseBtn.addEventListener('click', closeStoryModal);
  if (storyBackdrop) storyBackdrop.addEventListener('click', closeStoryModal);
  if (storyInquireBtn) {
    storyInquireBtn.addEventListener('click', () => {
      closeStoryModal();
      openBookingModal('Parejas');
    });
  }

  /* ==========================================================================
     6. REVIEWS NAVIGATION (RESEÑAS SLIDER)
     ========================================================================== */
  const reviewPrevBtn = document.getElementById('reviewPrevBtn');
  const reviewNextBtn = document.getElementById('reviewNextBtn');
  const reviewsSlider = document.getElementById('reviewsSlider');

  if (reviewNextBtn && reviewsSlider) {
    reviewNextBtn.addEventListener('click', () => {
      reviewsSlider.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  if (reviewPrevBtn && reviewsSlider) {
    reviewPrevBtn.addEventListener('click', () => {
      reviewsSlider.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     7. HEADER SCROLL & MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header sombra al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Drawer Móvil
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
    });
  }

  function closeMobileDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (drawerClose) drawerClose.addEventListener('click', closeMobileDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Cierre de modales con Escape global
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookingModal && bookingModal.classList.contains('active')) closeBookingModal();
      if (storyModal && storyModal.classList.contains('active')) closeStoryModal();
      closeMobileDrawer();
    }
  });

  console.log("📸 Nicole Valerio Fotografía & Full Stack Web App inicializada correctamente.");
});
