/**
 * ==============================================================================
 * STUDIO NVF - ADMIN DASHBOARD JAVASCRIPT ENGINE
 * Manages: Bookings Calendar, Books & Images CRUD, Live Preview & Supabase Sync
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Toast Notification Utility
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // 2. Navigation Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });

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
      showToast('⚠️ No se pudo guardar: almacenamiento lleno', 'danger');
    }
  }

  loadCatalog();

  /* ==========================================================================
     SECTION 1: CALENDARIO DE RESERVAS
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
      status: 'Pendiente',
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
    updateBookingsBadge();
  }

  function saveBookings() {
    localStorage.setItem('studionvf_bookings', JSON.stringify(bookings));
    updateBookingsBadge();
  }

  function updateBookingsBadge() {
    const badge = document.getElementById('bookingsCountBadge');
    if (badge) {
      const pendingCount = bookings.filter(b => b.status === 'Pendiente').length;
      badge.textContent = pendingCount > 0 ? `${pendingCount} pendientes` : `${bookings.length} citas`;
    }
  }

  loadBookings();

  // Listen for storage events (if user fills form on index.html in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'studionvf_bookings') {
      loadBookings();
      renderCalendar();
      renderBookingsSidebar(selectedDate);
      showToast('🔔 ¡Nueva reserva recibida desde la web!', 'info');
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

    // Clean previous day cells, keeping weekday headers
    const dayCells = calendarGrid.querySelectorAll('.calendar-day-cell');
    dayCells.forEach(cell => cell.remove());

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const todayStr = new Date().toISOString().split('T')[0];

    // Filter selections
    const filterSession = document.getElementById('filterSessionType')?.value || 'all';
    const filterStatus = document.getElementById('filterStatus')?.value || 'all';

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

    // 3. Next month leading days (to complete 35 or 42 grid)
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
    header.innerHTML = `<span class="day-number">${dayNumber}</span>${isToday ? '<span class="today-dot" title="Hoy"></span>' : ''}`;
    cell.appendChild(header);

    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'day-events-list';

    // Match bookings for this day
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
      if (subtitleEl) subtitleEl.textContent = `${filtered.length} reserva(s) programada(s) para este día`;
    } else {
      if (titleEl) titleEl.textContent = 'Todas las Reservas';
      if (subtitleEl) subtitleEl.textContent = `${filtered.length} reserva(s) registradas`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--admin-text-subtle);">
          <div style="font-size: 2rem; margin-bottom: 8px;">📅</div>
          <p style="font-weight: 600; font-size: 0.9rem;">No hay citas agendadas para esta fecha.</p>
          <p style="font-size: 0.78rem; margin-top: 4px;">Usa el botón "+ Nueva Reserva" para agendar una sesión manualmente.</p>
          <button class="btn-secondary" id="btnShowAllBookings" style="margin-top: 14px; font-size: 0.75rem;">
            Ver todas las fechas
          </button>
        </div>
      `;
      const btnShowAll = document.getElementById('btnShowAllBookings');
      if (btnShowAll) {
        btnShowAll.addEventListener('click', () => {
          selectedDate = null;
          renderBookingsSidebar(null);
        });
      }
      return;
    }

    // Sort by date then time
    filtered.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    filtered.forEach(b => {
      const card = document.createElement('div');
      card.className = 'booking-item-card';

      const sClass = getSessionClass(b.session);
      const statusClass = (b.status || 'pendiente').toLowerCase();

      // Clean phone for whatsapp link
      const cleanPhone = (b.phone || '').replace(/[^0-9]/g, '');
      const waMsg = encodeURIComponent(`¡Hola ${b.name}! Te escribo de Studio NVF (Nicole Valerio Fotografía) respecto a tu sesión de ${b.session} para el día ${b.date} a las ${b.time}.`);
      const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMsg}` : `https://wa.me/?text=${waMsg}`;

      card.innerHTML = `
        <div class="booking-item-top">
          <span class="booking-type-badge event-pill ${sClass}">${b.session}</span>
          <span class="booking-status-tag ${statusClass}">${b.status}</span>
        </div>
        <div class="booking-client-name">${b.name}</div>
        <div class="booking-time-row">
          <span>📅 ${b.date}</span>
          <span>⏰ ${b.time || '10:30'}</span>
        </div>
        <div class="booking-contact-row">
          <span>📞 ${b.phone || 'Sin teléfono'}</span>
          <span>✉️ ${b.email || 'Sin correo'}</span>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.302c-.087.087-.178.181-.077.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
            WhatsApp
          </a>
        </div>
        ${b.location ? `<div style="font-size: 0.76rem; color: var(--admin-text-muted);">📍 <strong>Lugar:</strong> ${b.location}</div>` : ''}
        ${b.message ? `<div class="booking-notes">"${b.message}"</div>` : ''}
        <div class="booking-actions-row">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.7rem; color: var(--admin-text-subtle);">Estado:</span>
            <select class="status-dropdown" data-id="${b.id}">
              <option value="Pendiente" ${b.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
              <option value="Confirmada" ${b.status === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
              <option value="Completada" ${b.status === 'Completada' ? 'selected' : ''}>Completada</option>
              <option value="Cancelada" ${b.status === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
            </select>
          </div>
          <button class="btn-danger btn-delete-booking" data-id="${b.id}">Eliminar</button>
        </div>
      `;

      // Event listener for status change
      const statusSelect = card.querySelector('.status-dropdown');
      statusSelect.addEventListener('change', (e) => {
        b.status = e.target.value;
        saveBookings();
        renderCalendar();
        renderBookingsSidebar(dateFilter);
        showToast(`Cita de ${b.name} marcada como ${b.status}`, 'info');
      });

      // Event listener for delete
      const deleteBtn = card.querySelector('.btn-delete-booking');
      deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Estás seguro de eliminar la reserva de ${b.name}?`)) {
          bookings = bookings.filter(item => item.id !== b.id);
          saveBookings();
          renderCalendar();
          renderBookingsSidebar(dateFilter);
          showToast('Reserva eliminada con éxito', 'info');
        }
      });

      container.appendChild(card);
    });
  }

  // Calendar Month Navigation Buttons
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
  const modalNewBooking = document.getElementById('modalNewBooking');
  const btnOpenNewBooking = document.getElementById('btnOpenNewBooking');
  const btnCloseNewBooking = document.getElementById('btnCloseNewBooking');
  const formNewBooking = document.getElementById('formNewBooking');

  if (btnOpenNewBooking && modalNewBooking) {
    btnOpenNewBooking.addEventListener('click', () => {
      if (document.getElementById('newBookingDate')) {
        document.getElementById('newBookingDate').value = selectedDate || new Date().toISOString().split('T')[0];
      }
      modalNewBooking.classList.add('active');
    });
  }

  if (btnCloseNewBooking && modalNewBooking) {
    btnCloseNewBooking.addEventListener('click', () => {
      modalNewBooking.classList.remove('active');
    });
  }

  if (formNewBooking) {
    formNewBooking.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newBookingName').value.trim();
      const email = document.getElementById('newBookingEmail').value.trim();
      const phone = document.getElementById('newBookingPhone').value.trim();
      const session = document.getElementById('newBookingSession').value;
      const date = document.getElementById('newBookingDate').value;
      const time = document.getElementById('newBookingTime').value || '10:30';
      const location = document.getElementById('newBookingLocation').value.trim();
      const message = document.getElementById('newBookingNotes').value.trim();
      const status = document.getElementById('newBookingStatus').value;

      if (!name || !phone || !date) {
        showToast('⚠️ Por favor completa los campos requeridos', 'danger');
        return;
      }

      const newBooking = {
        id: 'book_' + Date.now(),
        name,
        email,
        phone,
        session,
        date,
        time,
        location,
        message,
        status,
        created_at: new Date().toISOString()
      };

      bookings.unshift(newBooking);
      saveBookings();
      selectedDate = date;
      renderCalendar();
      renderBookingsSidebar(date);

      modalNewBooking.classList.remove('active');
      formNewBooking.reset();
      showToast(`✅ Reserva para ${name} (${session}) agendada con éxito!`, 'success');
    });
  }

  // Initial render of calendar
  renderCalendar();
  renderBookingsSidebar(selectedDate);

  /* ==========================================================================
     SECTION 2: GESTOR DE BOOKS & GALERÍA DE FOTOS
     ========================================================================== */
  let activeBookSlug = 'familia';

  const collectionsNavList = document.getElementById('collectionsNavList');

  function renderCollectionsSidebar() {
    if (!collectionsNavList) return;
    collectionsNavList.innerHTML = '';

    const slugs = Object.keys(currentCatalog);

    slugs.forEach(slug => {
      const book = currentCatalog[slug];
      const btn = document.createElement('button');
      btn.className = `collection-nav-item ${slug === activeBookSlug ? 'active' : ''}`;
      btn.setAttribute('data-slug', slug);

      const count = book.photos ? book.photos.length : (book.photoCount || 0);

      btn.innerHTML = `
        <span>${book.title || slug}</span>
        <span class="item-badge">${count} fotos</span>
      `;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.collection-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeBookSlug = slug;
        loadActiveBookData();
      });

      collectionsNavList.appendChild(btn);
    });
  }

  function loadActiveBookData() {
    const book = currentCatalog[activeBookSlug];
    if (!book) return;

    // 1. Form fields
    const titleInput = document.getElementById('bookTitleInput');
    const subtitleInput = document.getElementById('bookSubtitleInput');
    const categoryInput = document.getElementById('bookCategoryInput');
    const coverUrlInput = document.getElementById('bookCoverUrlInput');

    if (titleInput) titleInput.value = book.title || '';
    if (subtitleInput) subtitleInput.value = book.subtitle || '';
    if (categoryInput) categoryInput.value = book.category || 'EDITORIAL';
    if (coverUrlInput) coverUrlInput.value = book.cover || '';

    // 2. Live Preview Card
    updateLivePreview();

    // 3. Photos Grid
    renderBookPhotosGrid();
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

  // Real-time listener on book form inputs to update live preview
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
    renderCollectionsSidebar();
    updateLivePreview();
    showToast(`✅ Cambios guardados para el Book ${book.title}`, 'success');
  });

  // Cover Image File Upload (Local file reader to base64)
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
          showToast('📸 Portada actualizada con éxito', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Render Photos Grid
  function renderBookPhotosGrid() {
    const grid = document.getElementById('galleryPhotosGrid');
    const countLabel = document.getElementById('galleryPhotosCount');
    if (!grid) return;

    grid.innerHTML = '';
    const book = currentCatalog[activeBookSlug];
    if (!book) return;

    const photos = book.photos || [];
    if (countLabel) countLabel.textContent = `${photos.length} fotos`;

    if (photos.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--admin-text-subtle);">
          <p>Esta colección aún no tiene fotos individuales.</p>
          <button class="btn-primary" id="btnEmptyAddPhotos" style="margin-top: 10px;">➕ Agregar Fotos Ahora</button>
        </div>
      `;
      document.getElementById('btnEmptyAddPhotos')?.addEventListener('click', openAddPhotosModal);
      return;
    }

    photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-photo-card';

      const photoUrl = photo.thumb || photo.large || photo.medium || photo.url;
      const isCover = book.cover && (book.cover === photo.large || book.cover === photoUrl);

      card.innerHTML = `
        <img src="${photoUrl}" alt="${photo.name || 'Foto'}" loading="lazy">
        ${isCover ? '<span class="gallery-photo-badge">⭐ PORTADA</span>' : ''}
        <div class="gallery-photo-actions">
          <button class="btn-action-pill btn-make-cover" data-idx="${idx}" title="Definir como portada del Book">⭐ Portada</button>
          <button class="btn-action-pill danger btn-delete-photo" data-idx="${idx}" title="Eliminar foto">🗑️ Borrar</button>
        </div>
      `;

      // Set as cover
      card.querySelector('.btn-make-cover').addEventListener('click', (e) => {
        e.stopPropagation();
        book.cover = photo.large || photoUrl;
        document.getElementById('bookCoverUrlInput').value = book.cover;
        saveCatalog();
        updateLivePreview();
        renderBookPhotosGrid();
        showToast('⭐ Foto asignada como portada de la colección', 'success');
      });

      // Delete photo
      card.querySelector('.btn-delete-photo').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`¿Eliminar la foto "${photo.name || 'seleccionada'}" de esta galería?`)) {
          photos.splice(idx, 1);
          book.photoCount = photos.length;
          saveCatalog();
          renderCollectionsSidebar();
          renderBookPhotosGrid();
          updateLivePreview();
          showToast('Foto eliminada de la galería', 'info');
        }
      });

      grid.appendChild(card);
    });
  }

  // Modal: Agregar Fotos
  const modalAddPhotos = document.getElementById('modalAddPhotos');
  const btnOpenAddPhotos = document.getElementById('btnOpenAddPhotos');
  const btnCloseAddPhotos = document.getElementById('btnCloseAddPhotos');
  const multiFileInput = document.getElementById('multiFileInput');
  const photoUrlInput = document.getElementById('newPhotoUrlInput');
  const btnConfirmAddUrl = document.getElementById('btnConfirmAddUrl');

  function openAddPhotosModal() {
    if (modalAddPhotos) modalAddPhotos.classList.add('active');
  }

  if (btnOpenAddPhotos) btnOpenAddPhotos.addEventListener('click', openAddPhotosModal);
  if (btnCloseAddPhotos) btnCloseAddPhotos.addEventListener('click', () => modalAddPhotos.classList.remove('active'));

  // Multi-file upload via FileReader
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
            renderCollectionsSidebar();
            renderBookPhotosGrid();
            updateLivePreview();
            modalAddPhotos.classList.remove('active');
            multiFileInput.value = '';
            showToast(`✅ Se agregaron ${loadedCount} foto(s) a la colección`, 'success');
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Add via URL
  if (btnConfirmAddUrl && photoUrlInput) {
    btnConfirmAddUrl.addEventListener('click', () => {
      const url = photoUrlInput.value.trim();
      if (!url) {
        showToast('⚠️ Ingresa una URL válida', 'danger');
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
      renderCollectionsSidebar();
      renderBookPhotosGrid();
      updateLivePreview();
      photoUrlInput.value = '';
      modalAddPhotos.classList.remove('active');
      showToast('✅ Foto agregada a la galería', 'success');
    });
  }

  // Reset to default Pixieset catalog
  document.getElementById('btnResetCatalog')?.addEventListener('click', () => {
    if (confirm('¿Restablecer todas las colecciones y fotos a las versiones originales de Pixieset?')) {
      localStorage.removeItem('studionvf_catalog_custom');
      loadCatalog();
      renderCollectionsSidebar();
      loadActiveBookData();
      showToast('Colecciones restablecidas al catálogo original', 'info');
    }
  });

  // Initial render of Books section
  renderCollectionsSidebar();
  loadActiveBookData();

  /* ==========================================================================
     SECTION 3: SUPABASE SQL VIEWER & COPY
     ========================================================================== */
  const btnCopySql = document.getElementById('btnCopySql');
  const sqlCodeElement = document.getElementById('sqlCodeBlock');

  if (btnCopySql && sqlCodeElement) {
    btnCopySql.addEventListener('click', () => {
      const sqlText = sqlCodeElement.textContent;
      navigator.clipboard.writeText(sqlText).then(() => {
        const originalText = btnCopySql.textContent;
        btnCopySql.textContent = '✅ ¡SQL Copiado al Portapapeles!';
        btnCopySql.style.backgroundColor = '#2E7D32';
        btnCopySql.style.color = '#FFF';
        setTimeout(() => {
          btnCopySql.textContent = originalText;
          btnCopySql.style.backgroundColor = '';
          btnCopySql.style.color = '';
        }, 3000);
        showToast('📋 Script SQL copiado al portapapeles', 'success');
      }).catch(err => {
        showToast('⚠️ Error al copiar al portapapeles', 'danger');
      });
    });
  }

  /* ==========================================================================
     SECTION 4: BACKUP & EXPORT JSON
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
    showToast('💾 Respaldo JSON descargado con éxito', 'success');
  });

});
