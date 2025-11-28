'use client';
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "admin";

export function AboutSection() {
    const firestore = getFirestore();
    const userProfileRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, `users/${PORTFOLIO_USER_ID}`);
    }, [firestore]);

    const { data: userProfile, isLoading } = useDoc(userProfileRef);

  return (
    <section id="about" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            About Me
          </h2>
          {isLoading ? (
            <div className="space-y-3 mt-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
          ) : (
             <p className="mt-6 text-lg leading-8 text-foreground/80">
                {userProfile?.bio || "A brief biography will be displayed here once it's configured in the admin dashboard."}
             </p>
          )}
        </div>
      </div>
    </section>
  );
}
