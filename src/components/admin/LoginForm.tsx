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
import { useAuth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage(undefined);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (signInError) {
      if (
        signInError instanceof FirebaseError &&
        signInError.code === "auth/user-not-found"
      ) {
        try {
          await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
        } catch (signUpError) {
          if (signUpError instanceof FirebaseError) {
            setErrorMessage(signUpError.message);
          } else {
            setErrorMessage("An unexpected error occurred during sign-up.");
          }
        }
      } else if (signInError instanceof FirebaseError) {
        if (signInError.code === 'auth/invalid-credential') {
             setErrorMessage("Incorrect password. Please try again.");
        } else {
            setErrorMessage(signInError.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred during sign-in.");
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
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
            <LoginButton />
          </CardFooter>
        </Card>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}
