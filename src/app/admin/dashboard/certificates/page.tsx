'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CertificateForm } from "@/components/admin/CertificateForm";
import { PlusCircle, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';
import Link from 'next/link';

export default function CertificatesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const certificatesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/certificates`), orderBy('issueDate', 'desc'));
    }, [user, firestore]);

    const { data: certificates, isLoading } = useCollection(certificatesQuery);

    const handleAdd = () => {
        setSelectedCertificate(null);
        setIsFormOpen(true);
    };

    const handleEdit = (cert: any) => {
        setSelectedCertificate(cert);
        setIsFormOpen(true);
    };

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!user || !firestore || !itemToDelete) return;
        await deleteDoc(doc(firestore, `users/${user.uid}/certificates/${itemToDelete}`));
        setIsAlertOpen(false);
        setItemToDelete(null);
    };
    
    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedCertificate(null);
    }

    return (
        <div className="animate-in fade-in-0 duration-500">
            <CertificateForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                certificate={selectedCertificate}
            />
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this certificate entry.
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
                            <CardTitle>Certificates</CardTitle>
                            <CardDescription>Manage your professional certificates.</CardDescription>
                        </div>
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2" />
                            Add Certificate
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading certificates...</p>}
                    {!isLoading && certificates && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Certificate Name</TableHead>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Link</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {certificates.map((cert: any) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-medium">{cert.name}</TableCell>
                                        <TableCell>{cert.issuingOrganization}</TableCell>
                                        <TableCell>{cert.issueDate}</TableCell>
                                        <TableCell>
                                            {cert.credentialUrl && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={cert.credentialUrl} target="_blank">
                                                        View <ExternalLink className="ml-2 h-3 w-3"/>
                                                    </Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(cert)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => confirmDelete(cert.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {!isLoading && !certificates?.length && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">No certificates added yet.</p>
                             <Button onClick={handleAdd}>
                                <PlusCircle className="mr-2" />
                                Add Your First Certificate
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    