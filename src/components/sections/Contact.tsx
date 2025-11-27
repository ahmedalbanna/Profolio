import { ContactForm } from "@/components/forms/ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-left-10 duration-1000">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Have a project in mind, a question, or just want to say hello? 
              I&apos;d love to hear from you.
            </p>
            <p className="text-lg text-muted-foreground">
              Fill out the form, and I&apos;ll get back to you as soon as possible.
            </p>
          </div>
          <div className="animate-in fade-in-0 slide-in-from-right-10 duration-1000">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
