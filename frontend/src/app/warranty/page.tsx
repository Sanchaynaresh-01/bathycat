import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle, AlertTriangle, HelpCircle, Wrench, RefreshCw, FileText } from "lucide-react";
import Link from "next/link";

export default function WarrantyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl min-h-[calc(100vh-16rem)]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          Certified Reliability
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Bathycat Marine Warranty</h1>
        <p className="text-muted-foreground text-lg">
          Every Bathycat vessel is built, pressure-tested, and quality-inspected for extreme aquatic conditions. Read our standard warranty terms and repair procedures below.
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-border/60 shadow-sm bg-card/60">
          <CardHeader className="pb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">2-Year Hull Warranty</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Complete structural coverage on carbon-composite and marine-grade HDPE catamaran hulls against delamination, manufacturing defects, and structural failure.
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card/60">
          <CardHeader className="pb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Wrench className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">1-Year Electronics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Full replacement or repair on factory-installed brushless thrusters, marine ESCs, power distribution boards, and telemetry links.
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card/60">
          <CardHeader className="pb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <RefreshCw className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">Fast-Track RMA</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Priority turn-around for survey contractors. Advance component replacement available to minimize mission downtime in the field.
          </CardContent>
        </Card>
      </div>

      {/* Detailed Terms */}
      <div className="space-y-6 mb-12">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" /> What Is Covered Under Standard Warranty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Structural Hull Integrity:</strong> Any manufacturing defects in catamaran hulls, bulkheads, waterproofing seals, and motor mount brackets.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Propulsion & Electronics:</strong> Internal component defects in speed controllers (ESCs), brushless motors, battery management systems (BMS), and autopilot boards.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Factory Calibration:</strong> Recalibration and diagnostic checks if sensor telemetry deviates beyond certified operational thresholds under normal operation.</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Exclusions & Operating Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Impact & Collision Damage:</strong> Hull punctures, propeller strikes on rocks, or damage caused by grounding at excessive speeds are not covered under manufacturing warranty.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Improper Seal Closing:</strong> Water ingress caused by operating the vessel with unlatched hatch seals, improperly tightened cable glands, or unseated O-rings.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Unauthorized Modifications:</strong> Soldering custom wiring onto the core power distribution board without approval from Bathycat engineering.</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Claim Procedure */}
      <Card className="border-primary/20 bg-muted/20 mb-12">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> How to Initiate a Warranty or Repair Request
          </CardTitle>
          <CardDescription>Follow our simple 3-step RMA (Return Merchandise Authorization) process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background border border-border/60">
              <span className="text-xs font-mono font-bold text-primary">STEP 1</span>
              <h4 className="font-semibold mt-1">Submit Ticket</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Email support@bathycat.com with your Hull Serial Number, description of the fault, and photos/log files.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border/60">
              <span className="text-xs font-mono font-bold text-primary">STEP 2</span>
              <h4 className="font-semibold mt-1">Remote Diagnostics</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Our support engineer analyzes flight logs, telemetry, and issues an RMA Number and prepaid return shipping label.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border/60">
              <span className="text-xs font-mono font-bold text-primary">STEP 3</span>
              <h4 className="font-semibold mt-1">Rapid Repair / Swap</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Components are repaired or replaced, pressure re-tested, and dispatched back to your survey site within 5 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Footer */}
      <div className="text-center p-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <HelpCircle className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-1">Have Questions About Coverage?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          Contact our technical support desk with your vessel serial number or configuration ID for immediate assistance.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/contact">
            <Button>Contact Support Desk</Button>
          </Link>
          <Link href="/configurator">
            <Button variant="outline">Back to Configurator</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
