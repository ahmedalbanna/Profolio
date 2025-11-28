'use client';
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { useParams } from 'next/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const firestore = getFirestore();
  const params = useParams();
  const userId = params.userId as string;

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, `users/${userId}`);
  }, [firestore, userId]);

  const { data: userProfile } = useDoc(userProfileRef);

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} {userProfile?.fullName || 'Your Name'}. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {userProfile?.githubUrl && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={userProfile.githubUrl} aria-label="GitHub" target="_blank">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {userProfile?.linkedinUrl && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={userProfile.linkedinUrl} aria-label="LinkedIn" target="_blank">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
