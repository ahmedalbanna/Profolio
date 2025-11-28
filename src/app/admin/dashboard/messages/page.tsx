'use client';
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';

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

export default function MessagesPage() {
    const firestore = useFirestore();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, `contactFormSubmissions`), orderBy('submissionDate', 'desc'));
    }, [firestore]);

    const { data: messages, isLoading } = useCollection(messagesQuery);

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !itemToDelete) return;
        await deleteDoc(doc(firestore, `contactFormSubmissions/${itemToDelete}`));
        setIsAlertOpen(false);
        setItemToDelete(null);
    };
    
    return (
        <div className="animate-in fade-in-0 duration-500">
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this message.
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
                    <CardTitle>Contact Messages</CardTitle>
                    <CardDescription>View messages submitted through your portfolio contact form.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading messages...</p>}
                    {!isLoading && messages && (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">From</TableHead>
                                    <TableHead className="w-[200px]">Email</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="w-[150px]">Received</TableHead>
                                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((msg: any) => (
                                    <TableRow key={msg.id}>
                                        <TableCell className="font-medium">{msg.name}</TableCell>
                                        <TableCell>{msg.email}</TableCell>
                                        <TableCell className="text-muted-foreground">{msg.message}</TableCell>
                                        <TableCell>{msg.submissionDate ? `${formatDistanceToNow(msg.submissionDate.toDate())} ago` : 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => confirmDelete(msg.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {!isLoading && !messages?.length && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">You have no messages yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
