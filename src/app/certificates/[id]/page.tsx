'use client';

import { useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Certificate } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export default function CertificateDetailsPage({ params }: { params: { id: string } }) {
    const firestore = getFirestore();
    const { id } = params;
    
    const certificateRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, `users/${PORTFOLIO_USER_ID}/certificates`, id);
    }, [firestore, id]);

    const { data: certificate, isLoading } = useDoc<Certificate>(certificateRef);
    
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                        <div className="mb-8">
                             <Skeleton className="h-10 w-40" />
                        </div>
                        <Card>
                            <CardHeader className="text-center">
                                <Skeleton className="h-10 w-3/4 mx-auto" />
                                <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-80 w-full" />
                                <Skeleton className="h-10 w-48 mx-auto" />
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!certificate) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">Certificate Not Found</h1>
                        <p className="mt-4 text-muted-foreground">The certificate you are looking for does not exist.</p>
                        <Button asChild className="mt-6">
                            <Link href="/#certificates">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Certificates
                            </Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 md:py-24 lg:py-32 bg-background animate-in fade-in-0 duration-500">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/#certificates">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Certificates
                            </Link>
                        </Button>
                    </div>
                    <Card className="shadow-lg">
                         <CardHeader className="p-8 text-center">
                            <CardTitle className="text-2xl sm:text-3xl">{certificate.name}</CardTitle>
                            <CardDescription className="text-lg mt-1">{certificate.issuingOrganization}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-2">Issued on {certificate.issueDate}</p>
                         </CardHeader>
                         <CardContent className="p-8 pt-0 flex flex-col items-center gap-6">
                             {certificate.imageUrl && (
                                 <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border">
                                    <Image src={certificate.imageUrl} alt={certificate.name} fill className="object-contain" />
                                 </div>
                             )}
                             {certificate.credentialUrl && (
                                 <Button asChild>
                                     <Link href={certificate.credentialUrl} target="_blank">
                                        View Credential
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                     </Link>
                                 </Button>
                             )}
                         </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
