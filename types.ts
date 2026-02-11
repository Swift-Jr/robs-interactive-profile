export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  skills: string[];
  tags: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  years: string;
}

export interface AwardItem {
  id: string;
  title: string;
  description?: string;
}

export interface PrincipleItem {
  id: string;
  title: string;
  description: string;
}

export interface InterestItem {
  id: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  linkedin: string;
}

export interface CVData {
  name: string;
  title: string;
  profileImage?: string;
  pdfUrl?: string;
  contact: ContactInfo;
  heroBlurb: string;
  summary: string;
  videoUrl?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  awards: AwardItem[];
  principles: PrincipleItem[];
  interests: InterestItem[];
}