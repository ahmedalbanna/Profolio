import type { LucideIcon } from "lucide-react";

export interface Skill {
  name: string;
  icon: LucideIcon;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
}
