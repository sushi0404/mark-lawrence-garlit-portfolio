/* =============================================
   PORTFOLIO — MAIN JAVASCRIPT
   Handles: Navbar scroll, mobile menu,
   scroll animations, skill bars, contact form,
   back-to-top button, footer year
   ============================================= */

/* ── DOM references ── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const backToTop  = document.getElementById('back-to-top');
const footerYear = document.getElementById('footer-year');
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

/* ── Footer year ── */
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ============================
   NAVBAR SCROLL EFFECT
   ============================ */
function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ============================
   BACK-TO-TOP BUTTON
   ============================ */
function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleBackToTop, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================
   MOBILE MENU TOGGLE
   ============================ */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

/* Close mobile menu when a nav link is clicked */
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* Close mobile menu when clicking outside */
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ============================
   ACTIVE NAV LINK ON SCROLL
   ============================ */
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
  const scrollPosition = window.scrollY + (window.innerHeight / 3);

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId     = section.getAttribute('id');
    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (correspondingLink) {
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        correspondingLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

/* ============================
   SCROLL-TRIGGERED FADE-IN ANIMATIONS
   ============================ */
const animatedElements = document.querySelectorAll('.fade-in-up');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.12
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animationObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedElements.forEach(el => animationObserver.observe(el));

/* ============================
   SKILL BAR ANIMATIONS
   ============================ */
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.getAttribute('data-width');
      /* Small delay so the section fade-in completes first */
      setTimeout(() => {
        bar.style.width = targetWidth + '%';
      }, 200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.2 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ============================
   CONTACT FORM (CLIENT-SIDE)
   Sends via Formspree — replace YOUR_FORM_ID
   or connect your own backend.
   ============================ */
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    /* Basic client-side validation */
    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showFormFeedback('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback('Please enter a valid email address.', 'error');
      return;
    }

    /* Update button state */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    /*
     * TO ENABLE REAL EMAIL DELIVERY:
     * 1. Go to https://formspree.io and create a free account
     * 2. Create a form and copy your form ID (e.g., "xpwzqrbn")
     * 3. Replace 'YOUR_FORM_ID' below with your actual form ID
     * 4. Remove the simulation block and uncomment the fetch block
     */

    /* --- Simulation (remove when using Formspree) --- */
    await simulateDelay(1200);
    showFormFeedback('✅ Message sent! I\'ll get back to you within 24 hours.', 'success');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    /* --- End simulation --- */

    /*
    // --- Formspree (uncomment when ready) ---
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (response.ok) {
        showFormFeedback('✅ Message sent! I\'ll get back to you within 24 hours.', 'success');
        contactForm.reset();
      } else {
        showFormFeedback('Something went wrong. Please try emailing me directly.', 'error');
      }
    } catch {
      showFormFeedback('Network error. Please try emailing me directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    // --- End Formspree ---
    */
  });
}

function showFormFeedback(message, type) {
  formFeedback.textContent = message;
  formFeedback.style.color = type === 'error' ? '#ef4444' : '#10b981';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================
   SMOOTH SCROLL OFFSET FIX
   Accounts for fixed navbar height
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
      10
    ) || 68;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});
