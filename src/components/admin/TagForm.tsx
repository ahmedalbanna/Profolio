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
  name: z.string().min(1, "Tag name cannot be empty."),
});

interface TagFormProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: z.infer<typeof formSchema> & { id?: string } | null;
}

export function TagForm({ isOpen, onClose, tag }: TagFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  
  useEffect(() => {
    if (tag) {
      form.reset(tag);
    } else {
      form.reset({
        name: "",
      });
    }
  }, [tag, form, isOpen]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Error", description: "Authentication error." });
        return;
    }

    const tagId = tag?.id || uuidv4();
    const docRef = doc(firestore, `users/${user.uid}/tags/${tagId}`);
    
    const dataToSave = {
        ...values,
        id: tagId,
        userProfileId: user.uid,
    };

    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: tag ? "Tag Updated" : "Tag Added",
        description: `The tag "${values.name}" has been saved.`,
    });
    
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
          <DialogDescription>
            {tag ? "Make changes to your tag." : "Add a new tag to be used in projects."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Tag</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
