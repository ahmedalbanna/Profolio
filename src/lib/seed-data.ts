import { Code, Database, Cloud, Cpu, Server, Puzzle } from "lucide-react";

export const SEED_DATA = {
    userProfile: {
        fullName: "Alex Doe",
        professionalTitle: "Senior Software Engineer",
        bio: "I am a passionate and results-driven Senior Software Engineer with over a decade of experience in designing, developing, and deploying scalable and efficient software solutions. My expertise spans across the full software development lifecycle, from concept to deployment. I thrive in collaborative environments and am dedicated to writing clean, maintainable, and high-quality code. I'm always eager to learn new technologies and take on challenging problems.",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
    },
    tags: ["React", "TypeScript", "D3.js", "Node.js", "React Native", "Firebase", "GraphQL", "Next.js", "Tailwind CSS", "GSAP", "Python", "TensorFlow", "AWS Lambda"],
    projects: [
      {
        title: "QuantumLeap Analytics",
        description: "A comprehensive data analytics dashboard that provides real-time insights and visualizations for business intelligence.",
        tags: ["React", "TypeScript", "D3.js", "Node.js"],
        imageUrl: "https://picsum.photos/seed/p1/600/400",
        projectUrl: "https://example.com",
      },
      {
        title: "ConnectSphere Mobile",
        description: "A cross-platform social networking app designed for professionals to connect and collaborate on projects.",
        tags: ["React Native", "Firebase", "GraphQL"],
        imageUrl: "https://picsum.photos/seed/p2/600/400",
        projectUrl: "https://example.com",
      },
      {
        title: "Orion Branding Site",
        description: "A sleek, modern, and fully responsive marketing website for a creative agency, featuring GSAP animations.",
        tags: ["Next.js", "Tailwind CSS", "GSAP"],
        imageUrl: "https://picsum.photos/seed/p3/600/400",
        projectUrl: "https://example.com",
      },
      {
        title: "Project Minerva",
        description: "A machine learning pipeline for sentiment analysis of customer feedback, deployed on AWS.",
        tags: ["Python", "TensorFlow", "AWS Lambda"],
        imageUrl: "https://picsum.photos/seed/p4/600/400",
        projectUrl: "https://example.com",
      },
    ],
    experiences: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        startDate: "2018",
        endDate: "Present",
        description: "Led the development of a high-traffic e-commerce platform, improving performance by 40%. Mentored junior engineers and implemented best practices in an Agile team. Designed and built microservices architecture for a new suite of products.",
      },
      {
        title: "Software Engineer",
        company: "Innovate Co.",
        startDate: "2015",
        endDate: "2018",
        description: "Developed and maintained features for a SaaS application using modern web technologies. Collaborated with product managers and designers to deliver a seamless user experience. Wrote extensive unit and integration tests to ensure code quality.",
      },
      {
        title: "Junior Developer",
        company: "Digital Creations",
        startDate: "2013",
        endDate: "2015",
        description: "Assisted in the development of client websites and internal tools. Gained foundational experience in web development, version control, and database management.",
      },
    ],
    educations: [
      {
        institution: "State University",
        degree: "M.S. in Computer Science",
        startDate: "2011",
        endDate: "2013",
      },
      {
        institution: "Tech Institute",
        degree: "B.S. in Software Engineering",
        startDate: "2007",
        endDate: "2011",
      },
    ],
    skills: [
        { name: "Frontend", level: 5 },
        { name: "Backend", level: 5 },
        { name: "Databases", level: 4 },
        { name: "DevOps", level: 4 },
        { name: "System Design", level: 4 },
        { name: "Machine Learning", level: 3 },
    ]
};
