// config.ts
// This is the central configuration file for the template.
// Template buyers should update these values to match their organization.

export const SITE_CONFIG = {
  // Organization Details
  organization: {
    name: "Canaan Third Space Senior Care Home",
    shortName: "Canaan Third Space",
    descriptor: "Medical Services and Senior Living",
    city: "Kochi",
    district: "REPLACE_WITH_REAL_DISTRICT",
    state: "Kerala",
    country: "India",
    description: "Compassionate medical services and dignified senior residential living in Kerala."
  },

  // Contact Information
  contact: {
    phoneDisplay: "REPLACE_WITH_REAL_PHONE", // Displayed on the site
    phoneHref: "REPLACE_WITH_REAL_E164_PHONE", // Used for tel: links (no spaces)
    email: "REPLACE_WITH_REAL_EMAIL",
    whatsappDisplay: "REPLACE_WITH_REAL_WHATSAPP_OR_EMPTY",
    whatsappHref: "REPLACE_WITH_REAL_WHATSAPP_LINK_OR_EMPTY", // Used for wa.me/ links (numbers only)
    addressLine1: "REPLACE_WITH_REAL_ADDRESS_LINE_1",
    addressLine2: "REPLACE_WITH_REAL_ADDRESS_LINE_2",
    city: "Kochi",
    district: "REPLACE_WITH_REAL_DISTRICT",
    state: "Kerala",
    postalCode: "REPLACE_WITH_REAL_POSTAL_CODE",
    country: "India",
    openingHours: "REPLACE_WITH_REAL_OPENING_HOURS",
    mapUrl: "REPLACE_WITH_REAL_GOOGLE_MAPS_URL", // Link to Google Maps
  },

  // Emergency Details
  emergency: {
    available: false,
    disclaimer: "This website is not an emergency service. For urgent medical help, contact your local emergency number or proceed to the nearest emergency department."
  },

  // SEO & Metadata
  seo: {
    siteUrl: "https://canaan-third-space.web.app", // The production URL
    defaultMetaDescription: "Compassionate medical services and dignified senior residential living in Kerala.",
    ogImage: "/images/brand/Logo.png", // Must be in the public directory
  },

  // Feature Toggles (Enable/Disable sections of the site)
  features: {
    enableEmergencyNotice: true, // Shows the emergency notice banner
    enableWhatsAppAction: false, // Set to true only when real WhatsApp number is provided
    enableTestimonials: false, // Enables the testimonial section
    enableTeamSection: true, // Enables the care team section
  },

  // Form Provider (For the Contact Form)
  // Supported options: 'demo', 'formspree', 'netlify', 'custom'
  form: {
    provider: 'demo', 
    endpoint: '', // e.g., 'https://formspree.io/f/your-form-id'
  },

  // Social Links
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  }
};
