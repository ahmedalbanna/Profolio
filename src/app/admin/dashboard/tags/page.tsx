'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TagForm } from "@/components/admin/TagForm";
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

export default function TagsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const tagsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/tags`), orderBy('name'));
    }, [user, firestore]);

    const { data: tags, isLoading } = useCollection(tagsQuery);

    const handleAdd = () => {
        setSelectedTag(null);
        setIsFormOpen(true);
    };

    const handleEdit = (tag: any) => {
        setSelectedTag(tag);
        setIsFormOpen(true);
    };

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!user || !firestore || !itemToDelete) return;
        await deleteDoc(doc(firestore, `users/${user.uid}/tags/${itemToDelete}`));
        setIsAlertOpen(false);
        setItemToDelete(null);
    };
    
    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedTag(null);
    }

    return (
        <div className="animate-in fade-in-0 duration-500">
            <TagForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                tag={selectedTag}
            />
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this tag. Deleting a tag does not remove it from projects that are already using it.
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
                            <CardTitle>Tags</CardTitle>
                            <CardDescription>Manage your project tags.</CardDescription>
                        </div>
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2" />
                            Add Tag
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading tags...</p>}
                    {!isLoading && tags && (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.map((tag: any) => (
                                    <TableRow key={tag.id}>
                                        <TableCell className="font-medium">{tag.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(tag)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => confirmDelete(tag.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {!isLoading && !tags?.length && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">No tags added yet.</p>
                             <Button onClick={handleAdd}>
                                <PlusCircle className="mr-2" />
                                Add Your First Tag
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
