import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EDUCATION } from "@/lib/data";
import { GraduationCap } from "lucide-react";

export function EducationSection() {
  return (
    <section id="education" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Education
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My academic background.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
          {EDUCATION.map((edu) => (
            <Card key={edu.institution} className="flex items-start p-6">
              <div className="mr-4">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">{edu.institution}</CardTitle>
                <CardDescription className="mt-1">{edu.degree}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">{edu.duration}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
