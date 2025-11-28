'use client';

import { useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, Database, Cloud, Cpu, Server, Puzzle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Skill } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

const iconMap: { [key: string]: React.ElementType } = {
  Frontend: Code,
  Backend: Server,
  Databases: Database,
  DevOps: Cloud,
  "System Design": Puzzle,
  "Machine Learning": Cpu,
  Default: Code
};

export default function SkillDetailsPage({ params }: { params: { id: string } }) {
    const firestore = getFirestore();
    const { id } = params;
    
    const skillRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, `users/${PORTFOLIO_USER_ID}/skills`, id);
    }, [firestore, id]);

    const { data: skill, isLoading } = useDoc<Skill>(skillRef);

    const Icon = skill ? iconMap[skill.name] || iconMap.Default : null;
    
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
                            <CardHeader className="items-center text-center">
                                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                                <Skeleton className="h-10 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                     <Skeleton className="h-5 w-24" />
                                     <Skeleton className="h-8 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-5/6" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!skill) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">Skill Not Found</h1>
                        <p className="mt-4 text-muted-foreground">The skill you are looking for does not exist.</p>
                        <Button asChild className="mt-6">
                            <Link href="/#skills">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Skills
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
            <main className="flex-1 py-12 md:py-24 lg:py-32 bg-card animate-in fade-in-0 duration-500">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/#skills">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                All Skills
                            </Link>
                        </Button>
                    </div>
                    <Card className="shadow-lg">
                         <CardHeader className="items-center text-center p-8">
                            {Icon && <Icon className="h-16 w-16 text-primary mb-4" />}
                            <CardTitle className="text-3xl sm:text-4xl">{skill.name}</CardTitle>
                         </CardHeader>
                         <CardContent className="p-8 pt-0 space-y-6">
                            <div className="text-center">
                                <p className="text-muted-foreground">Proficiency Level</p>
                                <div className="flex items-center gap-2 justify-center mt-2">
                                    <Progress value={skill.level * 20} className="w-40 h-3" />
                                    <span className="font-bold text-primary">{skill.level}/5</span>
                                </div>
                            </div>
                             <p className="text-lg text-muted-foreground leading-relaxed text-center">
                                {skill.description}
                             </p>
                         </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
