'use client';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore, query } from "firebase/firestore";
import type { Project, Tag } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export function ProjectsSection() {
    const firestore = getFirestore();

    const projectsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, `users/${PORTFOLIO_USER_ID}/projects`));
    }, [firestore]);

    const tagsQuery = useMemoFirebase(() => {
        if(!firestore) return null;
        return collection(firestore, 'tags');
    }, [firestore]);

    const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);
    const { data: allTags, isLoading: isLoadingTags } = useCollection<Tag>(tagsQuery);
    
    const isLoading = isLoadingProjects || isLoadingTags;

    const getTagNames = (tagIds: string[]) => {
        if (!allTags || !tagIds) return [];
        return tagIds.map(id => allTags.find(t => t.id === id)?.name).filter(Boolean) as string[];
    }

  return (
    <section id="projects" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A selection of my recent work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
           {isLoading && 
            [...Array(4)].map((_, i) => (
                 <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                        <Skeleton className="h-60 w-full" />
                        <div className="p-6">
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-5 w-full mb-4" />
                            <Skeleton className="h-5 w-3/4 mb-4" />
                             <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            ))
           }
          {projects?.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="overflow-hidden h-full group-hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                    <div className="relative h-60 w-full">
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    </div>
                    <div className="p-6">
                    <CardTitle className="mb-2">{project.title}</CardTitle>
                    <CardDescription className="mb-4 line-clamp-2">{project.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                        {getTagNames(project.tagIds).map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                        ))}
                    </div>
                    </div>
                </CardContent>
                </Card>
            </Link>
          ))}
           {!isLoading && !projects?.length && (
                <p className="text-center text-muted-foreground col-span-full">No projects have been added yet.</p>
            )}
        </div>
      </div>
    </section>
  );
}
