
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { writeBatch, doc, collection } from "firebase/firestore";
import {
  PROFESSIONAL_NAME,
  PROFESSIONAL_TITLE,
  ABOUT_ME,
  EXPERIENCE,
  PROJECTS,
  EDUCATION,
  SKILLS,
} from "@/lib/data";
import { Tag } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();

    const handleSeedData = async () => {
        if (!user || !firestore) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "You must be logged in to seed data.",
            });
            return;
        }

        try {
            const batch = writeBatch(firestore);

            // 1. User Profile
            const userProfileRef = doc(firestore, `users/${user.uid}`);
            batch.set(userProfileRef, {
                id: user.uid,
                fullName: PROFESSIONAL_NAME,
                email: user.email,
                bio: ABOUT_ME,
                linkedinUrl: "#",
                githubUrl: "#",
            });

            // 2. Experience
            EXPERIENCE.forEach((exp) => {
                const experienceId = uuidv4();
                const expRef = doc(firestore, `users/${user.uid}/experiences/${experienceId}`);
                batch.set(expRef, { ...exp, id: experienceId, userProfileId: user.uid });
            });

            // 3. Education
            EDUCATION.forEach((edu) => {
                const educationId = uuidv4();
                const eduRef = doc(firestore, `users/${user.uid}/educations/${educationId}`);
                batch.set(eduRef, { ...edu, id: educationId, userProfileId: user.uid });
            });

            // 4. Skills
            SKILLS.forEach((skill) => {
                const skillId = uuidv4();
                const skillRef = doc(firestore, `users/${user.uid}/skills/${skillId}`);
                batch.set(skillRef, { name: skill.name, id: skillId, userProfileId: user.uid, level: 5 });
            });

            // 5. Tags and Projects
            const allTags: { [key: string]: string } = {};
            const tagsCollectionRef = collection(firestore, "tags");

            // Create or get tag IDs
            for (const project of PROJECTS) {
                for (const tagName of project.tags) {
                    if (!allTags[tagName]) {
                        const tagId = uuidv4();
                        const tagRef = doc(tagsCollectionRef, tagId);
                        batch.set(tagRef, { id: tagId, name: tagName });
                        allTags[tagName] = tagId;
                    }
                }
            }
            
            PROJECTS.forEach((proj) => {
                const projectId = uuidv4();
                const projRef = doc(firestore, `users/${user.uid}/projects/${projectId}`);
                const tagIds = proj.tags.map(tagName => allTags[tagName]);
                batch.set(projRef, {
                     ...proj,
                     id: projectId,
                     userProfileId: user.uid,
                     tagIds: tagIds,
                });
            });


            await batch.commit();

            toast({
                title: "Success!",
                description: "Your portfolio data has been seeded to Firestore.",
            });
        } catch (e: any) {
            console.error(e);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: e.message || "Could not seed data.",
            });
        }
    };


  return (
    <div className="animate-in fade-in-0 duration-500">
      <Tabs defaultValue="experience">
        <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" onClick={handleSeedData}>Seed Data</Button>
                <Button>Add New</Button>
            </div>
        </div>
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Manage Work Experience</CardTitle>
              <CardDescription>
                Add, edit, or remove your work history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Senior Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Tech Solutions Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="2018 - Present" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your responsibilities and achievements." />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
              <CardDescription>
                Showcase your best work by managing your project gallery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input id="project-title" placeholder="QuantumLeap Analytics" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea id="project-description" placeholder="Describe the project." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="project-tags">Tags</Label>
                    <Input id="project-tags" placeholder="React, TypeScript, D3.js" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="picture">Image</Label>
                    <Input id="picture" type="file" />
                  </div>
            </CardContent>
            <CardFooter>
              <Button>Save Project</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
