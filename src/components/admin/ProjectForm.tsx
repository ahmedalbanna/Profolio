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
import { useUser, useFirestore, useCollection, setDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Please enter a valid URL."),
  projectUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tagIds: z.array(z.string()).optional(),
});

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  project?: z.infer<typeof formSchema> & { id?: string } | null;
}

export function ProjectForm({ isOpen, onClose, project }: ProjectFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [openTagSelector, setOpenTagSelector] = useState(false);

  const tagsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'tags') : null, [firestore]);
  const { data: allTags } = useCollection(tagsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      tagIds: [],
    },
  });
  
  useEffect(() => {
    if (project) {
      form.reset(project);
    } else {
      form.reset({
        title: "",
        description: "",
        imageUrl: "https://picsum.photos/seed/new-project/600/400",
        projectUrl: "",
        tagIds: [],
      });
    }
  }, [project, form, isOpen]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Error", description: "Authentication error." });
        return;
    }

    const projectId = project?.id || uuidv4();
    const docRef = doc(firestore, `users/${user.uid}/projects/${projectId}`);
    
    const dataToSave = {
        ...values,
        id: projectId,
        userProfileId: user.uid,
        // Make sure tags are saved, even if empty
        tagIds: values.tagIds || []
    };

    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: project ? "Project Updated" : "Project Added",
        description: `${values.title} has been saved.`,
    });
    
    onClose();
    form.reset();
  }
  
  const selectedTags = allTags?.filter(tag => form.watch('tagIds')?.includes(tag.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Make changes to your project." : "Showcase a new piece of your work."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., QuantumLeap Analytics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project, its purpose, and the tech used." {...field} />
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="projectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tags</FormLabel>
                  <Popover open={openTagSelector} onOpenChange={setOpenTagSelector}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                           <div className="flex gap-1 flex-wrap">
                            {selectedTags && selectedTags.length > 0 ? (
                                selectedTags.map(tag => <Badge key={tag.id} variant="secondary">{tag.name}</Badge>)
                            ) : (
                                "Select tags"
                            )}
                            </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                            <CommandEmpty>No tags found.</CommandEmpty>
                            <CommandGroup>
                            {allTags?.map((tag) => (
                                <CommandItem
                                value={tag.name}
                                key={tag.id}
                                onSelect={() => {
                                    const currentTagIds = field.value || [];
                                    const newTagIds = currentTagIds.includes(tag.id)
                                    ? currentTagIds.filter((id) => id !== tag.id)
                                    : [...currentTagIds, tag.id];
                                    form.setValue("tagIds", newTagIds);
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(tag.id) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {tag.name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
