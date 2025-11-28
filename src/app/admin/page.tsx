"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/admin/dashboard");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-10 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
          <p className="text-muted-foreground">
            Sign in to manage your portfolio.
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            &larr; Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

// Added Card and Card parts to imports for skeleton loading state
import { Card, CardContent, CardFooter } from "@/components/ui/card";
