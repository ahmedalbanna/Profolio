'use client';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore, query } from "firebase/firestore";
import type { Project, Tag } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export function ProjectsSection() {
    const firestore = getFirestore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

    const handleTagClick = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
    }
    
    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        return projects.filter(project => {
            const matchesSearch = searchQuery.length > 1 ? 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            
            const matchesTags = selectedTags.length > 0 ? 
                selectedTags.every(tagId => project.tagIds.includes(tagId))
                : true;

            return matchesSearch && matchesTags;
        });
    }, [projects, searchQuery, selectedTags]);


  return (
    <section id="projects" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A selection of my recent work. Search by title, description, or filter by tags.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12">
            <Input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
            />
             <div className="flex flex-wrap gap-2 justify-center">
                {isLoadingTags ? (
                     [...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-24 rounded-full" />)
                ) : (
                    allTags?.map(tag => (
                        <Badge 
                            key={tag.id}
                            variant={selectedTags.includes(tag.id) ? "default" : "secondary"}
                            onClick={() => handleTagClick(tag.id)}
                            className="cursor-pointer transition-colors"
                        >
                            {tag.name}
                        </Badge>
                    ))
                )}
            </div>
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
          {!isLoading && filteredProjects.map((project) => (
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
            {!isLoading && projects?.length > 0 && filteredProjects.length === 0 && (
                <p className="text-center text-muted-foreground col-span-full">No projects match your search.</p>
            )}
        </div>
      </div>
    </section>
  );
}
