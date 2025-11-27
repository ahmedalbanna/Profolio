import { ABOUT_ME } from "@/lib/data";

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            About Me
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            {ABOUT_ME}
          </p>
        </div>
      </div>
    </section>
  );
}
