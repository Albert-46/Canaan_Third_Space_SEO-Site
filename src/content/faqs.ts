import { SITE_CONFIG } from '../config';

export interface FAQ {
  question: string;
  answer: string;
  enabled: boolean;
}

export const faqs: FAQ[] = [
  {
    question: "How can I enquire about senior accommodation?",
    answer: "You can request an admission enquiry using our contact form or call us directly. Our care team will review your needs, explain the admission process, and arrange a facility visit so you can explore the residential environment firsthand.",
    enabled: true
  },
  {
    question: "How do I request a facility visit?",
    answer: "To schedule a visit, simply fill out the contact form or call us with your preferred date and time. We will coordinate a guided tour of the facility and discuss the available medical and residential support.",
    enabled: true
  },
  {
    question: "What should families ask before admission?",
    answer: "We recommend asking about the daily routine, communication processes, level of medical supervision provided, and how we tailor support to individual preferences. We are happy to discuss these in detail during your visit.",
    enabled: true
  },
  {
    question: "Can families visit before making a decision?",
    answer: "Yes, we strongly encourage families and prospective residents to visit before admission. It allows you to experience the environment, meet our care team, and ensure our services align with your needs.",
    enabled: true
  },
  {
    question: "What medical services are available?",
    answer: "Our facility integrates comprehensive medical services including Outpatient Department (OPD) consultations, an in-house laboratory, and dedicated inpatient care. Visit our <a href=\"/services\" style=\"text-decoration: underline;\">Medical Services page</a> for full details.",
    enabled: true
  },
  {
    question: "Is an appointment required for OPD?",
    answer: "While we do accommodate walk-ins when possible, we highly recommend scheduling an appointment via our contact form or by calling us directly to minimize wait times and ensure availability of the required specialist.",
    enabled: true
  },
  {
    question: "Are laboratory services available?",
    answer: "Yes, our in-house diagnostic laboratory supports both our OPD and inpatient care, ensuring timely test results to aid in accurate medical diagnoses.",
    enabled: true
  },
  {
    question: "Can families visit residents in the senior care home?",
    answer: "Family visits are welcomed and actively encouraged as a vital part of resident well-being. Please check with our team for current optimal visiting hours.",
    enabled: true
  },
  {
    question: "Is this an emergency care service?",
    answer: "No. This facility does not operate as an emergency service. For urgent medical situations, please contact your local emergency services (112) or proceed to the nearest emergency department immediately.",
    enabled: true
  }
];
