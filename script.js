const SITE_CONFIG = {
  form: {
    mode: "mailto"
  },
  organization: {
    name: "Canaan Third Space Senior Care Home",
    shortName: "Canaan Third Space",
    city: "REPLACE WITH CITY",
    district: "REPLACE WITH DISTRICT",
    state: "Kerala",
    country: "India",
    description: "REPLACE WITH APPROVED ORGANIZATION DESCRIPTION"
  },

  brand: {
    logo: "images/brand/logo.jpg",
    logoAlt: "Canaan Third Space Senior Care Home logo"
  },

  contact: {
    phone: "REPLACE WITH PHONE",
    email: "REPLACE WITH EMAIL",
    whatsapp: "",
    address: "REPLACE WITH FULL ADDRESS",
    hours: "REPLACE WITH OPENING HOURS",
    mapUrl: "",
    latitude: "",
    longitude: ""
  },

  social: {
    facebook: "",
    instagram: "",
    youtube: ""
  },

  services: {
    hospital: [
      {
        name: "OPD consultation",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled: true
      },
      {
        name: "IPD admission",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled: true
      },
      {
        name: "Laboratory services",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled: true
      }
    ],

    oldAgeHome: [
      {
        name: "Residential care",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled: true
      },
      {
        name: "Daily assistance",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled: true
      },
      {
        name: "Family support",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled: true
      }
    ]
  },

  images: {
    hospitalExterior: "images/hospital/hospital-exterior.svg",
    hospitalReception: "images/hospital/reception.svg",
    consultationRoom: "images/hospital/consultation-room.svg",
    laboratory: "images/hospital/laboratory.svg",
    careSpace: "images/hospital/care-space.svg",
    oldAgeHomeExterior: "images/old-age-home/home-exterior.svg",
    commonArea: "images/old-age-home/common-area.svg",
    diningArea: "images/old-age-home/dining-area.svg",
    bedroom: "images/old-age-home/bedroom.svg",
    activities: "images/old-age-home/activities.svg"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const siteNav = document.querySelector('.site-nav');
  const siteHeader = document.querySelector('.site-header');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      siteNav.classList.toggle('active');
      siteHeader.classList.toggle('nav-open');
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('active')) {
        siteNav.classList.remove('active');
        siteHeader.classList.remove('nav-open');
        mobileMenuBtn.setAttribute('aria-expanded', false);
      }
    });
  });

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
  } else {
    // If prefers reduced motion, just show elements immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  }

  // Inject Configuration Values
  const configElements = document.querySelectorAll('[data-config]');
  configElements.forEach(el => {
    const keyPath = el.getAttribute('data-config').split('.');
    let value = SITE_CONFIG;
    for (const key of keyPath) {
      if (value[key] !== undefined) {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }
    
    if (value && typeof value === 'string') {
      if (el.tagName === 'A') {
        if (keyPath.includes('phone')) {
          el.href = `tel:${value.replace(/\s+/g, '')}`;
        } else if (keyPath.includes('email')) {
          el.href = `mailto:${value}`;
        } else if (keyPath.includes('whatsapp') && value !== '') {
          el.href = `https://wa.me/${value.replace(/[^0-9]/g, '')}`;
          el.style.display = 'inline-flex'; // Show if configured
        } else if (keyPath.includes('whatsapp') && value === '') {
          el.style.display = 'none'; // Hide if not configured
        } else if (keyPath.includes('mapUrl') && value !== '') {
          el.href = value;
        } else if (keyPath.includes('mapUrl') && value === '') {
          el.href = '#';
        }
        
        if (el.innerText === '' || el.hasAttribute('data-replace-text')) {
           el.innerText = value;
        }
      } else {
        el.innerText = value;
      }
    }
  });

  // Simple Form Validation (Contact Page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const type = document.getElementById('enquiry-type').value;
      const message = document.getElementById('message').value;
      
      if (name && email && message) {
        if (SITE_CONFIG.form.mode === "mailto") {
          const btn = contactForm.querySelector('button[type="submit"]');
          const subject = encodeURIComponent(`Enquiry via Website: ${type}`);
          const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nEnquiry Type: ${type}\n\nMessage:\n${message}`);
          
          alert("Your default email application will now open to send this enquiry.");
          
          const mailtoUrl = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
          window.location.href = mailtoUrl;
          
          btn.innerText = "Email App Opened";
          setTimeout(() => { btn.innerText = "Send Message"; contactForm.reset(); }, 3000);
        } else {
          // Future backend handling
          alert("Backend integration pending.");
        }
      } else {
        alert("Please fill in all required fields.");
      }
    });
  }
});
