'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PlusCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const projectsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/projects`);
    }, [user, firestore]);

    const { data: projects, isLoading } = useCollection(projectsQuery);

    const handleAdd = () => {
        setSelectedProject(null);
        setIsFormOpen(true);
    };

    const handleEdit = (proj: any) => {
        setSelectedProject(proj);
        setIsFormOpen(true);
    };

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!user || !firestore || !itemToDelete) return;
        await deleteDoc(doc(firestore, `users/${user.uid}/projects/${itemToDelete}`));
        setIsAlertOpen(false);
        setItemToDelete(null);
    };
    
    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedProject(null);
    }

    // This is a temporary way to handle tags, which are stored as an array of IDs.
    // In a real app, you'd fetch the tag names from the 'tags' collection.
    const tagsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'tags') : null, [firestore]);
    const { data: allTags } = useCollection(tagsQuery);

    const getTagNames = (tagIds: string[]) => {
        if (!allTags || !tagIds) return [];
        return tagIds.map(id => allTags.find(t => t.id === id)?.name).filter(Boolean);
    }

    return (
        <div className="animate-in fade-in-0 duration-500">
            <ProjectForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                project={selectedProject}
            />
             <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this project.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>Manage your portfolio projects.</CardDescription>
                        </div>
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2" />
                            Add Project
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading projects...</p>}
                    {!isLoading && projects && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((proj: any) => (
                                    <TableRow key={proj.id}>
                                        <TableCell>
                                            <Image src={proj.imageUrl} alt={proj.title} width={80} height={60} className="rounded-md object-cover" />
                                        </TableCell>
                                        <TableCell className="font-medium">{proj.title}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {getTagNames(proj.tagIds).map((tagName: string) => <Badge key={tagName} variant="secondary">{tagName}</Badge>)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(proj)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => confirmDelete(proj.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {!isLoading && !projects?.length && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">No projects added yet.</p>
                             <Button onClick={handleAdd}>
                                <PlusCircle className="mr-2" />
                                Add Your First Project
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
