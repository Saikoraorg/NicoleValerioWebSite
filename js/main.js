/**
 * ==============================================================================
 * STUDIO NVF - NICOLE VALERIO FOTOGRAFÍA EDITORIAL
 * Interactive Books Catalog & Gallery Engine
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const catalog = window.STUDIO_NVF_CATALOG || {};

  /* ==========================================================================
     1. NAVIGATION & MOBILE DRAWER
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const header = document.getElementById('header');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close drawer when clicking a mobile nav link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ==========================================================================
     HERO WRITING ANIMATION ("Nicole Valerio")
     ========================================================================== */
  const typingEl = document.getElementById('typingHeroName');
  const heroStatement = document.getElementById('heroStatement');
  const heroActions = document.getElementById('heroActions');

  if (typingEl) {
    const textToWrite = "Nicole Valerio";
    let charIdx = 0;
    typingEl.textContent = '';

    function typeChar() {
      if (charIdx < textToWrite.length) {
        typingEl.textContent += textToWrite.charAt(charIdx);
        charIdx++;
        // Natural handwriting rhythm variation
        const delay = Math.random() * 55 + 75;
        setTimeout(typeChar, delay);
      } else {
        // Smoothly reveal statement & actions once typing completes
        if (heroStatement) heroStatement.classList.add('revealed');
        if (heroActions) heroActions.classList.add('revealed');
      }
    }

    setTimeout(typeChar, 350);
  }

  /* ==========================================================================
     SMOOTH SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealTargets = document.querySelectorAll(
    '.reveal-on-scroll, .work-card, .press-item, .book-card, .about-profile-card, .story-spotlight-card, .cta-banner-card, .cta-info-card'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     SMOOTH SCROLL NAVIGATION (With sticky header offset)
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = 78;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     2. INTERACTIVE BOOK VIEWER / LIGHTBOX MODAL
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxFilmstrip = document.getElementById('lightboxFilmstrip');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxInquireBtn = document.getElementById('lightboxInquireBtn');

  let currentBookSlug = 'boda';
  let currentPhotoIndex = 0;
  let activeBookPhotos = [];

  function openBookGallery(slug, initialPhotoIndex = 0) {
    const book = catalog[slug];
    if (!book) {
      console.warn(`Book slug not found: ${slug}`);
      return;
    }

    currentBookSlug = slug;
    currentPhotoIndex = initialPhotoIndex;
    activeBookPhotos = book.photos && book.photos.length > 0 ? book.photos : [
      { large: book.cover, thumb: book.cover, name: book.title }
    ];

    lightboxCategory.textContent = `STUDIO NVF · ${book.title.toUpperCase()}`;
    lightboxTitle.innerHTML = `<em>Book ${book.title}</em>`;
    lightboxDesc.textContent = `Colección fotográfica de autor con ${book.photoCount} imágenes en alta resolución. Capturas en luz natural y enfoque cinematográfico.`;

    // Populate filmstrip
    if (lightboxFilmstrip) {
      lightboxFilmstrip.innerHTML = '';
      activeBookPhotos.forEach((photo, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `filmstrip-thumb ${idx === initialPhotoIndex ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${photo.thumb || photo.large}" alt="${photo.name || book.title}" loading="lazy">`;
        thumb.addEventListener('click', () => {
          showPhotoInLightbox(idx);
        });
        lightboxFilmstrip.appendChild(thumb);
      });
    }

    showPhotoInLightbox(initialPhotoIndex);

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function showPhotoInLightbox(index) {
    if (!activeBookPhotos || activeBookPhotos.length === 0) return;
    currentPhotoIndex = (index + activeBookPhotos.length) % activeBookPhotos.length;
    const photo = activeBookPhotos[currentPhotoIndex];

    lightboxImg.src = photo.large;
    lightboxImg.alt = photo.name || 'Studio NVF Fotografía';

    // Update active thumb in filmstrip
    if (lightboxFilmstrip) {
      const thumbs = lightboxFilmstrip.querySelectorAll('.filmstrip-thumb');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === currentPhotoIndex);
      });
      // Scroll active thumb into view
      if (thumbs[currentPhotoIndex]) {
        thumbs[currentPhotoIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      showPhotoInLightbox(currentPhotoIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      showPhotoInLightbox(currentPhotoIndex + 1);
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhotoInLightbox(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') showPhotoInLightbox(currentPhotoIndex + 1);
  });

  // Attach click listener to all Book cards
  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-slug');
      if (slug) openBookGallery(slug);
    });
  });

  // Attach click listener to Work cards and quick buttons
  document.querySelectorAll('.work-card, .work-quick-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const slug = el.getAttribute('data-slug');
      if (slug) openBookGallery(slug);
    });
  });

  // Attach click listener to Press "READ MORE" buttons
  document.querySelectorAll('.press-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.getAttribute('data-slug');
      if (slug) openBookGallery(slug);
    });
  });

  /* ==========================================================================
     3. BOOKING MODAL
     ========================================================================== */
  const bookingModal = document.getElementById('bookingModal');
  const bookingBackdrop = document.getElementById('bookingBackdrop');
  const bookingCloseBtn = document.getElementById('bookingCloseBtn');
  const openBookingModalBtn = document.getElementById('openBookingModalBtn');
  const openBookingHeroBtn = document.getElementById('openBookingHeroBtn');
  const mobileBookBtn = document.getElementById('mobileBookBtn');
  const bannerBookBtn = document.getElementById('bannerBookBtn');
  const requestTarifasBtn = document.getElementById('requestTarifasBtn');
  const contactSpecialBtn = document.getElementById('contactSpecialBtn');
  const sessionTypeSelect = document.getElementById('sessionType');
  const bookingForm = document.getElementById('bookingForm');
  const formFeedback = document.getElementById('formFeedback');

  function openBookingModal(preselectedService = null) {
    if (preselectedService && sessionTypeSelect) {
      for (let option of sessionTypeSelect.options) {
        if (option.value.toLowerCase().includes(preselectedService.toLowerCase()) || 
            option.text.toLowerCase().includes(preselectedService.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    closeLightbox();
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openBookingModalBtn) openBookingModalBtn.addEventListener('click', () => openBookingModal());
  if (openBookingHeroBtn) openBookingHeroBtn.addEventListener('click', () => openBookingModal());
  if (mobileBookBtn) mobileBookBtn.addEventListener('click', () => openBookingModal());
  if (bannerBookBtn) bannerBookBtn.addEventListener('click', () => openBookingModal());
  if (requestTarifasBtn) requestTarifasBtn.addEventListener('click', () => openBookingModal());
  if (bookingCloseBtn) bookingCloseBtn.addEventListener('click', closeBookingModal);
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', closeBookingModal);

  if (lightboxInquireBtn) {
    lightboxInquireBtn.addEventListener('click', () => {
      const book = catalog[currentBookSlug];
      openBookingModal(book ? book.title : null);
    });
  }

  // Standard items click
  document.querySelectorAll('.standard-item').forEach(item => {
    item.addEventListener('click', () => {
      const service = item.getAttribute('data-service');
      openBookingModal(service);
    });
  });

  // WhatsApp quick inquiry
  if (contactSpecialBtn) {
    contactSpecialBtn.addEventListener('click', () => {
      const msg = encodeURIComponent("¡Hola Nicole! Me gustaría consultar disponibilidad para una sesión fotográfica con Studio NVF.");
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });
  }

  // Booking form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const email = document.getElementById('clientEmail').value;
      const phone = document.getElementById('clientPhone').value;
      const session = sessionTypeSelect.value;
      const date = document.getElementById('preferredDate').value;

      formFeedback.innerHTML = `<strong>¡Gracias ${name}!</strong> Hemos recibido tu solicitud para el book de <em>${session}</em>. Te contactaremos a la brevedad a ${phone} o ${email}.`;
      formFeedback.className = 'form-feedback success';

      setTimeout(() => {
        const msg = encodeURIComponent(`¡Hola Studio NVF! Soy ${name}, envié solicitud para el Book de ${session} fecha: ${date || 'por definir'}.`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
        bookingForm.reset();
        setTimeout(closeBookingModal, 2500);
      }, 1200);
    });
  }

  /* ==========================================================================
     5. DYNAMIC REVIEWS SYSTEM (Carousel + Star Rating + LocalStorage)
     ========================================================================== */

  // Toggle review form visibility
  const btnOpenReviewTop = document.getElementById('btnOpenReviewTop');
  const reviewFormContainer = document.getElementById('publicar-calificacion');

  function showReviewForm() {
    if (reviewFormContainer) {
      reviewFormContainer.classList.add('form-visible');
      reviewFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const firstInput = reviewFormContainer.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
      }, 500);
      if (btnOpenReviewTop) btnOpenReviewTop.style.display = 'none';
    }
  }

  function hideReviewForm() {
    if (reviewFormContainer) {
      reviewFormContainer.classList.remove('form-visible');
      if (btnOpenReviewTop) btnOpenReviewTop.style.display = '';
      // Scroll back to button area
      const rateSection = document.getElementById('resenas');
      if (rateSection) rateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (btnOpenReviewTop) {
    btnOpenReviewTop.addEventListener('click', (e) => {
      e.preventDefault();
      showReviewForm();
    });
  }

  // Cancel button hides the form
  const rfCancelBtn = document.getElementById('rfCancelBtn');
  if (rfCancelBtn) {
    rfCancelBtn.addEventListener('click', hideReviewForm);
  }

  const STORAGE_KEY = 'studionvf_reviews_v1';

  // Seed reviews that are always shown (from HTML). We store only user-submitted ones.
  const seedReviews = [
    { name: 'Daniela y Andrés', session: 'Boda de Autor · Studio NVF', rating: 5, quote: 'Nicole tiene un talento increíble para capturar la esencia de cada momento. Nos hizo sentir súper cómodos y el resultado fue más de lo que imaginamos. La galería y el book de nuestra boda son una joya familiar.', initials: 'D&A' },
    { name: 'Mariana López', session: 'Book Embarazo', rating: 5, quote: 'Las fotos de nuestro embarazo son un recuerdo invaluable. El trato fue cálido, respetuoso y el catálogo digital superó cualquier expectativa.', initials: 'ML' },
    { name: 'Valeria Torres', session: 'Marca Personal', rating: 5, quote: 'La sesión de marca personal transformó completamente la imagen de mi estudio. Captó la sobriedad y creatividad exacta que necesitaba.', initials: 'VT' },
  ];

  function loadStoredReviews() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveReview(r) {
    const list = loadStoredReviews();
    list.push(r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function starsHTML(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function getInitials(name) {
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
  }

  function buildReviewCard(r) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="stars-row" data-rating="${r.rating}">${starsHTML(r.rating)}</div>
      <p class="review-quote">"${r.quote}"</p>
      <div class="reviewer-meta">
        <div class="reviewer-avatar-placeholder">${r.initials || getInitials(r.name)}</div>
        <div class="reviewer-info">
          <h4 class="reviewer-name">${r.name}</h4>
          <span class="reviewer-tag">${r.session || 'Studio NVF'}</span>
        </div>
      </div>`;
    return card;
  }

  function updateGlobalScore(allReviews) {
    const total = allReviews.length;
    if (!total) return;
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / total;
    const numEl = document.getElementById('globalScoreNum');
    const cntEl = document.getElementById('globalScoreCount');
    const stEl  = document.getElementById('globalStarsDisplay');
    if (numEl) numEl.textContent = avg.toFixed(1);
    if (cntEl) cntEl.textContent = `(${total} reseña${total !== 1 ? 's' : ''})`;
    if (stEl)  stEl.textContent  = starsHTML(Math.round(avg));
  }

  function buildDots(carousel, dotsEl) {
    const cards = carousel.querySelectorAll('.review-card');
    dotsEl.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => scrollToCard(carousel, dotsEl, i));
      dotsEl.appendChild(dot);
    });
  }

  function getVisibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  let currentPage = 0;

  function scrollToCard(carousel, dotsEl, pageIndex) {
    const cards = carousel.querySelectorAll('.review-card');
    if (!cards.length) return;
    const visible = getVisibleCount();
    const maxPage = Math.max(0, Math.ceil(cards.length / visible) - 1);
    currentPage = Math.max(0, Math.min(pageIndex, maxPage));

    const cardWidth = cards[0].getBoundingClientRect().width + 24; // + gap
    carousel.scrollLeft = currentPage * cardWidth * visible;

    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentPage));
  }

  // Boot the reviews system
  const carousel = document.getElementById('reviewsCarousel');
  const dotsEl   = document.getElementById('reviewsDots');
  const prevBtn  = document.getElementById('revPrevBtn');
  const nextBtn  = document.getElementById('revNextBtn');

  if (carousel && dotsEl) {
    // Clear HTML seeds and rebuild from data
    carousel.innerHTML = '';
    const userReviews = loadStoredReviews();
    const allReviews  = [...seedReviews, ...userReviews];

    allReviews.forEach(r => carousel.appendChild(buildReviewCard(r)));
    buildDots(carousel, dotsEl);
    updateGlobalScore(allReviews);

    if (prevBtn) prevBtn.addEventListener('click', () => scrollToCard(carousel, dotsEl, currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollToCard(carousel, dotsEl, currentPage + 1));
    window.addEventListener('resize', () => buildDots(carousel, dotsEl));
  }

  // Star rating input
  const starBtns   = document.querySelectorAll('.star-btn');
  const rfRating   = document.getElementById('rfRating');
  let selectedRating = 0;

  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const val = +btn.dataset.val;
      starBtns.forEach(b => b.classList.toggle('active', +b.dataset.val <= val));
    });
    btn.addEventListener('mouseleave', () => {
      starBtns.forEach(b => b.classList.toggle('active', +b.dataset.val <= selectedRating));
    });
    btn.addEventListener('click', () => {
      selectedRating = +btn.dataset.val;
      if (rfRating) rfRating.value = selectedRating;
      starBtns.forEach(b => b.classList.toggle('active', +b.dataset.val <= selectedRating));
    });
  });

  // Form submit
  const reviewForm = document.getElementById('reviewForm');
  const rfFeedback = document.getElementById('rfFeedback');

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('rfName')?.value.trim();
      const session = document.getElementById('rfSession')?.value;
      const message = document.getElementById('rfMessage')?.value.trim();
      const rating  = parseInt(document.getElementById('rfRating')?.value || '0');

      if (!name) { showFeedback('Por favor escribe tu nombre.', 'error'); return; }
      if (!rating) { showFeedback('Selecciona una calificación con estrellas.', 'error'); return; }
      if (!message || message.length < 10) { showFeedback('Escribe una reseña de al menos 10 caracteres.', 'error'); return; }

      const newReview = { name, session, rating, quote: message, initials: getInitials(name) };
      saveReview(newReview);

      // Add to carousel live
      if (carousel && dotsEl) {
        const card = buildReviewCard(newReview);
        carousel.appendChild(card);
        buildDots(carousel, dotsEl);
        const userReviews = loadStoredReviews();
        updateGlobalScore([...seedReviews, ...userReviews]);
        // Scroll to new card
        setTimeout(() => scrollToCard(carousel, dotsEl, Math.ceil(carousel.querySelectorAll('.review-card').length / getVisibleCount()) - 1), 100);
      }

      showFeedback('✓ ¡Gracias por tu reseña! Ya aparece en el carrusel.', 'success');
      reviewForm.reset();
      selectedRating = 0;
      starBtns.forEach(b => b.classList.remove('active'));
      setTimeout(hideReviewForm, 2500);
    });
  }

  function showFeedback(msg, type) {
    if (!rfFeedback) return;
    rfFeedback.textContent = msg;
    rfFeedback.className = 'rf-feedback ' + type;
    setTimeout(() => { rfFeedback.textContent = ''; rfFeedback.className = 'rf-feedback'; }, 5000);
  }

  console.log('STUDIO NVF engine loaded. 11 Books + Dynamic Reviews initialized.');
});
