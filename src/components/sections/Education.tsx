'use client';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore, query, orderBy } from "firebase/firestore";
import { GraduationCap } from "lucide-react";
import type { Education } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";


export function EducationSection() {
    const firestore = getFirestore();
    const educationsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, `users/${PORTFOLIO_USER_ID}/educations`),
            orderBy('startDate', 'desc')
        );
    }, [firestore]);

    const { data: educations, isLoading } = useCollection<Education>(educationsQuery);

  return (
    <section id="education" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Education
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My academic background.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
          {isLoading &&
            [...Array(2)].map((_, i) => (
              <Card key={i} className="flex items-start p-6">
                <div className="mr-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <div className="w-full">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-5 w-32" />
                   <Skeleton className="h-4 w-24 mt-2" />
                </div>
              </Card>
          ))}
          {educations?.map((edu) => (
            <Card key={edu.id} className="flex items-start p-6">
              <div className="mr-4">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">{edu.institution}</CardTitle>
                <CardDescription className="mt-1">{edu.degree}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">{edu.startDate} - {edu.endDate || 'Present'}</p>
              </div>
            </Card>
          ))}
            {!isLoading && !educations?.length && (
                <p className="text-center text-muted-foreground col-span-full">No education history has been added yet.</p>
            )}
        </div>
      </div>
    </section>
  );
}
