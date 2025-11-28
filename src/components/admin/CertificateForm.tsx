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
  name: z.string().min(2, "Certificate name must be at least 2 characters."),
  issuingOrganization: z.string().min(2, "Organization name must be at least 2 characters."),
  issueDate: z.string().min(4, "Issue date is required."),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

interface CertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
  certificate?: z.infer<typeof formSchema> & { id?: string } | null;
}

export function CertificateForm({ isOpen, onClose, certificate }: CertificateFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      issuingOrganization: "",
      issueDate: "",
      credentialUrl: "",
      imageUrl: "",
    },
  });
  
  useEffect(() => {
    if (certificate) {
      form.reset(certificate);
    } else {
      form.reset({
        name: "",
        issuingOrganization: "",
        issueDate: "",
        credentialUrl: "",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/600/400`,
      });
    }
  }, [certificate, form, isOpen]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Error", description: "Authentication error." });
        return;
    }

    const certificateId = certificate?.id || uuidv4();
    const docRef = doc(firestore, `users/${user.uid}/certificates/${certificateId}`);
    
    const dataToSave = {
        ...values,
        id: certificateId,
        userProfileId: user.uid
    };

    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: certificate ? "Certificate Updated" : "Certificate Added",
        description: `Your certificate "${values.name}" has been saved.`,
    });
    
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{certificate ? "Edit Certificate" : "Add New Certificate"}</DialogTitle>
          <DialogDescription>
            {certificate ? "Make changes to your certificate." : "Add a new certificate to your profile."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Certified Kubernetes Administrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuingOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Linux Foundation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., 2023-10" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
             <FormField
              control={form.control}
              name="credentialUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.credly.com/your-badge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/cert.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Certificate</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    