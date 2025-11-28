import type { LucideIcon } from "lucide-react";

export interface Skill {
  id: string;
  userProfileId: string;
  name: string;
  level: number;
  description?: string;
  icon?: LucideIcon; // Icon can be optional now
}

export interface Experience {
  id: string;
  userProfileId: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id: string;
  userProfileId: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Project {
  id: string;
  userProfileId: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  tagIds: string[];
  views?: number;
  gallery?: {
    url: string;
    type: 'image' | 'video';
  }[];
}

export interface Tag {
    id: string;
    userProfileId: string;
    name: string;
}

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    bio: string;
    linkedinUrl?: string;
    githubUrl?: string;
    professionalTitle?: string;
}

export interface Certificate {
  id: string;
  userProfileId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl?: string;
  imageUrl?: string;
}
