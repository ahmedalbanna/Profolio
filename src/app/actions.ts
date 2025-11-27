"use server";

import { redirect } from "next/navigation";

// This is a mock authentication function.
// In a real application, you would use a library like NextAuth.js or custom logic
// to verify credentials against a database.
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Mock credentials
    const validEmail = "admin@example.com";
    const validPassword = "password";

    if (email !== validEmail || password !== validPassword) {
      return "Invalid email or password.";
    }

    // On successful login, you would typically create a session.
    // For this demo, we'll just redirect.
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "Invalid credentials.";
    }
    return "Something went wrong.";
  }

  redirect("/admin/dashboard");
}
