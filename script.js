document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ANIMA DE PETALOS FLOTANTES EN FONDO
  // ==========================================
  const petalsContainer = document.getElementById('petalsContainer');
  if (petalsContainer) {
    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${8 + Math.random() * 10}s`;
      petal.style.animationDelay = `${Math.random() * 5}s`;
      petal.style.width = `${10 + Math.random() * 12}px`;
      petal.style.height = `${12 + Math.random() * 14}px`;
      petalsContainer.appendChild(petal);
    }
  }

  // ==========================================
  // 2. SOBRE INTERACTIVO DE APERTURA (ENVELOPE)
  // ==========================================
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('waxSeal');

  let envelopeOpened = false;

  // Bloquear scroll mientras el sobre esté cerrado
  if (envelopeOverlay && !envelopeOpened) {
    document.body.classList.add('unopened-locked');
  }

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Desbloquear scroll del cuerpo al abrir
    document.body.classList.remove('unopened-locked');

    // Asegurar que la pantalla comience desde arriba de la invitación
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Animación 3D del sobre
    envelope.classList.add('open');

    // Reproducir música suave
    startBackgroundMusic();

    // Desvanecer overlay después de abrir la tarjeta
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('unopened-locked');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 1100);
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', openEnvelope);
  }
  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
  }

  // ==========================================
  // 3. REPRODUCTOR DE MÚSICA DE FONDO MP3
  // ==========================================
  const bgAudio = document.getElementById('bgAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const equalizer = document.getElementById('equalizer');

  function startBackgroundMusic() {
    if (!bgAudio) return;
    bgAudio.volume = 0.8;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateAudioUI(true);
      }).catch(err => {
        console.log('Autoplay restricted by browser:', err);
        const enableAudioOnTouch = () => {
          bgAudio.play().then(() => updateAudioUI(true)).catch(e => console.log(e));
          window.removeEventListener('click', enableAudioOnTouch);
          window.removeEventListener('touchstart', enableAudioOnTouch);
        };
        window.addEventListener('click', enableAudioOnTouch, { once: true });
        window.addEventListener('touchstart', enableAudioOnTouch, { once: true });
      });
    }
  }

  function stopBackgroundMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    updateAudioUI(false);
  }

  function toggleBackgroundMusic() {
    if (!bgAudio) return;
    if (bgAudio.paused) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }

  function updateAudioUI(playing) {
    if (playing) {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (equalizer) equalizer.classList.add('playing');
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (equalizer) equalizer.classList.remove('playing');
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleBackgroundMusic);
  }

  if (bgAudio) {
    bgAudio.addEventListener('play', () => updateAudioUI(true));
    bgAudio.addEventListener('pause', () => updateAudioUI(false));
  }

  // ==========================================
  // 4. CONTADOR REGRESIVO A 29 / 08 / 2026 14:30
  // ==========================================
  const targetDate = new Date('2026-08-29T14:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
      document.getElementById('timerGrid').innerHTML = '<span style="font-weight: bold; color: var(--gold-dark);">¡Hoy es el Gran Día! 🎉</span>';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 5. GALERÍA DE FOTOS EN CARRUSEL INTERACTIVO
  // ==========================================
  const carouselSlides = document.getElementById('carouselSlides');
  const slides = document.querySelectorAll('.carousel-slides .slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlideIndex = index;

    if (carouselSlides) {
      carouselSlides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 2600);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  // Pausar auto-desplazamiento al tocar o pasar el cursor sobre el carrusel
  const carouselViewport = document.getElementById('carouselViewport');
  if (carouselViewport) {
    carouselViewport.addEventListener('mouseenter', stopAutoSlide);
    carouselViewport.addEventListener('mouseleave', startAutoSlide);
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      goToSlide(index);
      startAutoSlide();
    });
  });

  // Gestos táctiles y deslizamiento suave (Swipe en Móviles / Drag en Desktop)
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  if (carouselSlides) {
    carouselSlides.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      stopAutoSlide();
    }, { passive: true });

    carouselSlides.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX - touchEndX;
      if (diffX > 35) {
        nextSlide();
      } else if (diffX < -35) {
        prevSlide();
      }
      startAutoSlide();
    }, { passive: true });

    // Drag con mouse para Desktop
    carouselSlides.addEventListener('mousedown', (e) => {
      isDragging = true;
      touchStartX = e.clientX;
      stopAutoSlide();
    });

    carouselSlides.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      touchEndX = e.clientX;
      const diffX = touchStartX - touchEndX;
      if (diffX > 35) {
        nextSlide();
      } else if (diffX < -35) {
        prevSlide();
      }
      startAutoSlide();
    });

    carouselSlides.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        startAutoSlide();
      }
    });
  }

  // Abrir vista ampliada (Lightbox) al hacer clic en cualquier imagen
  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      const img = slide.querySelector('img');
      if (img && lightboxOverlay && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxOverlay.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxOverlay.classList.remove('active');
    });
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        lightboxOverlay.classList.remove('active');
      }
    });
  }

  // Iniciar deslizamiento automático
  startAutoSlide();

  // ==========================================
  // 6. MODAL RSVP Y WHATSAPP INTEGRACIÓN
  // ==========================================
  const rsvpModal = document.getElementById('rsvpModal');
  const openRsvpBtn = document.getElementById('openRsvpBtn');
  const closeRsvpBtn = document.getElementById('closeRsvpBtn');
  const rsvpForm = document.getElementById('rsvpForm');

  if (openRsvpBtn) {
    openRsvpBtn.addEventListener('click', () => {
      rsvpModal.classList.add('active');
    });
  }

  if (closeRsvpBtn) {
    closeRsvpBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('active');
    });
  }

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        rsvpModal.classList.remove('active');
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName').value;
      const adults = document.getElementById('adultsCount').value;
      const kids = document.getElementById('kidsCount').value;
      const status = document.getElementById('attendanceStatus').value;
      const message = document.getElementById('guestMessage').value;

      const isAttending = status === 'confirmado';
      const statusText = isAttending ? '¡Sí, con mucho gusto asistiré! 🎉' : 'Lo siento, no podré asistir 😔';

      let text = `*CONFIRMACIÓN DE ASISTENCIA - BAUTIZO Y CUMPLEAÑOS DEREK JOAO*\n\n`;
      text += `*Nombre:* ${name}\n`;
      text += `*Asistencia:* ${statusText}\n`;
      text += `*Adultos:* ${adults} | *Niños:* ${kids}\n`;
      if (message) {
        text += `*Mensaje:* "${message}"\n`;
      }

      const encodedText = encodeURIComponent(text);
      // Abrir enlace WhatsApp
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');

      rsvpModal.classList.remove('active');
      triggerConfetti();
    });
  }

  // Animación de Confeti al Confirmar
  function triggerConfetti() {
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.top = '-10px';
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.width = '8px';
      conf.style.height = '8px';
      conf.style.background = ['#D4AF37', '#A66B64', '#8C5638', '#F3E5AB'][Math.floor(Math.random() * 4)];
      conf.style.borderRadius = '50%';
      conf.style.zIndex = '99999';
      conf.style.pointerEvents = 'none';
      conf.style.transition = 'transform 3s ease-out, opacity 3s ease-out';
      document.body.appendChild(conf);

      setTimeout(() => {
        conf.style.transform = `translateY(100vh) rotate(${Math.random() * 720}deg)`;
        conf.style.opacity = '0';
      }, 50);

      setTimeout(() => conf.remove(), 3200);
    }
  }

  // ==========================================
  // 7. MENÚ RESPONSIVE HAMBURGUESA
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 8. MODAL INTERACTIVO DE UBICACIÓN Y COPYS
  // ==========================================
  const locationModal = document.getElementById('locationModal');
  const openLocationModalBtn = document.getElementById('openLocationModalBtn');
  const closeLocationBtn = document.getElementById('closeLocationBtn');
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const copyAddressText = document.getElementById('copyAddressText');

  if (openLocationModalBtn && locationModal) {
    openLocationModalBtn.addEventListener('click', () => {
      locationModal.classList.add('active');
    });
  }

  if (closeLocationBtn && locationModal) {
    closeLocationBtn.addEventListener('click', () => {
      locationModal.classList.remove('active');
    });
  }

  if (locationModal) {
    locationModal.addEventListener('click', (e) => {
      if (e.target === locationModal) {
        locationModal.classList.remove('active');
      }
    });
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = "Parroquia Nuestra Señora del Carmen, Miraflores, Lima";
      navigator.clipboard.writeText(addressText).then(() => {
        if (copyAddressText) {
          const originalText = copyAddressText.textContent;
          copyAddressText.textContent = "¡Dirección Copiada! ✓";
          setTimeout(() => {
            copyAddressText.textContent = originalText;
          }, 2000);
        }
      }).catch(err => {
        console.error('Error al copiar: ', err);
      });
    });
  }

  // ==========================================
  // 9. MODAL INTERACTIVO UBICACIÓN RECEPCIÓN
  // ==========================================
  const receptionLocationModal = document.getElementById('receptionLocationModal');
  const openReceptionLocationBtn = document.getElementById('openReceptionLocationBtn');
  const closeReceptionLocationBtn = document.getElementById('closeReceptionLocationBtn');
  const copyReceptionAddressBtn = document.getElementById('copyReceptionAddressBtn');
  const copyReceptionAddressText = document.getElementById('copyReceptionAddressText');

  if (openReceptionLocationBtn && receptionLocationModal) {
    openReceptionLocationBtn.addEventListener('click', () => {
      receptionLocationModal.classList.add('active');
    });
  }

  if (closeReceptionLocationBtn && receptionLocationModal) {
    closeReceptionLocationBtn.addEventListener('click', () => {
      receptionLocationModal.classList.remove('active');
    });
  }

  if (receptionLocationModal) {
    receptionLocationModal.addEventListener('click', (e) => {
      if (e.target === receptionLocationModal) {
        receptionLocationModal.classList.remove('active');
      }
    });
  }

  if (copyReceptionAddressBtn) {
    copyReceptionAddressBtn.addEventListener('click', () => {
      const receptionUrl = "https://maps.app.goo.gl/VubuY4CnvH2sfMi56?g_st=aw";
      navigator.clipboard.writeText(receptionUrl).then(() => {
        if (copyReceptionAddressText) {
          const originalText = copyReceptionAddressText.textContent;
          copyReceptionAddressText.textContent = "¡Enlace Copiado! ✓";
          setTimeout(() => {
            copyReceptionAddressText.textContent = originalText;
          }, 2000);
        }
      }).catch(err => {
        console.error('Error al copiar enlace: ', err);
      });
    });
  }
});


