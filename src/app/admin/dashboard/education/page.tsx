'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EducationForm } from "@/components/admin/EducationForm";
import { PlusCircle } from "lucide-react";

export default function EducationPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(null);

    const educationsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/educations`);
    }, [user, firestore]);

    const { data: educations, isLoading } = useCollection(educationsQuery);

    const handleAdd = () => {
        setSelectedEducation(null);
        setIsFormOpen(true);
    };

    const handleEdit = (edu: any) => {
        setSelectedEducation(edu);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!user || !firestore) return;
        if (confirm("Are you sure you want to delete this education entry?")) {
            await deleteDoc(doc(firestore, `users/${user.uid}/educations/${id}`));
        }
    };
    
    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedEducation(null);
    }

    return (
        <div className="animate-in fade-in-0 duration-500">
            <EducationForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                education={selectedEducation}
            />
            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Manage your academic background.</CardDescription>
                        </div>
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2" />
                            Add Education
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading education history...</p>}
                    {!isLoading && educations && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Degree</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {educations.map((edu: any) => (
                                    <TableRow key={edu.id}>
                                        <TableCell className="font-medium">{edu.institution}</TableCell>
                                        <TableCell>{edu.degree}</TableCell>
                                        <TableCell>{edu.startDate} - {edu.endDate || 'Present'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(edu)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(edu.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {!isLoading && !educations?.length && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">No education history added yet.</p>
                             <Button onClick={handleAdd}>
                                <PlusCircle className="mr-2" />
                                Add Your First Education Entry
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
