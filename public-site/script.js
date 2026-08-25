/* =============================================================
   SITE CONFIGURATION & INTERACTIVE LOGIC
   Canaan Care — Public Website
   v1.0 — No backend dependency. Mailto form. Live-Server ready.
   ============================================================= */

/* ─────────────────────────────────────────────────────────────
   SITE CONFIG — Update all REPLACE values before going live.
   These values auto-populate across all pages via data-config.
   ───────────────────────────────────────────────────────────── */
const SITE_CONFIG = {

  organization: {
    name:        "REPLACE WITH OFFICIAL ORGANIZATION NAME",
    shortName:   "REPLACE WITH SHORT NAME",
    city:        "REPLACE WITH CITY",
    district:    "REPLACE WITH DISTRICT",
    state:       "Kerala",
    country:     "India",
    description: "REPLACE WITH APPROVED DESCRIPTION"
  },

  contact: {
    phone:     "REPLACE WITH PHONE",
    email:     "REPLACE WITH EMAIL",
    whatsapp:  "",               // e.g. "+919876543210" — leave "" to hide button
    address:   "REPLACE WITH FULL ADDRESS",
    hours:     "REPLACE WITH OPENING HOURS",
    mapUrl:    "",               // Google Maps URL
    latitude:  "",
    longitude: ""
  },

  social: {
    facebook:  "",               // Full URL — leave "" to hide
    instagram: "",
    youtube:   ""
  },

  form: {
    mode: "mailto"               // "mailto" | "backend" (future)
  },

  images: {
    hospitalExterior:   "images/hospital/hospital-exterior-placeholder.svg",
    hospitalReception:  "images/hospital/reception-placeholder.svg",
    consultationRoom:   "images/hospital/consultation-room-placeholder.svg",
    laboratory:         "images/hospital/laboratory-placeholder.svg",
    careSpace:          "images/hospital/care-space-placeholder.svg",
    oldAgeHomeExterior: "images/old-age-home/home-exterior-placeholder.svg",
    commonArea:         "images/old-age-home/common-area-placeholder.svg",
    diningArea:         "images/old-age-home/dining-area-placeholder.svg",
    bedroom:            "images/old-age-home/bedroom-placeholder.svg",
    activities:         "images/old-age-home/activities-placeholder.svg"
  },

  services: {
    hospital: [
      {
        name:        "OPD Consultation",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled:     true
      },
      {
        name:        "IPD Admission",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled:     true
      },
      {
        name:        "Laboratory Services",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled:     true
      }
    ],

    oldAgeHome: [
      {
        name:        "Residential Care",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled:     true
      },
      {
        name:        "Daily Assistance",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled:     true
      },
      {
        name:        "Family Support",
        description: "REPLACE WITH APPROVED DESCRIPTION",
        enabled:     true
      }
    ]
  }
};

/* =============================================================
   INITIALISATION
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initConfig();
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal(prefersReducedMotion);
  initContactForm();
  initFooterSocial();

  // Dynamic year
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ─────────────────────────────────────────────────────────────
   CONFIG INJECTION
   Populates any element with [data-config="key.path"] from
   SITE_CONFIG, and sets correct href on phone/email/whatsapp.
   ───────────────────────────────────────────────────────────── */
