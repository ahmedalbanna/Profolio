'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

// Define a default user ID for the public-facing portfolio.
// In a multi-user scenario, this would be dynamic.
const PORTFOLIO_USER_ID = "admin";

export function HeroSection() {
  const firestore = getFirestore();
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, `users/${PORTFOLIO_USER_ID}`);
  }, [firestore]);

  const { data: userProfile, isLoading } = useDoc(userProfileRef);

  if (isLoading) {
    return (
       <section id="hero" className="relative w-full h-[80svh] min-h-[500px] flex items-center justify-center">
         <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <div className="mt-4 flex justify-center gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
         </div>
       </section>
    )
  }

  return (
    <section id="hero" className="relative w-full h-[80svh] min-h-[500px] flex items-center justify-center animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {userProfile?.fullName || "Your Name"}
          </h1>
          <p className="mt-4 text-lg text-foreground/80 sm:text-xl md:mt-6 md:text-2xl">
            {userProfile?.professionalTitle || "Your Professional Title"}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="#projects">View My Work</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <Link href="#about" aria-label="Scroll to about section">
          <div className="animate-bounce text-primary">
            <ArrowDown className="h-8 w-8" />
          </div>
        </Link>
      </div>
    </section>
  );
}
