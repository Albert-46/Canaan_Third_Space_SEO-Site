/**
 * Canaan Third Space Senior Care Home — Public Website Configuration
 *
 * HOW TO CONFIGURE:
 * Fill in every field marked  ← REPLACE  before publishing.
 * Fields left as empty strings "" are safely hidden by the inject engine.
 * Do not delete any keys — only update their values.
 */
const SITE_CONFIG = {
  organization: {
    name: "Canaan Third Space Senior Care Home",
    descriptor: "Medical Services and Senior Living",
    city: "",
    district: "",
    state: "Kerala",
    country: "India",
    description: ""
  },

  contact: {
    phoneDisplay: "",
    phoneHref: "",
    email: "",
    whatsappDisplay: "",
    whatsappHref: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    state: "Kerala",
    postalCode: "",
    country: "India",
    openingHours: "",
    mapUrl: "",
    latitude: "",
    longitude: ""
  },

  services: {
    medical: [
      {
        name: "OPD Consultation",
        shortDescription: "Professional outpatient consultations in private consultation rooms. Patients are seen by appointment.",
        enabled: true
      },
      {
        name: "Laboratory Services",
        shortDescription: "In-house diagnostic laboratory for blood tests and routine investigations. Results communicated via doctor.",
        enabled: true
      },
      {
        name: "Inpatient Admission",
        shortDescription: "Comfortable inpatient care for patients requiring observation or extended treatment.",
        enabled: true
      }
    ],
    seniorCare: [
      {
        name: "Residential Care",
        shortDescription: "A comfortable, dignified residential environment for senior citizens.",
        enabled: true
      },
      {
        name: "Daily Assistance",
        shortDescription: "Respectful support with daily routines including personal hygiene, mobility, and meals.",
        enabled: true
      },
      {
        name: "Family Support",
        shortDescription: "Regular family updates, defined visiting arrangements, and clear communication processes.",
        enabled: true
      }
    ]
  },

  emergency: {
    available: false,
    emergencyNumber: "112",
    disclaimer: "This website is not an emergency service. For urgent medical help, contact your local emergency number or proceed to the nearest emergency department."
  },

  seo: {
    siteUrl: "https://www.canaan-thirdspace-placeholder.com",
    ogImage: "https://www.canaan-thirdspace-placeholder.com/images/brand/Logo.png"
  },

  social: {
    facebook: "",
    instagram: "",
    youtube: ""
  },

  images: {
    hospitalExterior:    "images/hospital/hospital-exterior.svg",
    hospitalReception:   "images/hospital/reception.svg",
    consultationRoom:    "images/hospital/consultation-room.svg",
    laboratory:          "images/hospital/laboratory.svg",
    careSpace:           "images/hospital/care-space.svg",
    oldAgeHomeExterior:  "images/old-age-home/home-exterior.svg",
    commonArea:          "images/old-age-home/common-area.svg",
    diningArea:          "images/old-age-home/dining-area.svg",
    bedroom:             "images/old-age-home/bedroom.svg",
    activities:          "images/old-age-home/activities.svg"
  }
};

/* ============================================================
   DATA INJECTION ENGINE
   Reads [data-config="key.path"] attributes and injects values.
   Placeholder strings (starting with "←") are skipped silently
   so raw placeholder text is never rendered to the user.
   ============================================================ */
function getConfigValue(keyPath) {
  const keys = keyPath.split('.');
  let value = SITE_CONFIG;
  for (const key of keys) {
    if (value !== null && value !== undefined && value[key] !== undefined) {
      value = value[key];
    } else {
      return null;
    }
  }
  // Array access: services.hospital.0.name
  return value;
}

function isPlaceholder(value) {
  if (!value || typeof value !== 'string') return true;
  if (value.trim() === '') return true;
  return false;
}

