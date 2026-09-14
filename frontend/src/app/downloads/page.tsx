"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Cpu, Compass, BookOpen, Layers } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  category: "Firmware" | "Manual" | "CAD & Specs" | "Software";
  description: string;
  version: string;
  size: string;
  updated: string;
}

const DOWNLOADS: DownloadItem[] = [
  {
    id: "bathycat-os-v2",
    title: "Bathycat Core Autopilot Firmware (v2.4.1)",
    category: "Firmware",
    description: "Production firmware binary for ESP32-S3 and Pixhawk marine controllers with adaptive heading stabilization.",
    version: "v2.4.1",
    size: "14.2 MB",
    updated: "September 2026"
  },
  {
    id: "user-manual-pro",
    title: "Bathycat USV Operational Field Manual",
    category: "Manual",
    description: "Complete field setup, pre-launch checklist, emergency failsafe protocols, and battery charging guidelines.",
    version: "Rev 4.0",
    size: "8.5 MB",
    updated: "August 2026"
  },
  {
    id: "qgc-mission-profile",
    title: "Mission Planner Hydrographic Survey Grid Template",
    category: "Software",
    description: "Pre-calibrated parameter file and waypoint grid templates for bathymetric lake and coastal transect missions.",
    version: "v1.2",
    size: "1.1 MB",
    updated: "July 2026"
  },
  {
    id: "cad-hull-dimensions",
    title: "Catamaran Hull Dimensions & Sensor Well CAD (STEP / PDF)",
    category: "CAD & Specs",
    description: "3D CAD package for machining custom transducer brackets, side mounts, and deck instrument housings.",
    version: "2026.1",
    size: "24.6 MB",
    updated: "June 2026"
  },
  {
    id: "sensor-payload-guide",
    title: "Hydrographic Sonar Integration & Calibration Guide",
    category: "Manual",
    description: "Step-by-step pinouts, NMEA 0183/2000 wiring diagrams, and time-sync offsets for single-beam and multibeam sonars.",
    version: "Rev 2.1",
    size: "5.8 MB",
    updated: "August 2026"
  },
  {
    id: "telemetry-driver-win",
    title: "Bathycat USB-Serial Telemetry Radio Driver (Windows / Mac)",
    category: "Software",
    description: "USB VCP driver for high-power long-range LoRa 433/868/915 MHz ground station communication modules.",
    version: "v3.8",
    size: "3.4 MB",
    updated: "May 2026"
  }
];

export default function DownloadsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl min-h-[calc(100vh-16rem)]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Download className="h-3.5 w-3.5" />
          Resources & Tools
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Downloads & Documentation</h1>
        <p className="text-muted-foreground text-lg">
          Access firmware updates, operations manuals, CAD dimensions, and calibration profiles for your Bathycat survey vessel.
        </p>
      </div>

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOWNLOADS.map((item) => (
          <Card key={item.id} className="flex flex-col border-border/60 hover:border-primary/50 transition-all shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">
                  {item.category === "Firmware" && <Cpu className="mr-1 h-3 w-3 text-primary" />}
                  {item.category === "Manual" && <FileText className="mr-1 h-3 w-3 text-primary" />}
                  {item.category === "Software" && <Compass className="mr-1 h-3 w-3 text-primary" />}
                  {item.category === "CAD & Specs" && <Layers className="mr-1 h-3 w-3 text-primary" />}
                  {item.category}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">{item.version}</span>
              </div>
              <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
              <CardDescription className="text-sm pt-1">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-xs text-muted-foreground pt-0">
              <div className="flex gap-4 border-t border-border/40 pt-3 mt-1">
                <span>File Size: <strong className="text-foreground">{item.size}</strong></span>
                <span>Last Updated: <strong className="text-foreground">{item.updated}</strong></span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <a 
                href="#download" 
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading ${item.title} (${item.size}) package...`);
                }}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center hover:bg-primary hover:text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" /> Download Package ({item.size})
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Help Banner */}
      <div className="mt-12 p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground">Need Custom Sensor Drivers or ROS / ROS2 Nodes?</h4>
            <p className="text-sm text-muted-foreground">Our marine robotics team provides custom Python and ROS2 driver packages for research universities and hydrographic contractors.</p>
          </div>
        </div>
        <a href="/contact">
          <Button className="shrink-0">Contact Engineering</Button>
        </a>
      </div>
    </div>
  );
}
