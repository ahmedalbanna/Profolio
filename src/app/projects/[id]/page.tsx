'use client';

import { useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, getFirestore, collection } from 'firebase/firestore';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Project, Tag } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const firestore = getFirestore();
    
    // Hardcoding the user ID for the public portfolio.
    const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

    const projectRef = useMemoFirebase(() => {
        if (!firestore || !params.id) return null;
        return doc(firestore, `users/${PORTFOLIO_USER_ID}/projects`, params.id);
    }, [firestore, params.id]);
    
    const tagsQuery = useMemoFirebase(() => {
        if(!firestore) return null;
        return collection(firestore, 'tags');
    }, [firestore]);

    const { data: project, isLoading: isLoadingProject } = useDoc<Project>(projectRef);
    const { data: allTags, isLoading: isLoadingTags } = useCollection<Tag>(tagsQuery);
    
    const isLoading = isLoadingProject || isLoadingTags;

    const getTagNames = (tagIds: string[]) => {
        if (!allTags || !tagIds) return [];
        return tagIds.map(id => allTags.find(t => t.id === id)?.name).filter(Boolean) as string[];
    }

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mb-8">
                             <Skeleton className="h-10 w-40" />
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                             <div>
                                <Skeleton className="w-full h-96 rounded-lg" />
                             </div>
                             <div className="space-y-6">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-24 w-full" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-12 w-48" />
                             </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">Project Not Found</h1>
                        <p className="mt-4 text-muted-foreground">The project you are looking for does not exist.</p>
                        <Button asChild className="mt-6">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
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
            <main className="flex-1 py-12 md:py-24 lg:py-32 animate-in fade-in-0 duration-500">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/#projects">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                All Projects
                            </Link>
                        </Button>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
                        <div className="relative aspect-video">
                             <Image
                                src={project.imageUrl}
                                alt={project.title}
                                fill
                                className="rounded-lg object-cover shadow-lg"
                             />
                        </div>
                        <div className="space-y-6">
                             <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{project.title}</h1>
                             <p className="text-lg text-muted-foreground leading-relaxed">
                                {project.description}
                             </p>
                             <div className="flex flex-wrap gap-2">
                                {getTagNames(project.tagIds).map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                            {project.projectUrl && (
                                <Button asChild size="lg">
                                    <Link href={project.projectUrl} target="_blank">
                                        View Project
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
