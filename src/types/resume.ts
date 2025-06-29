export interface PersonalInfo {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  location: string;
  contactStyle: 'symbols' | 'none';
  photo?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  type: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  additionalInfo?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization?: string;
  category: 'award' | 'recognition' | 'accomplishment' | 'milestone';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient?: {
    from: string;
    to: string;
  };
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Skill[];
  interests: string[];
  aboutMe: string;
  photo?: string;
  certificates: (string | Certificate)[];
  achievements: (string | Achievement)[];
  projects: Project[];
  links: { name: string; url: string }[];
  references: Reference[];
  colorTheme?: ColorTheme;
  skillsConfig?: {
    style: 'dots' | 'pills' | 'bars';
    position: 'left' | 'right';
  };
}

export interface ResumeSection {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
  available: boolean;
  required?: boolean;
}

export type StepType = 'personal' | 'experience' | 'education' | 'skills' | 'aboutMe' | 'languages' | 'interests' | 'certificates' | 'achievements' | 'projects' | 'links' | 'photo' | 'finish';

export interface TemplateConfig {
  id: string;
  name: string;
  availableSections: string[];
  requiredSections: string[];
  buildSteps: StepType[];
}