"use client";

import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { doc } from "firebase/firestore";

const formSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage(undefined);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Create a user profile document in Firestore
      const userProfileRef = doc(firestore, `users/${user.uid}`);
      const profileData = {
        id: user.uid,
        email: values.email,
        fullName: values.fullName,
        professionalTitle: "Your Professional Title",
        bio: "This is your biography. You can edit this in the settings.",
        githubUrl: "",
        linkedinUrl: "",
      };
      setDocumentNonBlocking(userProfileRef, profileData, { merge: false });

    } catch (signUpError) {
      if (signUpError instanceof FirebaseError) {
        if (signUpError.code === "auth/email-already-in-use") {
            setErrorMessage("This email is already registered. Please sign in instead.");
        } else {
            setErrorMessage(signUpError.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred during sign-up.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <RegisterButton />
          </CardFooter>
        </Card>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  );
}
