'use client';
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore, query, orderBy } from "firebase/firestore";
import { Award } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";

// Define a default user ID for the public-facing portfolio.
const PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export function CertificatesSection() {
    const firestore = getFirestore();
    const certificatesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, `users/${PORTFOLIO_USER_ID}/certificates`),
            orderBy('issueDate', 'desc')
        );
    }, [firestore]);

    const { data: certificates, isLoading } = useCollection<Certificate>(certificatesQuery);

  return (
    <section id="certificates" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Certificates
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My professional certifications and credentials.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
          {isLoading &&
            [...Array(3)].map((_, i) => (
               <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-5 w-1/2" />
                          <Skeleton className="h-4 w-1/3 mt-2" />
                      </div>
                  </CardContent>
               </Card>
          ))}
          {certificates?.map((cert) => (
            <Link key={cert.id} href={`/certificates/${cert.id}`} className="group">
              <Card className="flex flex-col h-full overflow-hidden group-hover:shadow-lg transition-shadow">
                {cert.imageUrl && (
                    <div className="relative h-48 w-full">
                        <Image src={cert.imageUrl} alt={cert.name} fill className="object-cover"/>
                    </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <CardDescription className="mt-1">{cert.issuingOrganization}</CardDescription>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{cert.issueDate}</p>
                </div>
              </Card>
            </Link>
          ))}
            {!isLoading && !certificates?.length && (
                <p className="text-center text-muted-foreground col-span-full">No certificates have been added yet.</p>
            )}
        </div>
      </div>
    </section>
  );
}

    