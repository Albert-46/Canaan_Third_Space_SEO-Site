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
    shortDescription: "Professional outpatient consultations in private consultation rooms. Patients are seen by appointment.",
    enabled: true
  },
  {
    id: "lab",
    name: "Laboratory Services",
    shortDescription: "In-house diagnostic laboratory for blood tests and routine investigations. Results communicated via doctor.",
    enabled: true
  },
  {
    id: "ipd",
    name: "Inpatient Admission",
    shortDescription: "Comfortable inpatient care for patients requiring observation or extended treatment.",
    enabled: true
  }
];

export const seniorCareServices: Service[] = [
  {
    id: "residential",
    name: "Residential Care",
    shortDescription: "A comfortable, dignified residential environment for senior citizens.",
    enabled: true
  },
  {
    id: "assistance",
    name: "Daily Assistance",
    shortDescription: "Respectful support with daily routines including personal hygiene, mobility, and meals.",
    enabled: true
  },
  {
    id: "family-support",
    name: "Family Support",
    shortDescription: "Regular family updates, defined visiting arrangements, and clear communication processes.",
    enabled: true
  }
];
