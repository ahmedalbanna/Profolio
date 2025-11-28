'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ExperiencePage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const experiencesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/experiences`);
    }, [user, firestore]);

    const { data: experiences, isLoading } = useCollection(experiencesQuery);

    return (
        <div className="animate-in fade-in-0 duration-500">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Work Experience</CardTitle>
                            <CardDescription>Manage your professional experience.</CardDescription>
                        </div>
                        <Button>Add Experience</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading experiences...</p>}
                    {!isLoading && experiences && (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {experiences.map((exp) => (
                                    <TableRow key={exp.id}>
                                        <TableCell>{exp.role}</TableCell>
                                        <TableCell>{exp.company}</TableCell>
                                        <TableCell>{exp.duration}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                            <Button variant="destructive" size="sm">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {!isLoading && !experiences?.length && (
                        <p className="text-center text-muted-foreground py-8">No experiences added yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
