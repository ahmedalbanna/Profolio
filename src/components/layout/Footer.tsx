'use client';
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "admin";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const firestore = getFirestore();
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, `users/${PORTFOLIO_USER_ID}`);
  }, [firestore]);

  const { data: userProfile } = useDoc(userProfileRef);


  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} {userProfile?.fullName || 'Your Name'}. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={userProfile?.githubUrl || '#'} aria-label="GitHub" target="_blank">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={userProfile?.linkedinUrl || '#'} aria-label="LinkedIn" target="_blank">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
