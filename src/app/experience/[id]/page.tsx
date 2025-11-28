'use client';

import { useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Experience } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export default function ExperienceDetailsPage({ params }: { params: { id: string } }) {
    const firestore = getFirestore();
    
    const experienceRef = useMemoFirebase(() => {
        if (!firestore || !params.id) return null;
        return doc(firestore, `users/${PORTFOLIO_USER_ID}/experiences`, params.id);
    }, [firestore, params.id]);

    const { data: experience, isLoading } = useDoc<Experience>(experienceRef);
    
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                        <div className="mb-8">
                             <Skeleton className="h-10 w-40" />
                        </div>
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-5 w-1/3 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-5/6" />
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!experience) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">Experience Not Found</h1>
                        <p className="mt-4 text-muted-foreground">The work experience you are looking for does not exist.</p>
                        <Button asChild className="mt-6">
                            <Link href="/#experience">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Experience
                            </Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 md:py-24 lg:py-32 bg-background animate-in fade-in-0 duration-500">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/#experience">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Timeline
                            </Link>
                        </Button>
                    </div>
                    <Card className="shadow-lg">
                         <CardHeader className="p-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl sm:text-3xl">{experience.title}</CardTitle>
                                    <CardDescription className="text-lg mt-1">{experience.company}</CardDescription>
                                    <p className="text-sm text-muted-foreground mt-2">{experience.startDate} - {experience.endDate || 'Present'}</p>
                                </div>
                            </div>
                         </CardHeader>
                         <CardContent className="p-8 pt-0">
                             <p className="text-base text-foreground/80 leading-relaxed">
                                {experience.description}
                             </p>
                         </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
