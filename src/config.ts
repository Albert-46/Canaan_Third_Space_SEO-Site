// config.ts
// Central configuration file for Canaan Third Space Senior Care Home.
// All contact details, SEO metadata, and feature flags are managed here.

export const SITE_CONFIG = {
  // Organization Details
  organization: {
    name: "Canaan Third Space Senior Care Home",
    shortName: "Canaan Third Space",
    descriptor: "Medical Services and Senior Living",
    city: "Manimala",
    district: "Kottayam",
    state: "Kerala",
    country: "India",
    description: "Compassionate medical services and dignified senior residential living in Kerala."
  },

  // Contact Information
  contact: {
    phoneDisplay: "+91 80750 53345",           // Displayed on the site
    phoneHref: "tel:+918075053345",            // Used for tel: links
    email: "thirdspacecarehome@gmail.com",
    whatsappDisplay: "+91 80750 53345",
    whatsappHref: "https://wa.me/918075053345", // Full wa.me URL
    addressLine1: "Kadayanikadu PO",
    addressLine2: "Kuttikkattu Valavu",
    city: "Manimala",
    district: "Kottayam",
    state: "Kerala",
    postalCode: "686541",
    country: "India",
    openingHours: "9 AM – 7 PM",
    mapUrl: "https://maps.google.com/?q=GP4J+PH9+Kadayanickadu,+Kerala",
  },

  // Emergency Details
  emergency: {
    available: false,
    disclaimer: "This website is not an emergency service. For urgent medical help, contact your local emergency number or proceed to the nearest emergency department."
  },

  // SEO & Metadata
  seo: {
    siteUrl: "https://canaan-third-space.web.app",
    defaultMetaDescription: "Compassionate medical services and dignified senior residential living in Kerala.",
    ogImage: "https://canaan-third-space.web.app/images/brand/logo.jpg",
  },

  // Feature Toggles (Enable/Disable sections of the site)
  features: {
    enableEmergencyNotice: true,   // Shows the emergency notice banner
    enableWhatsAppAction: true,    // WhatsApp CTA enabled (real number provided)
    enableTestimonials: false,     // Enables the testimonial section
    enableTeamSection: true,       // Enables the care team section
  },

  // Form Provider (For the Contact Form)
  // Supported options: 'demo', 'formspree', 'netlify', 'custom'
  form: {
    provider: 'demo',
    endpoint: '',
  },

  // Social Links
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  }
};
