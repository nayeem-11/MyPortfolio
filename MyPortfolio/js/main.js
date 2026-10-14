/**
 * SK. Nayeemuddin — Developer Portfolio
 * Interactive Functionality & Accessible Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Dynamic Copyright Year ---
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && primaryNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('is-open');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          primaryNav.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    });
  }

  // --- 3. Active Nav Link on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --- 4. Back-to-Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 5. Project Modals System ---
  const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  let lastActiveElement = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastActiveElement = document.activeElement;
    modal.removeAttribute('hidden');
    // Force browser reflow for CSS opacity transition
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = modal.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }, 200);
  }

  modalOpenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-modal-target');
      openModal(targetModalId);
    });
  });

  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  // Close when clicking modal backdrop outside card
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close active modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  // --- 6. Toast Notification Helper ---
  function showToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- 7. Copy Email Address to Clipboard ---
  const copyEmailBtn = document.getElementById('btn-copy-email');
  const emailAddress = 'msnayeemuddin786@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
          showToast('Email address copied to clipboard!');
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = emailAddress;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast('Email address copied to clipboard!');
        }
      } catch (err) {
        showToast('Please copy: ' + emailAddress);
      }
    });
  }

  // --- 8. Contact Form Handling & Validation ---
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    nameInput.classList.remove('has-error');
    emailInput.classList.remove('has-error');
    messageInput.classList.remove('has-error');
    formStatus.className = 'form-status';
    formStatus.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    // Clear field-specific errors when user types
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) {
        nameError.textContent = '';
        nameInput.classList.remove('has-error');
      }
    });

    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) {
        emailError.textContent = '';
        emailInput.classList.remove('has-error');
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim()) {
        messageError.textContent = '';
        messageInput.classList.remove('has-error');
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim() || 'Software Development Internship Inquiry';
      const message = messageInput.value.trim();

      // Validate Name
      if (!name) {
        nameError.textContent = 'Please enter your name.';
        nameInput.classList.add('has-error');
        hasError = true;
      }

      // Validate Email
      if (!email) {
        emailError.textContent = 'Please enter your email address.';
        emailInput.classList.add('has-error');
        hasError = true;
      } else if (!isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('has-error');
        hasError = true;
      }

      // Validate Message
      if (!message) {
        messageError.textContent = 'Please write a message before submitting.';
        messageInput.classList.add('has-error');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      // Prepare Mailto URL
      const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const fullBody = encodeURIComponent(`Hi SK. Nayeemuddin,\n\n${message}\n\nFrom:\n${name}\nEmail: ${email}`);
      const mailtoUrl = `mailto:msnayeemuddin786@gmail.com?subject=${fullSubject}&body=${fullBody}`;

      // Inform user honestly without fabricating a fake backend server
      formStatus.className = 'form-status active info';
      formStatus.textContent = 'Opening your email client to send this message to msnayeemuddin786@gmail.com...';

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }
});
