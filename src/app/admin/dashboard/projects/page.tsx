'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const projectsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/projects`);
    }, [user, firestore]);

    const { data: projects, isLoading } = useCollection(projectsQuery);

    return (
        <div className="animate-in fade-in-0 duration-500">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>Manage your portfolio projects.</CardDescription>
                        </div>
                        <Button>Add Project</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading projects...</p>}
                    {!isLoading && projects && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((proj) => (
                                    <TableRow key={proj.id}>
                                        <TableCell>
                                            <Image src={proj.imageUrl} alt={proj.title} width={80} height={60} className="rounded-md object-cover" />
                                        </TableCell>
                                        <TableCell>{proj.title}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {proj.tags.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                            <Button variant="destructive" size="sm">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {!isLoading && !projects?.length && (
                         <p className="text-center text-muted-foreground py-8">No projects added yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
