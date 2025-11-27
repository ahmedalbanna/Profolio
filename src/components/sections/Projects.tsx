import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROJECTS } from "@/lib/data";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A selection of my recent work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
          {PROJECTS.map((project) => (
            <Card key={project.title} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-60 w-full">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={project.imageHint}
                  />
                </div>
                <div className="p-6">
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription className="mb-4">{project.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
