'use client';

import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function VisitorTracker() {
    const firestore = useFirestore();
    const pathname = usePathname();

    useEffect(() => {
        if (!firestore || process.env.NODE_ENV !== 'production') return;

        // We only want to track public-facing pages, not admin routes.
        if (!pathname.startsWith('/admin')) {
             try {
                const visitsRef = collection(firestore, 'visits');
                addDoc(visitsRef, {
                    timestamp: serverTimestamp(),
                    path: pathname,
                });
             } catch (error) {
                console.error("Error logging visit:", error);
             }
        }
    }, [firestore, pathname]);

    return null; // This component does not render anything.
}
