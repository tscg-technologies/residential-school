/**
 * RESIDENTIAL SCHOOL - Main JavaScript Functionality
 * Pure Vanilla JavaScript (ES6+)
 * No external libraries or dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initScrollReveal();
  initBackToTop();
  initAccordions();
  initGalleryLightbox();
  initGalleryFilter();
  initAdmissionForm();
  initContactForm();
  initImageFallbacks();
  setActiveNavLink();
});

/**
 * 1. Sticky Header & Shadow on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Hamburger Navigation
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navWrapper = document.querySelector('.nav-menu-wrapper');
  if (!toggleBtn || !navWrapper) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navWrapper.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when clicking a nav link
  const navLinks = navWrapper.querySelectorAll('.nav-link, .nav-cta .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navWrapper.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navWrapper.classList.contains('open')) {
      navWrapper.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/**
 * 3. Highlight Active Navigation Link
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 4. Scroll Reveal Animations (IntersectionObserver)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback if observer is unsupported
    reveals.forEach(el => el.classList.add('active'));
  }
}

/**
 * 5. Back to Top Button
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 6. Accessible Accordions
 */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isExpanded = item.classList.contains('active');

      // Close siblings if inside a single-expand accordion
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion && !parentAccordion.hasAttribute('data-multi-expand')) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const sibContent = sibling.querySelector('.accordion-content');
            if (sibContent) sibContent.style.maxHeight = null;
            const sibHeader = sibling.querySelector('.accordion-header');
            if (sibHeader) sibHeader.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (isExpanded) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 7. Gallery Category Filtering
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 8. Interactive Lightbox Modal
 */
function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCategory = lightbox.querySelector('.lightbox-category');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentItems = [];
  let currentIndex = -1;

  function getVisibleGalleryItems() {
    return Array.from(document.querySelectorAll('.gallery-grid .gallery-item'))
      .filter(item => item.style.display !== 'none');
  }

  function openLightbox(item) {
    currentItems = getVisibleGalleryItems();
    currentIndex = currentItems.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (currentIndex < 0 || currentIndex >= currentItems.length) return;
    const item = currentItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-overlay h4')?.textContent || img?.alt || 'Residential School';
    const category = item.querySelector('.gallery-overlay span')?.textContent || item.getAttribute('data-category') || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || title;
    if (lightboxCaption) lightboxCaption.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
  }

  function showNext() {
    if (!currentItems.length) return;
    currentIndex = (currentIndex + 1) % currentItems.length;
    updateLightbox();
  }

  function showPrev() {
    if (!currentItems.length) return;
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    updateLightbox();
  }

  // Open on item click
  document.querySelectorAll('.gallery-grid .gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // Close when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/**
 * 9. Admission Enquiry Form Validation
 */
function initAdmissionForm() {
  const form = document.getElementById('admissionForm');
  if (!form) return;

  const feedback = document.getElementById('admissionFeedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));

    // Validate Student Name
    const studentName = form.querySelector('#studentName');
    if (!studentName.value.trim() || studentName.value.trim().length < 2) {
      showFieldError(studentName, 'Please enter a valid student name.');
      isValid = false;
    }

    // Validate DOB
    const dob = form.querySelector('#dob');
    if (!dob.value) {
      showFieldError(dob, 'Please select the date of birth.');
      isValid = false;
    }

    // Validate Gender
    const gender = form.querySelector('#gender');
    if (!gender.value) {
      showFieldError(gender, 'Please select a gender.');
      isValid = false;
    }

    // Validate Grade
    const grade = form.querySelector('#grade');
    if (!grade.value) {
      showFieldError(grade, 'Please select the grade applying for.');
      isValid = false;
    }

    // Validate Parent Name
    const parentName = form.querySelector('#parentName');
    if (!parentName.value.trim() || parentName.value.trim().length < 2) {
      showFieldError(parentName, 'Please enter parent / guardian name.');
      isValid = false;
    }

    // Validate Phone (Indian 10-digit format or international standard)
    const phone = form.querySelector('#phone');
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim().replace(/\s+/g, ''))) {
      showFieldError(phone, 'Please enter a valid contact phone number.');
      isValid = false;
    }

    // Validate Email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Current City
    const city = form.querySelector('#city');
    if (!city.value.trim()) {
      showFieldError(city, 'Please enter your current city.');
      isValid = false;
    }

    if (isValid) {
      if (feedback) {
        feedback.className = 'form-feedback-alert success';
        feedback.innerHTML = '<strong>Success!</strong> Thank you! Your demo enquiry has been validated successfully. No information has been transmitted or stored.';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    } else {
      if (feedback) {
        feedback.className = 'form-feedback-alert error';
        feedback.innerHTML = 'Please correct the highlighted fields above before submitting.';
      }
    }
  });

  // Reset button action
  const resetBtn = form.querySelector('button[type="reset"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));
      if (feedback) {
        feedback.className = 'form-feedback-alert';
        feedback.textContent = '';
      }
    });
  }
}

/**
 * 10. Contact Us Form Validation
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const feedback = document.getElementById('contactFeedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));

    const name = form.querySelector('#contactName');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showFieldError(name, 'Please enter your full name.');
      isValid = false;
    }

    const email = form.querySelector('#contactEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    const phone = form.querySelector('#contactPhone');
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim().replace(/\s+/g, ''))) {
      showFieldError(phone, 'Please enter a valid phone number.');
      isValid = false;
    }

    const subject = form.querySelector('#contactSubject');
    if (!subject.value.trim()) {
      showFieldError(subject, 'Please enter a subject.');
      isValid = false;
    }

    const message = form.querySelector('#contactMessage');
    if (!message.value.trim() || message.value.trim().length < 10) {
      showFieldError(message, 'Please provide a message with at least 10 characters.');
      isValid = false;
    }

    if (isValid) {
      if (feedback) {
        feedback.className = 'form-feedback-alert success';
        feedback.innerHTML = '<strong>Success!</strong> Thank you! Your demo message has been validated successfully. No information has been transmitted or stored.';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    } else {
      if (feedback) {
        feedback.className = 'form-feedback-alert error';
        feedback.innerHTML = 'Please fill out all required fields correctly.';
      }
    }
  });
}

function showFieldError(inputEl, message) {
  inputEl.classList.add('error');
  const parent = inputEl.closest('.form-group');
  if (parent) {
    let errorEl = parent.querySelector('.field-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error-msg';
      parent.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

/**
 * 11. Graceful Image Fallback
 */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function () {
      // Graceful visual placeholder in case an asset fails to load
      this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20fill%3D%22%23142D4E%22%20width%3D%22600%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%23D4A64A%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ERESIDENTIAL%20SCHOOL%3C%2Ftext%3E%3C%2Fsvg%3E';
      this.alt = 'Residential School Campus View';
    });
  });
}
