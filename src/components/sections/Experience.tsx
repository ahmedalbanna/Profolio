import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EXPERIENCE } from "@/lib/data";
import { Briefcase } from "lucide-react";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Work Experience
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              My professional journey and key accomplishments.
            </p>
          </div>
          <div className="relative space-y-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
            <div className="absolute left-3 sm:left-1/2 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
            {EXPERIENCE.map((item, index) => (
              <div key={index} className="relative flex items-start gap-4 sm:gap-8">
                <div className="absolute left-3 sm:left-1/2 top-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center -translate-x-1/2">
                   <Briefcase className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:pl-8 sm:order-1'}`}>
                  <p className="text-muted-foreground text-sm font-medium">{item.duration}</p>
                </div>
                <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-8' : 'sm:pr-8'}`}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.role}</CardTitle>
                      <CardDescription>{item.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
