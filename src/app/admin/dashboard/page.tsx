import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboardPage() {
  return (
    <div className="animate-in fade-in-0 duration-500">
      <Tabs defaultValue="experience">
        <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            <div className="ml-auto">
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
