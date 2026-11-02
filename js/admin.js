/**
 * ==============================================================================
 * STUDIO NVF - ADMIN DASHBOARD (Bootstrap 5 Engine)
 * Nicole Valerio Fotografía Editorial
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Toast Notification Utility (Bootstrap 5)
  const toastEl = document.getElementById('liveToast');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message, isSuccess = true) {
    if (toastMsg) {
      toastMsg.innerHTML = `
        <i class="bi ${isSuccess ? 'bi-check-circle-fill text-warning' : 'bi-exclamation-triangle-fill text-danger'} fs-5"></i>
        <span>${message}</span>
      `;
    }
    if (toastEl && window.bootstrap) {
      const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl);
      bsToast.show();
    }
  }

  /* ==========================================================================
     CATALOG & STATE MANAGEMENT
     ========================================================================== */
  const defaultCatalog = window.STUDIO_NVF_CATALOG || {};
  let currentCatalog = {};

  function loadCatalog() {
    try {
      const savedCustom = localStorage.getItem('studionvf_catalog_custom');
      if (savedCustom) {
        currentCatalog = { ...defaultCatalog, ...JSON.parse(savedCustom) };
      } else {
        currentCatalog = JSON.parse(JSON.stringify(defaultCatalog));
      }
    } catch (e) {
      console.error('Error reading catalog:', e);
      currentCatalog = JSON.parse(JSON.stringify(defaultCatalog));
    }
  }

  function saveCatalog() {
    try {
      localStorage.setItem('studionvf_catalog_custom', JSON.stringify(currentCatalog));
    } catch (e) {
      console.error('Error saving catalog to localStorage:', e);
      showToast('No se pudo guardar: almacenamiento lleno', false);
    }
  }

  loadCatalog();

  /* ==========================================================================
     SECTION 1: CALENDARIO DE RESERVAS & CITAS
     ========================================================================== */
  const initialSampleBookings = [
    {
      id: 'book_sample_1',
      name: 'Sofía Valenzuela & Familia',
      email: 'sofia.valenzuela@gmail.com',
      phone: '+506 8834 9120',
      session: 'Familia',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // En 2 días
      time: '10:30',
      location: 'Estudio NVF & Jardín Botánico',
      message: 'Sesión familiar con abuelos y 3 nietos (total 6 personas). Queremos fotos espontáneas y luz natural.',
      status: 'Confirmada',
      created_at: new Date().toISOString()
    },
    {
      id: 'book_sample_2',
      name: 'Camila & Alejandro',
      email: 'camila.boda@outlook.com',
      phone: '+506 7012 4455',
      session: 'Boda',
      date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // En 5 días
      time: '15:30',
      location: 'Parroquia San Isidro & Hotel Intercontinental',
      message: 'Ceremonia religiosa y recepción de boda de autor. Cobertura cinematográfica completa.',
      status: 'Confirmada',
      created_at: new Date().toISOString()
    },
    {
      id: 'book_sample_3',
      name: 'Valeria Morales',
      email: 'valeria.m@icloud.com',
      phone: '+506 8399 1102',
      session: 'Embarazo',
      date: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0], // En 8 días
      time: '16:30',
      location: 'Estudio NVF (Luz dorada)',
      message: 'Sesión de maternidad semana 32. Estilo editorial minimalist con traje sastre y fondos limpios.',
      status: 'Pendiente',
      created_at: new Date().toISOString()
    },
    {
      id: 'book_sample_4',
      name: 'Mateo (Cumpleaños 1 Año)',
      email: 'mariana.mama@gmail.com',
      phone: '+506 6055 8989',
      session: 'Cumpleaños',
      date: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0], // En 12 días
      time: '09:30',
      location: 'Parque de la Paz / Bosque',
      message: 'Celebración de primer año con letras UNO y escalera rústica en bosque de cipreses.',
      status: 'Confirmada',
      created_at: new Date().toISOString()
    }
  ];

  let bookings = [];

  function loadBookings() {
    try {
      const stored = localStorage.getItem('studionvf_bookings');
      if (stored) {
        bookings = JSON.parse(stored);
      } else {
        bookings = initialSampleBookings;
        localStorage.setItem('studionvf_bookings', JSON.stringify(bookings));
      }
    } catch (e) {
      bookings = initialSampleBookings;
    }
    updateKPIs();
  }

  function saveBookings() {
    localStorage.setItem('studionvf_bookings', JSON.stringify(bookings));
    updateKPIs();
  }

  function updateKPIs() {
    const pendingCount = bookings.filter(b => b.status === 'Pendiente').length;
    const confirmedCount = bookings.filter(b => b.status === 'Confirmada').length;

    const kpiPending = document.getElementById('kpiPendingCount');
    const kpiConfirmed = document.getElementById('kpiConfirmedCount');
    const tabBadge = document.getElementById('tabBookingsCountBadge');

    if (kpiPending) kpiPending.textContent = pendingCount;
    if (kpiConfirmed) kpiConfirmed.textContent = confirmedCount;
    if (tabBadge) tabBadge.textContent = bookings.length;
  }

  loadBookings();

  // Listen for storage changes from public website
  window.addEventListener('storage', (e) => {
    if (e.key === 'studionvf_bookings') {
      loadBookings();
      renderCalendar();
      renderBookingsSidebar(selectedDate);
      showToast('🔔 ¡Nueva solicitud de reserva recibida desde la web!', true);
    }
  });

  // Calendar State
  let currentMonthDate = new Date();
  let selectedDate = new Date().toISOString().split('T')[0];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function getSessionClass(sessionName) {
    if (!sessionName) return 'default';
    const s = sessionName.toLowerCase();
    if (s.includes('familia')) return 'familia';
    if (s.includes('boda')) return 'boda';
    if (s.includes('embarazo') || s.includes('maternidad')) return 'embarazo';
    if (s.includes('cumple')) return 'cumpleanos';
    if (s.includes('marca')) return 'marcapersonal';
    if (s.includes('playa')) return 'parejasplaya';
    if (s.includes('pareja')) return 'parejas';
    if (s.includes('revelaci')) return 'revelacion';
    if (s.includes('evento')) return 'eventos';
    if (s.includes('gastro')) return 'gastronomia';
    if (s.includes('navidad')) return 'navidad';
    return 'default';
  }

  function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonthLabel');
    if (!calendarGrid || !monthLabel) return;

    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    monthLabel.textContent = `${monthNames[month]} ${year}`;

    // Clean previous day cells
    const dayCells = calendarGrid.querySelectorAll('.calendar-day-cell');
    dayCells.forEach(cell => cell.remove());

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const cellDate = new Date(year, month - 1, dayNum).toISOString().split('T')[0];
      calendarGrid.appendChild(createDayCell(dayNum, cellDate, true));
    }

    // 2. Current month days
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const cellDate = new Date(year, month, day).toISOString().split('T')[0];
      const cell = createDayCell(day, cellDate, false, cellDate === todayStr, cellDate === selectedDate);
      calendarGrid.appendChild(cell);
    }

    // 3. Next month leading days (to complete grid)
    const totalRendered = firstDayIndex + lastDayOfMonth;
    const remaining = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
    for (let day = 1; day <= remaining; day++) {
      const cellDate = new Date(year, month + 1, day).toISOString().split('T')[0];
      calendarGrid.appendChild(createDayCell(day, cellDate, true));
    }
  }

  function createDayCell(dayNumber, dateStr, isOtherMonth, isToday = false, isSelected = false) {
    const cell = document.createElement('div');
    cell.className = `calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
    cell.setAttribute('data-date', dateStr);

    const header = document.createElement('div');
    header.className = 'day-cell-header';
    header.innerHTML = `
      <span class="day-number">${dayNumber}</span>
      ${isToday ? '<span class="today-dot" title="Hoy"></span>' : ''}
    `;
    cell.appendChild(header);

    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'day-events-list';

    // Filters
    const filterSession = document.getElementById('filterSessionType')?.value || 'all';
    const filterStatus = document.getElementById('filterStatus')?.value || 'all';

    const dayBookings = bookings.filter(b => {
      if (b.date !== dateStr) return false;
      if (filterSession !== 'all' && b.session !== filterSession) return false;
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      return true;
    });

    dayBookings.forEach(b => {
      const pill = document.createElement('div');
      const sClass = getSessionClass(b.session);
      pill.className = `event-pill ${sClass}`;
      pill.title = `${b.time || '10:30'} · ${b.name} (${b.session}) - ${b.status}`;
      pill.innerHTML = `<strong>${b.time || '10:30'}</strong> <span>${b.session}</span>`;
      eventsContainer.appendChild(pill);
    });

    cell.appendChild(eventsContainer);

    cell.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      selectedDate = dateStr;
      renderBookingsSidebar(dateStr);
    });

    return cell;
  }

  function renderBookingsSidebar(dateFilter = null) {
    const container = document.getElementById('bookingsListContainer');
    const titleEl = document.getElementById('sidebarTitle');
    const subtitleEl = document.getElementById('sidebarSubtitle');
    if (!container) return;

    container.innerHTML = '';

    const filterSession = document.getElementById('filterSessionType')?.value || 'all';
    const filterStatus = document.getElementById('filterStatus')?.value || 'all';

    let filtered = bookings.filter(b => {
      if (dateFilter && b.date !== dateFilter) return false;
      if (filterSession !== 'all' && b.session !== filterSession) return false;
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      return true;
    });

    if (dateFilter) {
      if (titleEl) titleEl.textContent = `Citas: ${dateFilter}`;
      if (subtitleEl) subtitleEl.textContent = `${filtered.length} cita(s) programada(s) para este día`;
    } else {
      if (titleEl) titleEl.textContent = 'Todas las Citas';
      if (subtitleEl) subtitleEl.textContent = `${filtered.length} cita(s) en total`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-calendar-x fs-1 text-secondary opacity-50 mb-2"></i>
          <p class="fw-bold mb-1">No hay citas para esta fecha</p>
          <p class="small text-muted mb-3">Puedes presionar el botón de abajo para ver todas las citas registradas.</p>
          <button class="btn btn-outline-dark btn-sm rounded-pill px-3" id="btnShowAllBookings">
            Ver todas las citas
          </button>
        </div>
      `;
      document.getElementById('btnShowAllBookings')?.addEventListener('click', () => {
        selectedDate = null;
        renderBookingsSidebar(null);
      });
      return;
    }

    // Sort by date then time
    filtered.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    filtered.forEach(b => {
      const card = document.createElement('div');
      card.className = 'booking-item-card';

      const sClass = getSessionClass(b.session);
      const isConfirmed = b.status === 'Confirmada';
      const isPending = b.status === 'Pendiente';

      const cleanPhone = (b.phone || '').replace(/[^0-9]/g, '');
      const waMsg = encodeURIComponent(`¡Hola ${b.name}! Te escribe Nicole Valerio de Studio NVF respecto a tu sesión de ${b.session} para el día ${b.date} a las ${b.time}.`);
      const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMsg}` : `https://wa.me/?text=${waMsg}`;

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <span class="event-pill ${sClass} px-2 py-1">${b.session}</span>
          <span class="badge ${isConfirmed ? 'bg-success' : (isPending ? 'bg-warning text-dark' : 'bg-secondary')} small">
            ${b.status}
          </span>
        </div>

        <div>
          <h6 class="fw-bold text-dark m-0">${b.name}</h6>
          <div class="small text-muted mt-1 d-flex align-items-center gap-3">
            <span><i class="bi bi-calendar-event me-1"></i>${b.date}</span>
            <span><i class="bi bi-clock me-1"></i>${b.time || '10:30'}</span>
          </div>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2 pt-1">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm py-1 px-2 d-inline-flex align-items-center gap-1 text-decoration-none" style="font-size: 0.75rem;">
            <i class="bi bi-whatsapp"></i> WhatsApp
          </a>
          <span class="small text-muted"><i class="bi bi-telephone me-1"></i>${b.phone || 'Sin teléfono'}</span>
        </div>

        ${b.location ? `<div class="small text-secondary"><i class="bi bi-geo-alt me-1"></i>${b.location}</div>` : ''}
        ${b.message ? `<div class="small fst-italic text-muted bg-light p-2 rounded">"${b.message}"</div>` : ''}

        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
          <div class="d-flex align-items-center gap-1">
            <small class="text-muted">Estado:</small>
            <select class="form-select form-select-sm py-0 status-changer-select" data-id="${b.id}" style="font-size: 0.75rem; width: auto;">
              <option value="Pendiente" ${b.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
              <option value="Confirmada" ${b.status === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
              <option value="Completada" ${b.status === 'Completada' ? 'selected' : ''}>Completada</option>
              <option value="Cancelada" ${b.status === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
            </select>
          </div>
          <button class="btn btn-outline-danger btn-sm py-0 px-2 btn-delete-booking" data-id="${b.id}" style="font-size: 0.75rem;">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;

      // Status selector
      card.querySelector('.status-changer-select').addEventListener('change', (e) => {
        b.status = e.target.value;
        saveBookings();
        renderCalendar();
        renderBookingsSidebar(dateFilter);
        showToast(`Cita de ${b.name} marcada como ${b.status}`, true);
      });

      // Delete button
      card.querySelector('.btn-delete-booking').addEventListener('click', () => {
        if (confirm(`¿Estás segura de eliminar la cita de ${b.name}?`)) {
          bookings = bookings.filter(item => item.id !== b.id);
          saveBookings();
          renderCalendar();
          renderBookingsSidebar(dateFilter);
          showToast('Cita eliminada correctamente', true);
        }
      });

      container.appendChild(card);
    });
  }

  // Month navigation buttons
  document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
    currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
    currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById('todayMonthBtn')?.addEventListener('click', () => {
    currentMonthDate = new Date();
    selectedDate = new Date().toISOString().split('T')[0];
    renderCalendar();
    renderBookingsSidebar(selectedDate);
  });

  document.getElementById('filterSessionType')?.addEventListener('change', () => {
    renderCalendar();
    renderBookingsSidebar(selectedDate);
  });

  document.getElementById('filterStatus')?.addEventListener('change', () => {
    renderCalendar();
    renderBookingsSidebar(selectedDate);
  });

  // Modal: Nueva Reserva Manual
  const formNewBooking = document.getElementById('formNewBooking');
  if (formNewBooking) {
    // Default today date
    const dateInput = document.getElementById('newBookingDate');
    if (dateInput) dateInput.value = selectedDate || new Date().toISOString().split('T')[0];

    formNewBooking.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newBookingName').value.trim();
      const phone = document.getElementById('newBookingPhone').value.trim();
      const email = document.getElementById('newBookingEmail').value.trim();
      const session = document.getElementById('newBookingSession').value;
      const status = document.getElementById('newBookingStatus').value;
      const date = document.getElementById('newBookingDate').value;
      const time = document.getElementById('newBookingTime').value || '10:30';
      const location = document.getElementById('newBookingLocation').value.trim();
      const message = document.getElementById('newBookingNotes').value.trim();

      if (!name || !phone || !date) {
        showToast('Por favor completa nombre, teléfono y fecha', false);
        return;
      }

      const newBooking = {
        id: 'book_' + Date.now(),
        name,
        phone,
        email,
        session,
        status,
        date,
        time,
        location,
        message,
        created_at: new Date().toISOString()
      };

      bookings.unshift(newBooking);
      saveBookings();
      selectedDate = date;
      renderCalendar();
      renderBookingsSidebar(date);

      // Close Bootstrap Modal
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalNewBooking'));
      if (modalInstance) modalInstance.hide();

      formNewBooking.reset();
      showToast(`¡Cita para ${name} (${session}) agendada con éxito!`, true);
    });
  }

  // Initial Calendar Render
  renderCalendar();
  renderBookingsSidebar(selectedDate);

  /* ==========================================================================
     SECTION 2: GESTOR DE BOOKS & FOTOS
     ========================================================================== */
  let activeBookSlug = 'familia';

  const collectionsCardsRow = document.getElementById('collectionsCardsRow');

  function renderCollectionsSelector() {
    if (!collectionsCardsRow) return;
    collectionsCardsRow.innerHTML = '';

    const slugs = Object.keys(currentCatalog);

    slugs.forEach(slug => {
      const book = currentCatalog[slug];
      const count = book.photos ? book.photos.length : (book.photoCount || 0);
      const isSelected = slug === activeBookSlug;

      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="book-catalog-card ${isSelected ? 'active-book' : ''}" data-slug="${slug}">
          <div class="book-card-thumbnail-wrap">
            <span class="book-card-badge">${book.badge_number || '01'}</span>
            <img src="${book.cover}" alt="${book.title}" loading="lazy">
          </div>
          <div class="p-2 text-center">
            <div class="fw-bold text-dark small text-truncate">${book.title}</div>
            <div class="text-muted" style="font-size: 0.7rem;">${count} fotos</div>
          </div>
        </div>
      `;

      col.querySelector('.book-catalog-card').addEventListener('click', () => {
        document.querySelectorAll('.book-catalog-card').forEach(c => c.classList.remove('active-book'));
        col.querySelector('.book-catalog-card').classList.add('active-book');
        activeBookSlug = slug;
        loadActiveBookData();
      });

      collectionsCardsRow.appendChild(col);
    });
  }

  function loadActiveBookData() {
    const book = currentCatalog[activeBookSlug];
    if (!book) return;

    // Header
    const titleHeader = document.getElementById('inspectorBookTitleHeader');
    if (titleHeader) titleHeader.innerHTML = `<i class="bi bi-pencil-square text-warning me-2"></i>Editar Book: <em>${book.title}</em>`;

    // Form fields
    const titleInput = document.getElementById('bookTitleInput');
    const subtitleInput = document.getElementById('bookSubtitleInput');
    const categoryInput = document.getElementById('bookCategoryInput');
    const coverUrlInput = document.getElementById('bookCoverUrlInput');

    if (titleInput) titleInput.value = book.title || '';
    if (subtitleInput) subtitleInput.value = book.subtitle || '';
    if (categoryInput) categoryInput.value = book.category || 'EDITORIAL';
    if (coverUrlInput) coverUrlInput.value = book.cover || '';

    // Live preview
    updateLivePreview();

    // Photos grid
    renderGalleryPhotos();
  }

  function updateLivePreview() {
    const book = currentCatalog[activeBookSlug];
    if (!book) return;

    const previewTitle = document.getElementById('mockupTitle');
    const previewCount = document.getElementById('mockupCount');
    const previewImg = document.getElementById('mockupImg');
    const previewMarker = document.getElementById('mockupMarker');

    const titleInput = document.getElementById('bookTitleInput');
    const currentTitle = titleInput ? titleInput.value : book.title;

    const coverInput = document.getElementById('bookCoverUrlInput');
    const currentCover = coverInput ? coverInput.value : book.cover;

    const count = book.photos ? book.photos.length : (book.photoCount || 0);

    if (previewTitle) previewTitle.innerHTML = `<em>${currentTitle}</em>`;
    if (previewCount) previewCount.textContent = `${count} FOTOGRAFÍAS`;
    if (previewImg) previewImg.src = currentCover || book.cover;
    if (previewMarker) previewMarker.textContent = book.badge_number || '01';
  }

  // Live input sync
  document.getElementById('bookTitleInput')?.addEventListener('input', updateLivePreview);
  document.getElementById('bookCoverUrlInput')?.addEventListener('input', updateLivePreview);

  // Save Book Metadata
  document.getElementById('btnSaveBookMeta')?.addEventListener('click', () => {
    const book = currentCatalog[activeBookSlug];
    if (!book) return;

    book.title = document.getElementById('bookTitleInput').value.trim();
    book.subtitle = document.getElementById('bookSubtitleInput').value.trim();
    book.category = document.getElementById('bookCategoryInput').value.trim();
    book.cover = document.getElementById('bookCoverUrlInput').value.trim();

    saveCatalog();
    renderCollectionsSelector();
    updateLivePreview();
    showToast(`✅ Portada y datos de "${book.title}" guardados con éxito`, true);
  });

  // Local File Upload for Cover
  const coverFileInput = document.getElementById('coverFileInput');
  if (coverFileInput) {
    coverFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        const coverInput = document.getElementById('bookCoverUrlInput');
        if (coverInput) coverInput.value = base64Url;

        const book = currentCatalog[activeBookSlug];
        if (book) {
          book.cover = base64Url;
          saveCatalog();
          updateLivePreview();
          renderCollectionsSelector();
          showToast('📸 Foto de portada actualizada desde tu PC', true);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Render Gallery Photos Grid
  function renderGalleryPhotos() {
    const grid = document.getElementById('galleryPhotosGrid');
    const countBadge = document.getElementById('galleryPhotosCount');
    if (!grid) return;

    grid.innerHTML = '';
    const book = currentCatalog[activeBookSlug];
    if (!book) return;

    const photos = book.photos || [];
    if (countBadge) countBadge.textContent = `${photos.length} fotos`;

    if (photos.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-4 text-muted">
          <i class="bi bi-images fs-2 text-secondary mb-2"></i>
          <p class="small mb-2">Esta colección aún no tiene fotos individuales cargadas.</p>
          <button class="btn btn-gold btn-sm" data-bs-toggle="modal" data-bs-target="#modalAddPhotos">
            Subir Fotos Ahora
          </button>
        </div>
      `;
      return;
    }

    photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-photo-item';

      const photoUrl = photo.thumb || photo.large || photo.medium || photo.url;
      const isCover = book.cover && (book.cover === photo.large || book.cover === photoUrl);

      card.innerHTML = `
        <img src="${photoUrl}" alt="${photo.name || 'Foto'}" loading="lazy">
        ${isCover ? '<span class="badge-is-cover">⭐ PORTADA</span>' : ''}
        <div class="gallery-photo-overlay-actions">
          <button class="btn btn-warning btn-sm py-1 px-2 fw-bold text-dark btn-make-cover" data-idx="${idx}" style="font-size: 0.7rem;">
            ⭐ Portada
          </button>
          <button class="btn btn-danger btn-sm py-1 px-2 btn-delete-photo" data-idx="${idx}" style="font-size: 0.7rem;">
            <i class="bi bi-trash"></i> Borrar
          </button>
        </div>
      `;

      // Set as cover
      card.querySelector('.btn-make-cover').addEventListener('click', (e) => {
        e.stopPropagation();
        book.cover = photo.large || photoUrl;
        document.getElementById('bookCoverUrlInput').value = book.cover;
        saveCatalog();
        updateLivePreview();
        renderCollectionsSelector();
        renderGalleryPhotos();
        showToast('⭐ Foto seleccionada como portada del Book', true);
      });

      // Delete photo
      card.querySelector('.btn-delete-photo').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`¿Eliminar la foto "${photo.name || 'seleccionada'}" de esta colección?`)) {
          photos.splice(idx, 1);
          book.photoCount = photos.length;
          saveCatalog();
          renderCollectionsSelector();
          renderGalleryPhotos();
          updateLivePreview();
          showToast('Foto eliminada de la colección', true);
        }
      });

      grid.appendChild(card);
    });
  }

  // Upload Photos (Multi-file & URL)
  const multiFileInput = document.getElementById('multiFileInput');
  if (multiFileInput) {
    multiFileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const book = currentCatalog[activeBookSlug];
      if (!book) return;
      if (!book.photos) book.photos = [];

      let loadedCount = 0;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          book.photos.unshift({
            id: Date.now() + Math.random(),
            name: file.name,
            large: base64,
            thumb: base64,
            width: 2400,
            height: 3600
          });
          loadedCount++;
          if (loadedCount === files.length) {
            book.photoCount = book.photos.length;
            saveCatalog();
            renderCollectionsSelector();
            renderGalleryPhotos();
            updateLivePreview();
            
            // Close modal
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalAddPhotos'));
            if (modalInstance) modalInstance.hide();
            multiFileInput.value = '';

            showToast(`¡Se subieron ${loadedCount} foto(s) nuevas con éxito!`, true);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Add via URL
  document.getElementById('btnConfirmAddUrl')?.addEventListener('click', () => {
    const urlInput = document.getElementById('newPhotoUrlInput');
    const url = urlInput ? urlInput.value.trim() : '';

    if (!url) {
      showToast('Ingresa una URL válida', false);
      return;
    }

    const book = currentCatalog[activeBookSlug];
    if (!book) return;
    if (!book.photos) book.photos = [];

    book.photos.unshift({
      id: Date.now(),
      name: `Foto_${book.photos.length + 1}.jpg`,
      large: url,
      thumb: url,
      width: 2400,
      height: 3600
    });
    book.photoCount = book.photos.length;

    saveCatalog();
    renderCollectionsSelector();
    renderGalleryPhotos();
    updateLivePreview();

    urlInput.value = '';
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalAddPhotos'));
    if (modalInstance) modalInstance.hide();

    showToast('Foto agregada a la galería', true);
  });

  // Restore Pixieset original photos
  document.getElementById('btnResetCatalog')?.addEventListener('click', () => {
    if (confirm('¿Restaurar todas las fotos y portadas originales de Pixieset?')) {
      localStorage.removeItem('studionvf_catalog_custom');
      loadCatalog();
      renderCollectionsSelector();
      loadActiveBookData();
      showToast('Fotos restauradas al catálogo original', true);
    }
  });

  // Initial Book Render
  renderCollectionsSelector();
  loadActiveBookData();

  /* ==========================================================================
     SECTION 3: SUPABASE SQL COPY
     ========================================================================== */
  document.getElementById('btnCopySql')?.addEventListener('click', () => {
    const codeEl = document.getElementById('sqlCodeBlock');
    if (!codeEl) return;

    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      showToast('📋 Código SQL copiado al portapapeles', true);
    }).catch(() => {
      showToast('Error al copiar el código', false);
    });
  });

  /* ==========================================================================
     SECTION 4: BACKUP EXPORT
     ========================================================================== */
  document.getElementById('btnExportBackup')?.addEventListener('click', () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      catalog: currentCatalog,
      bookings: bookings
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studionvf_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Copia de seguridad descargada', true);
  });

});
