export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  bio: string;
  image: string;
  enabled: boolean;
}

export const careTeam: TeamMember[] = [
  {
    id: "dr-sarah",
    name: "Dr. Sarah Thomas",
    role: "Chief Medical Officer",
    qualifications: "MBBS, MD (Internal Medicine)",
    bio: "Dr. Thomas brings 15 years of experience in geriatric care and internal medicine, leading our clinical services with profound compassion.",
    image: "/images/team/placeholder-1.jpg", // Replace with real image
    enabled: true
  },
  {
    id: "mathew-joseph",
    name: "Mathew Joseph",
    role: "Facility Director",
    qualifications: "MHA (Hospital Administration)",
    bio: "Mathew ensures the smooth operation of both the medical centre and the senior care home, prioritising resident safety and comfort.",
    image: "/images/team/placeholder-2.jpg", // Replace with real image
    enabled: true
  },
  {
    id: "sr-mary",
    name: "Sister Mary",
    role: "Head Nurse",
    qualifications: "BSc Nursing",
    bio: "With over two decades of nursing experience, Sister Mary leads our nursing staff in delivering exceptional, round-the-clock patient care.",
    image: "/images/team/placeholder-3.jpg", // Replace with real image
    enabled: true
  }
];
