import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-950 z-0"></div>
        {/* Dynamic aquatic theme backdrop */}
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/40 via-slate-900 to-slate-950"></div>
        
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white drop-shadow-lg">
                Build Your Ultimate <span className="text-blue-500">Bathycat</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-zinc-300 md:text-xl drop-shadow">
                Fully customizable survey boats designed for professionals. 
                Configure battery, motors, GPS, sensors, and more in real-time.
              </p>
            </div>
            <div className="space-x-4 mt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/configurator">Start Configuring</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800" asChild>
                <Link href="/products">View Models</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg className=" w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-xl font-bold">Dynamic Pricing</h3>
              <p className="text-muted-foreground">Live calculation as you select options, ensuring complete transparency before requesting a quote.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                <svg className=" w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <h3 className="text-xl font-bold">Endless Configurations</h3>
              <p className="text-muted-foreground">From standard RTK GPS to high-end multibeam sonars, tailor the boat exactly to your mission needs.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl border bg-card text-card-foreground shadow sm:col-span-2 lg:col-span-1">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <svg className=" w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold">Professional Grade</h3>
              <p className="text-muted-foreground">Built to withstand harsh environments with premium materials, ensuring reliability when it matters most.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