function initConfig() {
  document.querySelectorAll("[data-config]").forEach(el => {
    const path = el.getAttribute("data-config").split(".");
    let value = SITE_CONFIG;
    for (const key of path) {
      if (value && value[key] !== undefined) { value = value[key]; }
      else { value = null; break; }
    }

    if (!value || typeof value !== "string") return;

    if (el.tagName === "A") {
      if (path.includes("phone")) {
        el.href = `tel:${value.replace(/\s+/g, "")}`;
        if (!el.textContent.trim()) el.textContent = value;
      } else if (path.includes("email")) {
        el.href = `mailto:${value}`;
        if (!el.textContent.trim()) el.textContent = value;
      } else if (path.includes("whatsapp")) {
        if (value) {
          el.href = `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
          el.style.removeProperty("display");
        } else {
          el.style.display = "none";
        }
      } else if (path.includes("mapUrl")) {
        el.href = value || "#";
        if (!el.textContent.trim()) el.textContent = "Get Directions →";
      }
    } else if (el.tagName === "IMG") {
      el.src = value;
    } else {
      el.textContent = value;
    }
  });

  // Populate enabled services into any [data-services] target
  document.querySelectorAll("[data-services='hospital']").forEach(el => {
    el.innerHTML = SITE_CONFIG.services.hospital
      .filter(s => s.enabled)
      .map((s, i) => `
        <div class="service-row reveal">
          <span class="service-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="service-name">${s.name}</span>
          <a href="contact.html" class="btn-ghost" aria-label="Enquire about ${s.name}">Enquire</a>
        </div>`)
      .join("");
  });

  document.querySelectorAll("[data-services='old-age-home']").forEach(el => {
    el.innerHTML = SITE_CONFIG.services.oldAgeHome
      .filter(s => s.enabled)
      .map((s, i) => `
        <div class="service-row reveal">
          <span class="service-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="service-name">${s.name}</span>
          <a href="contact.html" class="btn-ghost" aria-label="Enquire about ${s.name}">Enquire</a>
        </div>`)
      .join("");
  });
}

/* ─────────────────────────────────────────────────────────────
   STICKY / TRANSPARENT HEADER
   ───────────────────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const hasHero = header.classList.contains("is-transparent");

  const update = () => {
    const scrolled = window.scrollY > 40;
    if (hasHero) {
      header.classList.toggle("is-transparent", !scrolled);
      header.classList.toggle("is-scrolled",    scrolled);
    } else {
      header.classList.add("is-scrolled");
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────────────────────
   MOBILE NAVIGATION
   ───────────────────────────────────────────────────────────── */
function initMobileNav() {
  const btn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = btn.classList.toggle("is-open");
    nav.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close on nav link click
  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      btn.classList.remove("is-open");
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      btn.classList.remove("is-open");
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   ACTIVE NAVIGATION LINK
   ───────────────────────────────────────────────────────────── */
function initActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────────────────────── */
function initReveal(prefersReducedMotion) {
  const els = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const obs = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    }),
    { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
  );

  els.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   CONTACT FORM — Client-side validation + mailto
   ───────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successPanel = document.getElementById("form-success");
  const submitBtn    = form.querySelector('[type="submit"]');

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const name    = form.querySelector("#f-name")?.value.trim()    || "";
    const email   = form.querySelector("#f-email")?.value.trim()   || "";
    const type    = form.querySelector("#f-type")?.value           || "";
    const message = form.querySelector("#f-message")?.value.trim() || "";

    if (SITE_CONFIG.form.mode === "mailto") {
      const subject = encodeURIComponent(`Enquiry — ${type || "General"}`);
      const body    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nEnquiry Type: ${type}\n\nMessage:\n${message}`
      );
      const mailto = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;

      // Show success panel, redirect after brief delay
      if (successPanel) {
        form.style.display = "none";
        successPanel.classList.add("is-visible");
      }

      setTimeout(() => { window.location.href = mailto; }, 600);

    } else {
      // Future backend integration point
      console.info("Backend mode — integration pending.");
    }
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach(field => {
    const err = document.getElementById(field.id + "-error");
    if (!field.value.trim()) {
      field.classList.add("has-error");
      if (err) err.classList.add("is-visible");
      valid = false;
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add("has-error");
      if (err) { err.textContent = "Please enter a valid email address."; err.classList.add("is-visible"); }
      valid = false;
    } else {
      field.classList.remove("has-error");
      if (err) err.classList.remove("is-visible");
    }
  });
  return valid;
}

/* ─────────────────────────────────────────────────────────────
   FOOTER SOCIAL LINKS (only rendered if configured)
   ───────────────────────────────────────────────────────────── */
function initFooterSocial() {
  const container = document.getElementById("footer-social");
  if (!container) return;

  const links = [
    { key: "facebook",  label: "Facebook"  },
    { key: "instagram", label: "Instagram" },
    { key: "youtube",   label: "YouTube"   }
  ];

  const markup = links
    .filter(l => SITE_CONFIG.social[l.key])
    .map(l => `<a href="${SITE_CONFIG.social[l.key]}" target="_blank" rel="noopener noreferrer"
                  aria-label="${l.label}">${l.label}</a>`)
    .join("");

  container.innerHTML = markup;
  if (!markup) container.style.display = "none";
}
