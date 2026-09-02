import { Suspense } from "react";
import { Configurator } from "@/components/configurator/Configurator";
import { Loader2 } from "lucide-react";

export default function ConfiguratorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Build Your Bathycat</h1>
        <p className="text-muted-foreground">Select your platform and components to customize your survey boat.</p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <Configurator />
      </Suspense>
    </div>
  );
}
