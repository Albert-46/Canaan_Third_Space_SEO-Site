export interface Testimonial {
  id: string;
  author: string;
  relation: string; // e.g., "Daughter of resident", "Patient"
  quote: string;
  enabled: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Anita R.",
    relation: "Daughter of Resident",
    quote: "Finding a place that genuinely respects and cares for my mother was a relief. The team here doesn't just provide medical support; they provide true companionship.",
    enabled: true
  },
  {
    id: "t2",
    author: "George M.",
    relation: "Outpatient",
    quote: "The doctors are attentive, and the clinic is exceptionally clean and calm. It does not feel like a typical hospital, which makes every visit much less stressful.",
    enabled: true
  },
  {
    id: "t3",
    author: "The Varghese Family",
    relation: "Family of Resident",
    quote: "We appreciate the transparent communication. Knowing our father is in safe hands, with medical help immediately available if needed, gives us total peace of mind.",
    enabled: true
  }
];
