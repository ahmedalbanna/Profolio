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
  title: z.string().min(2, "Title must be at least 2 characters."),
  company: z.string().min(2, "Company must be at least 2 characters."),
  startDate: z.string().min(4, "Start date is required."),
  endDate: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

interface ExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: z.infer<typeof formSchema> & { id?: string } | null;
}

export function ExperienceForm({ isOpen, onClose, experience }: ExperienceFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });
  
  useEffect(() => {
    if (experience) {
      form.reset(experience);
    } else {
      form.reset({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [experience, form, isOpen]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Error", description: "Authentication error." });
        return;
    }

    const experienceId = experience?.id || uuidv4();
    const docRef = doc(firestore, `users/${user.uid}/experiences/${experienceId}`);
    
    const dataToSave = {
        ...values,
        id: experienceId,
        userProfileId: user.uid
    };

    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: experience ? "Experience Updated" : "Experience Added",
        description: `${values.title} has been saved.`,
    });
    
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{experience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
          <DialogDescription>
            {experience ? "Make changes to your work experience." : "Add a new role to your professional history."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech Solutions Inc." {...field} />
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
                        <Input placeholder="e.g., 2018-01" {...field} />
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
                        <Input placeholder="Present" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your role and achievements." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Experience</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
