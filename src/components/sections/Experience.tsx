'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore, query, orderBy } from "firebase/firestore";
import { Briefcase } from "lucide-react";
import type { Experience } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export function ExperienceSection() {
    const firestore = getFirestore();
    const experiencesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, `users/${PORTFOLIO_USER_ID}/experiences`),
            orderBy('startDate', 'desc')
        );
    }, [firestore]);

    const { data: experiences, isLoading } = useCollection<Experience>(experiencesQuery);
  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Work Experience
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              My professional journey and key accomplishments.
            </p>
          </div>
           {isLoading && (
             <div className="relative space-y-8">
                 <div className="absolute left-3 sm:left-1/2 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
                {[...Array(3)].map((_, index) => (
                     <div key={index} className="relative flex items-start gap-4 sm:gap-8">
                        <div className="absolute left-3 sm:left-1/2 top-3 w-6 h-6 bg-muted rounded-full flex items-center justify-center -translate-x-1/2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </div>
                         <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:pl-8 sm:order-1'}`}>
                            <Skeleton className="h-5 w-24 mb-2" />
                        </div>
                        <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-8' : 'sm:pr-8'}`}>
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-40 mb-2" />
                                    <Skeleton className="h-5 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full mt-2" />
                                    <Skeleton className="h-4 w-3/4 mt-2" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
             </div>
           )}
          <div className="relative space-y-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
            {!isLoading && experiences && experiences.length > 0 && <div className="absolute left-3 sm:left-1/2 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>}
            {experiences?.map((item, index) => (
              <div key={item.id} className="relative flex items-start gap-4 sm:gap-8">
                <div className="absolute left-3 sm:left-1/2 top-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center -translate-x-1/2">
                   <Briefcase className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:pl-8 sm:order-1'}`}>
                  <p className="text-muted-foreground text-sm font-medium">{item.startDate} - {item.endDate || 'Present'}</p>
                </div>
                <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-8' : 'sm:pr-8'}`}>
                  <Link href={`/experience/${item.id}`} className="block group">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.company}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            ))}
             {!isLoading && !experiences?.length && (
                <p className="text-center text-muted-foreground">No work experience has been added yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
