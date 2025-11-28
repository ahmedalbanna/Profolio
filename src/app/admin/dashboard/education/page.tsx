'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function EducationPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const educationsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/educations`);
    }, [user, firestore]);

    const { data: educations, isLoading } = useCollection(educationsQuery);

    return (
        <div className="animate-in fade-in-0 duration-500">
            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Manage your academic background.</CardDescription>
                        </div>
                        <Button>Add Education</Button>
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
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {educations.map((edu) => (
                                    <TableRow key={edu.id}>
                                        <TableCell>{edu.institution}</TableCell>
                                        <TableCell>{edu.degree}</TableCell>
                                        <TableCell>{edu.duration}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                            <Button variant="destructive" size="sm">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {!isLoading && !educations?.length && (
                        <p className="text-center text-muted-foreground py-8">No education history added yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
