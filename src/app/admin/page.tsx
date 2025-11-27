import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
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
