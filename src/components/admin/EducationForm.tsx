'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';

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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useEffect } from "react";

const formSchema = z.object({
  institution: z.string().min(2, "Institution must be at least 2 characters."),
  degree: z.string().min(2, "Degree must be at least 2 characters."),
  startDate: z.string().min(4, "Start date is required."),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  education?: z.infer<typeof formSchema> & { id?: string } | null;
}

export function EducationForm({ isOpen, onClose, education }: EducationFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });
  
  useEffect(() => {
    if (education) {
      form.reset(education);
    } else {
      form.reset({
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [education, form, isOpen]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Error", description: "Authentication error." });
        return;
    }

    const educationId = education?.id || uuidv4();
    const docRef = doc(firestore, `users/${user.uid}/educations/${educationId}`);
    
    const dataToSave = {
        ...values,
        id: educationId,
        userProfileId: user.uid
    };

    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: education ? "Education Updated" : "Education Added",
        description: `${values.degree} at ${values.institution} has been saved.`,
    });
    
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{education ? "Edit Education" : "Add New Education"}</DialogTitle>
          <DialogDescription>
            {education ? "Make changes to your academic history." : "Add a new entry to your education."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., State University" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., M.S. in Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 2011" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 2013" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your studies or any achievements." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Education</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
