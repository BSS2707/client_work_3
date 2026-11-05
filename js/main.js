/**
 * Shree Rukmamba Nrityalaya (SRN Bharatanatyam)
 * Master Client-side JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DARK / LIGHT THEME TOGGLE CONTROLLER
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'dark' matching the primary reference UI
  const savedTheme = localStorage.getItem('srn_theme') || 'dark';
  applyTheme(savedTheme, false);

  function applyTheme(theme, notify = true) {
    htmlRoot.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('srn_theme', theme);

    if (themeToggleBtn) {
      if (theme === 'dark') {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
      } else {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
      }
    }

    if (notify) {
      showToast(theme === 'dark' ? 'Dark Temple Ambiance Activated' : 'Light Sandalwood Theme Activated');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });

    // Keyboard accessibility support
    themeToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggleBtn.click();
      }
    });
  }

  // ==========================================
  // 2. REAL INTERACTIVE LEAFLET MAP
  // ==========================================
  // Exact Academy Location:
  // Shop No. 48, Ground Floor, Time Square, Gaurav Path Road, Pal, Surat, Gujarat, India.
  const academyLat = 21.1958;
  const academyLng = 72.7845;
  const mapContainer = document.getElementById('srnMap');

  if (mapContainer && typeof L !== 'undefined') {
    try {
      const map = L.map('srnMap', {
        scrollWheelZoom: false, // Prevents unintended zoom during page scroll
        attributionControl: true
      }).setView([academyLat, academyLng], 16);

      // OpenStreetMap live tile layer with required attribution
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom Gold-rimmed Marker
      const customMarkerIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="marker-pin-outer">
            <div class="marker-pin-inner">❖</div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 44],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([academyLat, academyLng], { icon: customMarkerIcon }).addTo(map);

      marker.bindPopup(`
        <div class="srn-map-popup">
          <div class="popup-badge">SRN Academy Center</div>
          <h4 class="popup-title">SRN Bharatanatyam</h4>
          <p class="popup-sub">Shree Rukmamba Nrityalaya</p>
          <p class="popup-address">
            Shop No. 48, Ground Floor, Time Square,<br>
            Gaurav Path Road, Pal, Surat, Gujarat, India.
          </p>
          <a href="https://maps.google.com/?q=Shop+No.+48,+Ground+Floor,+Time+Square,+Gaurav+Path+Road,+Pal,+Surat,+Gujarat" target="_blank" rel="noopener noreferrer" class="popup-btn">
            Get Directions in Google Maps ↗
          </a>
        </div>
      `).openPopup();

      // Recalculate dimensions on window resize
      window.addEventListener('resize', () => {
        map.invalidateSize();
      });
    } catch (err) {
      console.warn('Leaflet map initialization notice:', err);
    }
  }

  // ==========================================
  // 3. AUDIO & MUSIC CONTROLLER
  // ==========================================
  const audioPlayer = document.getElementById('srnAudioPlayer');
  const btnMusicNav = document.getElementById('btnMusicNav');
  const btnMusicText = document.getElementById('btnMusicText');
  const btnPlayPauseFloating = document.getElementById('btnPlayPauseFloating');
  const soundWaveBars = document.getElementById('soundWaveBars');

  let isPlaying = false;

  function updateMusicUI(playing) {
    isPlaying = playing;
    if (playing) {
      if (btnMusicNav) {
        btnMusicNav.classList.add('is-playing');
        btnMusicNav.setAttribute('aria-label', 'Stop Music');
        if (btnMusicText) btnMusicText.textContent = 'Stop Music';
      }
      if (btnPlayPauseFloating) {
        btnPlayPauseFloating.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"></rect>
          </svg>
        `;
        btnPlayPauseFloating.setAttribute('aria-label', 'Stop Music');
      }
      if (soundWaveBars) {
        soundWaveBars.classList.add('animated');
      }
    } else {
      if (btnMusicNav) {
        btnMusicNav.classList.remove('is-playing');
        btnMusicNav.setAttribute('aria-label', 'Play Music');
        if (btnMusicText) btnMusicText.textContent = 'Play Music';
      }
      if (btnPlayPauseFloating) {
        btnPlayPauseFloating.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
        btnPlayPauseFloating.setAttribute('aria-label', 'Play Music');
      }
      if (soundWaveBars) {
        soundWaveBars.classList.remove('animated');
      }
    }
  }

  function toggleAudio() {
    if (!audioPlayer) return;

    if (isPlaying) {
      audioPlayer.pause();
      updateMusicUI(false);
      showToast('Music paused');
    } else {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateMusicUI(true);
            showToast('Now playing: Sri Venkateswara Suprabhatham');
          })
          .catch((err) => {
            console.warn('Playback prevented by browser policy or error:', err);
            updateMusicUI(false);
            showToast('Please interact with the page to start audio.');
          });
      }
    }
  }

  if (btnMusicNav) {
    btnMusicNav.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAudio();
    });
  }

  if (btnPlayPauseFloating) {
    btnPlayPauseFloating.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAudio();
    });
  }

  if (audioPlayer) {
    audioPlayer.addEventListener('ended', () => updateMusicUI(false));
    audioPlayer.addEventListener('pause', () => updateMusicUI(false));
    audioPlayer.addEventListener('play', () => updateMusicUI(true));
    audioPlayer.addEventListener('error', (e) => {
      console.warn('Audio resource error, handling gracefully:', e);
      updateMusicUI(false);
    });
  }

  const loadingScreen = document.getElementById('loadingScreen');
  const loadingProgressBar = loadingScreen?.querySelector('.loading-progress');
  const loadingProgressFill = loadingProgressBar?.querySelector('span');
  const loadingPercent = loadingScreen?.querySelector('.loading-percent');
  const loadingStages = [10, 25, 55, 75];
  const loadingStartedAt = Date.now();
  const minimumLoadingDuration = 2000;
  let loadingStageIndex = 0;
  let loadingFallbackTimer;
  let loadingProgressTimer;
  let loadingFinishTimer;
  let loadingCompletionScheduled = false;

  function updateLoadingProgress(percent) {
    if (!loadingProgressBar || !loadingProgressFill || !loadingPercent) return;
    loadingProgressBar.setAttribute('aria-valuenow', String(percent));
    loadingProgressFill.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;
  }

  function hideLoadingScreen() {
    if (!loadingScreen) return;
    loadingScreen.classList.add('is-hidden');
    loadingScreen.setAttribute('aria-hidden', 'true');
    window.clearTimeout(loadingFallbackTimer);
    window.clearTimeout(loadingFinishTimer);
    window.clearInterval(loadingProgressTimer);
  }

  function finishLoadingScreen() {
    if (!loadingScreen || loadingCompletionScheduled) return;
    loadingCompletionScheduled = true;
    const remainingTime = Math.max(0, minimumLoadingDuration - (Date.now() - loadingStartedAt));
    loadingFinishTimer = window.setTimeout(() => {
      window.clearInterval(loadingProgressTimer);
      updateLoadingProgress(100);
      window.setTimeout(hideLoadingScreen, 500);
    }, remainingTime);
  }

  loadingProgressTimer = window.setInterval(() => {
    if (loadingStageIndex >= loadingStages.length) {
      window.clearInterval(loadingProgressTimer);
      return;
    }
    updateLoadingProgress(loadingStages[loadingStageIndex]);
    loadingStageIndex += 1;
  }, 400);
  loadingFallbackTimer = window.setTimeout(finishLoadingScreen, 7000);
  window.addEventListener('load', () => {
    finishLoadingScreen();
    const autoplayPromise = audioPlayer?.play();
    autoplayPromise?.catch(() => updateMusicUI(false));
  }, { once: true });

  // ==========================================
  // 4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
  // ==========================================
  const navbar = document.querySelector('.srn-navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Spy
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 5. RESPONSIVE MOBILE NAVIGATION DRAWER
  // ==========================================
  const btnMobileNavToggle = document.getElementById('btnMobileNavToggle');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const btnCloseMobileNav = document.getElementById('btnCloseMobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-drawer-footer a');

  function openMobileMenu() {
    mobileMenuDrawer?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuDrawer?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnMobileNavToggle) {
    btnMobileNavToggle.addEventListener('click', () => {
      if (mobileMenuDrawer?.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (btnCloseMobileNav) btnCloseMobileNav.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ==========================================
  // 6. MUDRA MANDALA INTERACTIVE FEEDBACK
  // ==========================================
  const mudraNodes = document.querySelectorAll('.mudra-node');
  mudraNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const name = node.getAttribute('data-mudra');
      const title = node.getAttribute('title');
      if (title) {
        showToast(title);
      }
    });
  });

  // ==========================================
  // 7. CURRICULUM SCHEDULE MODAL
  // ==========================================
  const scheduleModal = document.getElementById('scheduleModal');
  const btnCloseSchedule = document.getElementById('btnCloseSchedule');
  const modalScheduleTitle = document.getElementById('modalScheduleTitle');
  const modalScheduleSub = document.getElementById('modalScheduleSub');
  const scheduleTableBody = document.getElementById('scheduleTableBody');
  const btnScheduleEnroll = document.getElementById('btnScheduleEnroll');

  const courseSchedules = {
    beginner: {
      title: 'Beginner Curriculum Schedule',
      subtitle: 'Foundation & Adavus • Ages 5+ & Novices',
      rows: [
        { batch: 'Weekday Morning', days: 'Tuesday & Thursday', time: '8:00 AM – 9:30 AM', guru: 'Senior Guru' },
        { batch: 'Weekday Evening', days: 'Monday & Wednesday', time: '5:00 PM – 6:30 PM', guru: 'Faculty Member' },
        { batch: 'Weekend Intensive', days: 'Saturday & Sunday', time: '9:00 AM – 10:30 AM', guru: 'Academy Guru' }
      ]
    },
    intermediate: {
      title: 'Intermediate Curriculum Schedule',
      subtitle: 'Jathis, Korvais & Varnam • 2+ Years Experience',
      rows: [
        { batch: 'Weekday Batch A', days: 'Monday & Wednesday', time: '6:30 PM – 8:00 PM', guru: 'Principal Guru' },
        { batch: 'Weekday Batch B', days: 'Tuesday & Thursday', time: '6:30 PM – 8:00 PM', guru: 'Principal Guru' },
        { batch: 'Weekend Master Batch', days: 'Saturday & Sunday', time: '11:00 AM – 1:00 PM', guru: 'Visiting Acharya' }
      ]
    },
    advanced: {
      title: 'Advanced & Arangetram Schedule',
      subtitle: 'Margam Repertoire, Abhinaya & Stage Solo',
      rows: [
        { batch: 'Margam Intensive', days: 'Friday & Saturday', time: '6:00 PM – 8:30 PM', guru: 'Director Guru' },
        { batch: 'Abhinaya Lab', days: 'Sunday Morning', time: '10:00 AM – 1:00 PM', guru: 'Sangeet Natak Awardee' },
        { batch: 'Nattuvangam & Talam', days: 'Wednesday Evening', time: '7:30 PM – 9:00 PM', guru: 'Vidwan Nattuvanar' }
      ]
    }
  };

  document.querySelectorAll('.btn-view-schedule').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const level = btn.getAttribute('data-level') || 'beginner';
      const data = courseSchedules[level] || courseSchedules.beginner;

      if (modalScheduleTitle) modalScheduleTitle.textContent = data.title;
      if (modalScheduleSub) modalScheduleSub.textContent = data.subtitle;

      if (scheduleTableBody) {
        scheduleTableBody.innerHTML = data.rows
          .map(
            (row) => `
          <tr>
            <td><strong>${row.batch}</strong></td>
            <td>${row.days}</td>
            <td>${row.time}</td>
            <td>${row.guru}</td>
          </tr>
        `
          )
          .join('');
      }

      if (btnScheduleEnroll) {
        btnScheduleEnroll.setAttribute('data-target-course', level);
      }

      scheduleModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeScheduleModal() {
    scheduleModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnCloseSchedule) btnCloseSchedule.addEventListener('click', closeScheduleModal);
  if (scheduleModal) {
    scheduleModal.addEventListener('click', (e) => {
      if (e.target === scheduleModal) closeScheduleModal();
    });
  }

  if (btnScheduleEnroll) {
    btnScheduleEnroll.addEventListener('click', () => {
      const course = btnScheduleEnroll.getAttribute('data-target-course') || 'beginner';
      closeScheduleModal();
      const selectElem = document.getElementById('courseSelect');
      if (selectElem) {
        selectElem.value = course;
      }
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================
  // 8. WORKSHOP REGISTRATION TRIGGER
  // ==========================================
  document.querySelectorAll('.btn-register-card, .btn-register-banner').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const workshopName = btn.getAttribute('data-workshop') || 'Specialized Workshop';
      const selectElem = document.getElementById('courseSelect');
      if (selectElem) selectElem.value = 'workshop';
      const messageElem = document.getElementById('contactMessage');
      if (messageElem) {
        messageElem.value = `Enquiring for registration in: ${workshopName}.`;
      }
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected: ${workshopName}. Please submit your details below.`);
    });
  });

  // ==========================================
  // 9. GALLERY FILTER & LIGHTBOX MODAL
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryModal = document.getElementById('galleryModal');
  const btnCloseGalleryModal = document.getElementById('btnCloseGalleryModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.item-title')?.textContent || '';
      const category = item.querySelector('.item-category')?.textContent || '';

      if (modalImg && img) modalImg.src = img.src;
      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;

      galleryModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeGalleryModal() {
    galleryModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnCloseGalleryModal) btnCloseGalleryModal.addEventListener('click', closeGalleryModal);
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) closeGalleryModal();
    });
  }

  // Keyboard Escape Handler for All Modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeScheduleModal();
      closeGalleryModal();
      closeMobileMenu();
    }
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const message = [
        'New website enquiry',
        `Name: ${formData.get('name') || ''}`,
        `Email: ${formData.get('email') || ''}`,
        `Phone / WhatsApp: ${formData.get('phone') || 'Not provided'}`,
        `Program: ${formData.get('program') || ''}`,
        `Message: ${formData.get('message') || 'No message provided'}`
      ].join('\n');
      const whatsappUrl = `https://wa.me/917046135979?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      showToast('WhatsApp opened with your enquiry. Send the message there to complete it.');
    });
  }

  // ==========================================
  // 11. BACK TO TOP BUTTON
  // ==========================================
  const btnScrollTop = document.getElementById('btnScrollTop');
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 12. TOAST NOTIFICATION HELPER
  // ==========================================
  let toastTimer = null;
  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span style="color:#D49B2A; font-size:1.1rem;">❖</span>
      <span>${message}</span>
    `;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
});
