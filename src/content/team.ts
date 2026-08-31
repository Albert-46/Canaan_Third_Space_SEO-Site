export interface TeamRole {
  id: string;
  role: string;
  responsibility: string;
  enabled: boolean;
}

/**
 * Care Team Roles
 *
 * We do not publish individual staff names or photographs on this public website
 * to protect staff privacy. Families are welcome to meet the care team during a
 * facility visit.
 *
 * To add named team members in future, restore the TeamMember interface and
 * supply verified names, qualifications, and photos with staff consent.
 */
export const careTeamRoles: TeamRole[] = [
  {
    id: "medical-officer",
    role: "Medical Officer",
    responsibility: "Responsible for clinical assessments, OPD consultations, inpatient care plans, and medical oversight of all residents in the senior care home. The medical officer conducts regular ward rounds and is available for consultation by appointment.",
    enabled: true
  },
  {
    id: "nursing-staff",
    role: "Nursing Team",
    responsibility: "Our registered nurses provide 24-hour care across the medical centre and residential wing. They administer medications, monitor vital signs, coordinate with the medical officer on any clinical changes, and are the primary daily point of contact for patients and residents.",
    enabled: true
  },
  {
    id: "care-coordinators",
    role: "Residential Care Staff",
    responsibility: "Dedicated caregivers who assist residents with daily living activities — personal hygiene, mobility, meals, and recreational activities. They work alongside the nursing team and report any changes in a resident's condition or well-being promptly.",
    enabled: true
  },
  {
    id: "facility-admin",
    role: "Admissions & Administration",
    responsibility: "Our admissions team handles enquiries from families, coordinates facility visits, explains the admission process, and manages day-to-day administrative needs. They are the first point of contact for new enquiries.",
    enabled: true
  }
];
