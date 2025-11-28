'use client';
import { Card, CardContent } from "@/components/ui/card";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore, query, orderBy } from "firebase/firestore";
import { Code, Database, Cloud, Cpu, Server, Puzzle } from "lucide-react";
import type { Skill } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { useParams } from 'next/navigation';

const iconMap: { [key: string]: React.ElementType } = {
  Frontend: Code,
  Backend: Server,
  Databases: Database,
  DevOps: Cloud,
  "System Design": Puzzle,
  "Machine Learning": Cpu,
  Default: Code
};

export function SkillsSection() {
    const firestore = getFirestore();
    const params = useParams();
    const userId = params.userId as string;

    const skillsQuery = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return query(collection(firestore, `users/${userId}/skills`), orderBy('name'));
    }, [firestore, userId]);

    const { data: skills, isLoading } = useCollection<Skill>(skillsQuery);

    return (
        <section id="skills" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                My Skills
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                A snapshot of my technical capabilities.
            </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
             {isLoading &&
                [...Array(6)].map((_, i) => (
                <Card key={i} className="flex flex-col items-center justify-center p-6 text-center">
                    <CardContent className="p-0 flex flex-col items-center">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-6 w-24" />
                    </CardContent>
                </Card>
            ))}
            {skills?.map((skill) => {
                const Icon = iconMap[skill.name] || iconMap.Default;
                return (
                    <Link key={skill.id} href={`/${userId}/skills/${skill.id}`} className="group">
                        <Card className="flex flex-col items-center justify-center p-6 text-center h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-0 flex flex-col items-center">
                            <Icon className="h-12 w-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                            <p className="font-semibold">{skill.name}</p>
                        </CardContent>
                        </Card>
                    </Link>
                );
            })}
             {!isLoading && !skills?.length && (
                <p className="text-center text-muted-foreground col-span-full">No skills have been added yet.</p>
            )}
            </div>
        </div>
        </section>
    );
}
