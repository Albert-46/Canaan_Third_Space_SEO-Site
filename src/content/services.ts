export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  icon?: string;
  enabled: boolean;
}

export const medicalServices: Service[] = [
  {
    id: "opd",
    name: "OPD Consultation",
    shortDescription: "Outpatient consultations in private consultation rooms. Walk-ins are welcome; we recommend calling ahead to confirm doctor availability and reduce your waiting time.",
    enabled: true
  },
  {
    id: "lab",
    name: "Laboratory Services",
    shortDescription: "In-house diagnostic laboratory for blood tests, routine investigations, and specialist panels. Results are communicated directly to your treating doctor for continuity of care.",
    enabled: true
  },
  {
    id: "inpatient",
    name: "Inpatient Admission",
    shortDescription: "Dedicated inpatient care for patients requiring close observation, post-operative recovery, or extended medical treatment in a calm, professionally supervised ward.",
    enabled: true
  }
];

export const seniorCareServices: Service[] = [
  {
    id: "residential",
    name: "Residential Accommodation",
    shortDescription: "Furnished private and semi-private rooms with housekeeping, nutritious daily meals, and 24-hour on-site staff. Residents bring personal items and family photographs to make the space their own.",
    enabled: true
  },
  {
    id: "assistance",
    name: "Daily Living Support",
    shortDescription: "Respectful, dignified assistance with personal hygiene, dressing, medication reminders, mobility support, and structured daily activities — adapted to each resident's individual routine and preferences.",
    enabled: true
  },
  {
    id: "family-support",
    name: "Family Communication",
    shortDescription: "Regular health and well-being updates to families, defined visiting arrangements, and an open-door policy for family discussions with our care team. You are always an informed part of your loved one's care.",
    enabled: true
  }
];