function injectConfig() {
  const configElements = document.querySelectorAll('[data-config]');
  configElements.forEach(el => {
    const keyPath = el.getAttribute('data-config');
    const keys = keyPath.split('.');
    let value = SITE_CONFIG;
    
    for (const key of keys) {
      if (value !== null && typeof value === 'object' && value[key] !== undefined) {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }

    if (value === null || typeof value !== 'string' || isPlaceholder(value)) {
      if (el.tagName === 'A' && (
        keyPath.includes('phone') ||
        keyPath.includes('email') ||
        keyPath.includes('whatsapp') ||
        keyPath.includes('mapUrl')
      )) {
        el.style.display = 'none';
        
        // Find and hide any parent wrapper/container if requested
        if (el.hasAttribute('data-hide-parent')) {
          const parent = el.closest(el.getAttribute('data-hide-parent'));
          if (parent) parent.style.display = 'none';
        }
      } else if (!el.hasAttribute('data-hide-parent') && el.tagName !== 'A') {
        el.style.display = 'none';
        
        if (el.hasAttribute('data-hide-parent-if-empty')) {
          const parent = el.closest(el.getAttribute('data-hide-parent-if-empty'));
          if (parent) parent.style.display = 'none';
        }
      }
      return; 
    }

    if (el.tagName === 'A') {
      if (keyPath.includes('phoneDisplay') || keyPath.includes('phoneHref')) {
        const href = SITE_CONFIG.contact.phoneHref;
        if (href && !isPlaceholder(href)) {
          el.href = `tel:${href}`;
          el.style.display = '';
        } else {
          el.style.display = 'none';
          return;
        }
      } else if (keyPath.includes('email')) {
        el.href = `mailto:${value}`;
        el.style.display = '';
      } else if (keyPath.includes('whatsapp')) {
        el.href = `https://wa.me/${value.replace(/[^0-9]/g, '')}`;
        el.style.display = 'inline-flex';
      } else if (keyPath.includes('mapUrl')) {
        el.href = value;
        el.style.display = '';
      }

      if (!el.hasAttribute('data-replace-text') && (el.innerText === '' || el.innerText === el.getAttribute('data-config'))) {
        el.innerText = value;
      }
    } else {
      el.innerHTML = value.replace(/\n/g, '<br>');
      el.style.display = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Mobile Menu Toggle ────────────────────────────────────────
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const siteNav = document.querySelector('.site-nav');
  const siteHeader = document.querySelector('.site-header');

  if (mobileMenuBtn && siteNav) {
    mobileMenuBtn.addEventListener('click', () => {
      siteNav.classList.toggle('active');
      siteHeader.classList.toggle('nav-open');
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('active')) {
          siteNav.classList.remove('active');
          siteHeader.classList.remove('nav-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ── Sticky Header ─────────────────────────────────────────────
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── Scroll Reveal ─────────────────────────────────────────────
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  }

  // ── Inject Configuration Values ───────────────────────────────
  injectConfig();

  // ── Copyright Year ────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const dateEl = document.getElementById('currentDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── FAQ Accordion ─────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // ── Contact Form ──────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameEl    = document.getElementById('name');
      const phoneEl   = document.getElementById('phone');
      const emailEl   = document.getElementById('email');
      const typeEl    = document.getElementById('enquiry-type');
      const prefEl    = document.getElementById('preferred-contact');
      const messageEl = document.getElementById('message');
      const consentEl = document.getElementById('consent');

      if (!consentEl || !consentEl.checked) {
        alert('Please confirm your consent to proceed.');
        consentEl && consentEl.focus();
        return;
      }

      const name    = nameEl ? nameEl.value.trim() : '';
      const phone   = phoneEl ? phoneEl.value.trim() : '';
      const email   = emailEl ? emailEl.value.trim() : '';
      const type    = typeEl ? typeEl.value : '';
      const pref    = prefEl ? prefEl.value : '';
      const message = messageEl ? messageEl.value.trim() : '';

      if (!name || !email || !message) {
        alert('Please fill in your name, email address, and message.');
        return;
      }

      const dest = SITE_CONFIG.contact.email;
      if (!dest || isPlaceholder(dest)) {
        alert('The contact email address has not been configured. Please call us directly.');
        return;
      }

      const subject = encodeURIComponent(`Website Enquiry: ${type || 'General'}`);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email}\nEnquiry Type: ${type}\nPreferred Contact: ${pref}\n\nMessage:\n${message}\n\n---\nSubmitted via the Canaan Third Space website.`
      );

      const disclaimer = document.getElementById('form-disclaimer');
      if (disclaimer) disclaimer.style.display = 'block';

      window.location.href = `mailto:${dest}?subject=${subject}&body=${body}`;

      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Email App Opened';
        setTimeout(() => {
          btn.textContent = 'Send Enquiry';
          contactForm.reset();
          if (disclaimer) disclaimer.style.display = 'none';
        }, 4000);
      }
    });
  }
});
