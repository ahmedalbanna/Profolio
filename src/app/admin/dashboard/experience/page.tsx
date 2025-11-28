'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { PlusCircle } from "lucide-react";

export default function ExperiencePage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);

    const experiencesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/experiences`);
    }, [user, firestore]);

    const { data: experiences, isLoading } = useCollection(experiencesQuery);

    const handleAdd = () => {
        setSelectedExperience(null);
        setIsFormOpen(true);
    };

    const handleEdit = (exp: any) => {
        setSelectedExperience(exp);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!user || !firestore) return;
        if (confirm("Are you sure you want to delete this experience?")) {
            await deleteDoc(doc(firestore, `users/${user.uid}/experiences/${id}`));
        }
    };
    
    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedExperience(null);
    }

    return (
        <div className="animate-in fade-in-0 duration-500">
            <ExperienceForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                experience={selectedExperience}
            />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Work Experience</CardTitle>
                            <CardDescription>Manage your professional experience.</CardDescription>
                        </div>
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2" />
                            Add Experience
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading experiences...</p>}
                    {!isLoading && experiences && (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {experiences.map((exp: any) => (
                                    <TableRow key={exp.id}>
                                        <TableCell className="font-medium">{exp.title}</TableCell>
                                        <TableCell>{exp.company}</TableCell>
                                        <TableCell>{exp.startDate} - {exp.endDate || 'Present'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(exp)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {!isLoading && !experiences?.length && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">No experiences added yet.</p>
                             <Button onClick={handleAdd}>
                                <PlusCircle className="mr-2" />
                                Add Your First Experience
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
