
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brush, Code, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// This is the user ID for the default portfolio that will be shown on the homepage.
// You can change this to any user ID from your Firestore `users` collection.
const DEFAULT_PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center animate-in fade-in-0 duration-1000">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                Create a Stunning Portfolio in Minutes
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Showcase your skills, projects, and experience with Profolio. The easiest way to build a personal website that stands out.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href={`/${DEFAULT_PORTFOLIO_USER_ID}`}>
                    View Demo Portfolio
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/admin/register">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Everything You Need to Shine
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Profolio provides all the tools you need to build a professional online presence.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Brush className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Easy Content Management</h3>
                <p className="text-muted-foreground mt-2">
                  Use our intuitive admin dashboard to easily add and update your projects, experience, education, and skills.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Code className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Showcase Your Work</h3>
                <p className="text-muted-foreground mt-2">
                  Add detailed project descriptions, image galleries, and links to your live work and source code.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Blazing Fast & SEO Ready</h3>
                <p className="text-muted-foreground mt-2">
                  Built with Next.js for incredible performance and search engine optimization right out of the box.
                </p>
              </div>
            </div>
          </div>
        </section>
        
         {/* Call to Action Section */}
        <section className="py-20 md:py-32">
            <div className="container px-4 md:px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to Build Your Portfolio?
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Create an account for free and start building your professional brand today. No credit card required.
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg">
                            <Link href="/admin/register">
                                Sign Up Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
