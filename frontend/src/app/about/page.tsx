import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Redefining Marine Surveys</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          At Bathycat, we believe that marine professionals shouldn't have to settle for one-size-fits-all solutions. Our Unmanned Surface Vehicles are built around your specific mission constraints.
        </p>
      </section>

      {/* Content */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-12 border-t">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Built for Professionals</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our mission is to provide the hydrographic and environmental survey community with modular, reliable, and easily deployable Unmanned Surface Vehicles (USVs).
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Whether you are mapping shallow inland lakes or navigating coastal currents, our custom configurator ensures you only pay for the payload you need.
          </p>
          <ul className="space-y-3 mt-6">
            {['Premium Build Quality', 'Endless Payload Combinations', 'Global Support', 'Open Architecture'].map((item) => (
              <li key={item} className="flex items-center text-muted-foreground">
                <CheckCircle2 className="mr-3 h-5 w-5 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="aspect-square bg-muted/30 rounded-2xl border flex items-center justify-center p-8">
           {/* Placeholder for 3D/Image */}
           <div className="text-center">
             <div className="text-6xl mb-4">🌊</div>
             <p className="font-medium text-muted-foreground">Innovation at Sea</p>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-primary/5 rounded-3xl mt-12 border border-primary/20">
        <h2 className="text-3xl font-bold mb-4">Ready to build your fleet?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start assembling your custom Bathycat USV today. See live pricing and submit your configuration for a formal quote.
        </p>
        <Button size="lg" asChild>
          <Link href="/configurator">Open Configurator</Link>
        </Button>
      </section>
    </div>
  );
}
