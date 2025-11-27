import { Card, CardContent } from "@/components/ui/card";
import { SKILLS } from "@/lib/data";

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            My Skills
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A snapshot of my technical capabilities.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
          {SKILLS.map((skill) => (
            <Card key={skill.name} className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <skill.icon className="h-12 w-12 text-primary mb-4" />
                <p className="font-semibold">{skill.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
