'use client';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VisitorsChart } from "@/components/admin/charts/VisitorsChart";
import { ProjectViewsChart } from "@/components/admin/charts/ProjectViewsChart";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { SEED_DATA } from "@/lib/seed-data";
import { Tag } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";


export default function AdminDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleSeedData = async () => {
        if (!user || !firestore) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in to seed data." });
            return;
        }

        try {
            const batch = writeBatch(firestore);

            // 1. Seed User Profile
            const userProfileRef = doc(firestore, `users/${user.uid}`);
            batch.set(userProfileRef, { ...SEED_DATA.userProfile, id: user.uid, email: user.email });

            // 2. Seed Tags and get their IDs
            const tagMap = new Map<string, string>();
            SEED_DATA.tags.forEach(tagName => {
                const tagId = uuidv4();
                tagMap.set(tagName, tagId);
                const tagRef = doc(firestore, `tags/${tagId}`);
                batch.set(tagRef, { id: tagId, name: tagName });
            });

            // 3. Seed Projects
            SEED_DATA.projects.forEach(project => {
                const projectId = uuidv4();
                const projectRef = doc(firestore, `users/${user.uid}/projects/${projectId}`);
                const tagIds = project.tags.map(tagName => tagMap.get(tagName)).filter(Boolean) as string[];
                batch.set(projectRef, { ...project, id: projectId, userProfileId: user.uid, tagIds });
            });

            // 4. Seed Experiences
            SEED_DATA.experiences.forEach(exp => {
                const expId = uuidv4();
                const expRef = doc(firestore, `users/${user.uid}/experiences/${expId}`);
                batch.set(expRef, { ...exp, id: expId, userProfileId: user.uid });
            });

            // 5. Seed Education
            SEED_DATA.educations.forEach(edu => {
                const eduId = uuidv4();
                const eduRef = doc(firestore, `users/${user.uid}/educations/${eduId}`);
                batch.set(eduRef, { ...edu, id: eduId, userProfileId: user.uid });
            });
            
            // 6. Seed Skills
             SEED_DATA.skills.forEach(skill => {
                const skillId = uuidv4();
                const skillRef = doc(firestore, `users/${user.uid}/skills/${skillId}`);
                batch.set(skillRef, { ...skill, id: skillId, userProfileId: user.uid });
            });

            await batch.commit();

            toast({
                title: "Data Seeded!",
                description: "Your portfolio has been populated with sample data.",
            });

        } catch (error) {
            console.error("Error seeding data: ", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: "destructive",
                title: "Seeding Failed",
                description: errorMessage,
            });
        }
    };


    return (
        <div className="animate-in fade-in-0 duration-500 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <VisitorsChart />
            <ProjectViewsChart />
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Welcome to your Dashboard</CardTitle>
            <CardDescription>
                This is where you can manage your portfolio content and view analytics.
                The charts above are currently using mock data.
            </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <p>Use the navigation on the left to manage your Experience, Projects, and Education, or to update your personal Settings.</p>
                <div>
                    <Button onClick={handleSeedData}>Seed Data</Button>
                    <p className="text-sm text-muted-foreground mt-2">
                        Click this button to populate your portfolio with initial sample data. This will overwrite existing data for your user.
                    </p>
                </div>
            </CardContent>
        </Card>
        </div>
    );
}
