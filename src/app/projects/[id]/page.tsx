'use client';

import { useDoc, useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { doc, getFirestore, collection, updateDoc, increment } from 'firebase/firestore';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Eye, Film, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Project, Tag } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect } from 'react';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const { id } = params;
    
    // Hardcoding the user ID for the public portfolio.
    const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

    const projectRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, `users/${PORTFOLIO_USER_ID}/projects`, id);
    }, [firestore, id]);
    
    const tagsQuery = useMemoFirebase(() => {
        if(!firestore) return null;
        return collection(firestore, 'tags');
    }, [firestore]);

    const { data: project, isLoading: isLoadingProject } = useDoc<Project>(projectRef);
    const { data: allTags, isLoading: isLoadingTags } = useCollection<Tag>(tagsQuery);
    
    const isLoading = isLoadingProject || isLoadingTags;
    
    useEffect(() => {
        if (projectRef && process.env.NODE_ENV === 'production') {
            updateDoc(projectRef, {
                views: increment(1)
            }).catch(console.error);
        }
    }, [projectRef]);

    const getTagNames = (tagIds: string[]) => {
        if (!allTags || !tagIds) return [];
        return tagIds.map(id => allTags.find(t => t.id === id)?.name).filter(Boolean) as string[];
    }
    
    const renderGalleryItem = (item: { url: string; type: 'image' | 'video' }) => {
        if (item.type === 'video') {
            return (
                <div className="relative aspect-video w-full h-full flex items-center justify-center bg-black rounded-lg">
                    <video controls src={item.url} className="max-h-full max-w-full rounded-lg" />
                </div>
            )
        }
        return (
            <Image
                src={item.url}
                alt={project?.title || 'Project image'}
                fill
                className="rounded-lg object-cover"
            />
        )
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

    const gallery = [
        { url: project.imageUrl, type: 'image' },
        ...(project.gallery || [])
    ];

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
                        <div>
                             <Carousel className="w-full shadow-lg rounded-lg">
                                <CarouselContent>
                                    {gallery.map((item, index) => (
                                    <CarouselItem key={index} className="relative aspect-video">
                                        {renderGalleryItem(item)}
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {gallery.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </>
                                )}
                            </Carousel>
                        </div>
                        <div className="space-y-6">
                             <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{project.title}</h1>
                             <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    <span>{project.views?.toLocaleString() || '0'} views</span>
                                </div>
                             </div>
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
