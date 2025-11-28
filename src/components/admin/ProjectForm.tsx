'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";

const galleryItemSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
  type: z.enum(["image", "video"]),
});

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Please enter a valid URL for the cover image."),
  projectUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tagIds: z.array(z.string()).optional(),
  gallery: z.array(galleryItemSchema).optional(),
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
      gallery: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gallery",
  });
  
  useEffect(() => {
    if (project) {
      form.reset({
        ...project,
        gallery: project.gallery || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/600/400`,
        projectUrl: "",
        tagIds: [],
        gallery: [],
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
        tagIds: values.tagIds || [],
        gallery: values.gallery || [],
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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Make changes to your project." : "Showcase a new piece of your work."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[70vh] pr-6">
            <div className="space-y-4">
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
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                     <FormDescription>This is the main image shown in the project grid.</FormDescription>
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
                              "w-full justify-between h-auto",
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

              <div className="space-y-4 pt-4">
                <FormLabel>Project Gallery</FormLabel>
                 <FormDescription>Add additional images or videos for the project detail page.</FormDescription>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 p-3 border rounded-md">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <FormField
                        control={form.control}
                        name={`gallery.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="text-xs">Media URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/media.png" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`gallery.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ url: "", type: "image" })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Gallery Item
                </Button>
              </div>

            </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
