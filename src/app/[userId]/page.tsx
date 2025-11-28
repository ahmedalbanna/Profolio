'use client';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/About";
import { ExperienceSection } from "@/components/sections/Experience";
import { SkillsSection } from "@/components/sections/Skills";
import { ProjectsSection } from "@/components/sections/Projects";
import { EducationSection } from "@/components/sections/Education";
import { ContactSection } from "@/components/sections/Contact";
import { CertificatesSection } from "@/components/sections/Certificates";
import { useParams } from 'next/navigation';
import { doc, getFirestore } from "firebase/firestore";
import { useDoc, useMemoFirebase } from "@/firebase";
import { UserProfile } from "@/lib/types";

export default function UserPortfolioPage() {
  const params = useParams();
  const userId = params.userId as string;
  const firestore = getFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, `users/${userId}`);
  }, [firestore, userId]);
  
  const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

  if (isLoading) {
    return <div className="flex flex-col min-h-screen items-center justify-center"><p>Loading portfolio...</p></div>
  }

  if (!userProfile) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
            <h1 className="text-4xl font-bold">Portfolio Not Found</h1>
            <p className="mt-4 text-muted-foreground">The portfolio for this user does not exist.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
