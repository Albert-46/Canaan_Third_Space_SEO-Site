// src/config.ts
// Central configuration for Canaan Third Space Senior Care Home.
// Contact details, SEO metadata, feature flags, and form settings are managed here.

export const SITE_CONFIG = {
  // ─────────────────────────────────────────────
  // Organization Details
  // ─────────────────────────────────────────────
  organization: {
    name: "Canaan Third Space Senior Care Home",
    shortName: "Canaan Third Space",
    descriptor: "Medical Services and Senior Living",
    city: "Manimala",
    district: "Kottayam",
    state: "Kerala",
    country: "India",
    description:
      "Compassionate medical services and dignified senior residential living in Kerala.",
  },

  // ─────────────────────────────────────────────
  // Contact Information
  // ─────────────────────────────────────────────
  contact: {
    phoneDisplay: "+91 80750 53345",
    phoneHref: "tel:+918075053345",

    email: "thirdspacecarehome@gmail.com",

    whatsappDisplay: "+91 80750 53345",
    whatsappHref: "https://wa.me/918075053345",

    addressLine1: "Kadayanikadu PO",
    addressLine2: "Kuttikkattu Valavu",
    city: "Manimala",
    district: "Kottayam",
    state: "Kerala",
    postalCode: "686541",
    country: "India",

    openingHours: "Monday – Sunday, 9 AM – 7 PM",

    mapUrl: "https://maps.app.goo.gl/jMJTqaeG5cKfHJCi8",
  },

  // ─────────────────────────────────────────────
  // Emergency Information
  // ─────────────────────────────────────────────
  emergency: {
    available: false,

    disclaimer:
      "This website is not an emergency service. For urgent medical help, contact your local emergency number or proceed to the nearest emergency department.",
  },

  // ─────────────────────────────────────────────
  // SEO & Metadata
  // ─────────────────────────────────────────────
  seo: {
    siteUrl: "https://canaanthirdspace.com",

    defaultMetaDescription:
      "Compassionate medical services and dignified senior residential living in Manimala, Kottayam, Kerala.",

    ogImage:
      "https://canaanthirdspace.com/images/brand/Logo.png",
  },

  // ─────────────────────────────────────────────
  // Feature Toggles
  // ─────────────────────────────────────────────
  features: {
    enableEmergencyNotice: true,
    enableWhatsAppAction: true,
    enableTestimonials: false,
    enableTeamSection: true,
  },

  // ─────────────────────────────────────────────
  // Contact Form
  // ─────────────────────────────────────────────
  // Form submissions currently use Formspree.
  //
  // Formspree endpoint:
  // https://formspree.io/f/mzekbakb
  //
  // This is a temporary production solution.
  // The form can later be connected back to the
  // Canaan Third Space System API.

  form: {
    provider: "formspree",
    endpoint: "https://formspree.io/f/mqpkgvby",
  },

  // ─────────────────────────────────────────────
  // Social Links
  // ─────────────────────────────────────────────
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
} as const;