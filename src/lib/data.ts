import type { Skill, Experience, Education, Project } from "./types";
import { Code, Database, Cloud, Cpu, Server, Puzzle } from "lucide-react";

export const PROFESSIONAL_NAME = "Alex Doe";
export const PROFESSIONAL_TITLE = "Senior Software Engineer";

export const ABOUT_ME = "I am a passionate and results-driven Senior Software Engineer with over a decade of experience in designing, developing, and deploying scalable and efficient software solutions. My expertise spans across the full software development lifecycle, from concept to deployment. I thrive in collaborative environments and am dedicated to writing clean, maintainable, and high-quality code. I'm always eager to learn new technologies and take on challenging problems.";

export const SKILLS: Skill[] = [
  { name: "Frontend", icon: Code },
  { name: "Backend", icon: Server },
  { name: "Databases", icon: Database },
  { name: "DevOps", icon: Cloud },
  { name: "System Design", icon: Puzzle },
  { name: "Machine Learning", icon: Cpu },
];

export const EXPERIENCE: Experience[] = [
  {
    role: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    duration: "2018 - Present",
    description: "Led the development of a high-traffic e-commerce platform, improving performance by 40%. Mentored junior engineers and implemented best practices in an Agile team. Designed and built microservices architecture for a new suite of products.",
  },
  {
    role: "Software Engineer",
    company: "Innovate Co.",
    duration: "2015 - 2018",
    description: "Developed and maintained features for a SaaS application using modern web technologies. Collaborated with product managers and designers to deliver a seamless user experience. Wrote extensive unit and integration tests to ensure code quality.",
  },
  {
    role: "Junior Developer",
    company: "Digital Creations",
    duration: "2013 - 2015",
    description: "Assisted in the development of client websites and internal tools. Gained foundational experience in web development, version control, and database management.",
  },
];

export const EDUCATION: Education[] = [
  {
    institution: "State University",
    degree: "M.S. in Computer Science",
    duration: "2011 - 2013",
  },
  {
    institution: "Tech Institute",
    degree: "B.S. in Software Engineering",
    duration: "2007 - 2011",
  },
];

export const PROJECTS: Project[] = [
  {
    title: "QuantumLeap Analytics",
    description: "A comprehensive data analytics dashboard that provides real-time insights and visualizations for business intelligence.",
    tags: ["React", "TypeScript", "D3.js", "Node.js"],
    imageUrl: "https://picsum.photos/seed/p1/600/400",
    imageHint: "dashboard interface",
  },
  {
    title: "ConnectSphere Mobile",
    description: "A cross-platform social networking app designed for professionals to connect and collaborate on projects.",
    tags: ["React Native", "Firebase", "GraphQL"],
    imageUrl: "https://picsum.photos/seed/p2/600/400",
    imageHint: "mobile shopping",
  },
  {
    title: "Orion Branding Site",
    description: "A sleek, modern, and fully responsive marketing website for a creative agency, featuring GSAP animations.",
    tags: ["Next.js", "Tailwind CSS", "GSAP"],
    imageUrl: "https://picsum.photos/seed/p3/600/400",
    imageHint: "minimalist website",
  },
  {
    title: "Project Minerva",
    description: "A machine learning pipeline for sentiment analysis of customer feedback, deployed on AWS.",
    tags: ["Python", "TensorFlow", "AWS Lambda"],
    imageUrl: "https://picsum.photos/seed/p4/600/400",
    imageHint: "data visualization",
  },
];
