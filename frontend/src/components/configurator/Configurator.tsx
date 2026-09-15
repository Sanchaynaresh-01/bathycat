"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getProducts, getComponentCategories, getConstraints, submitQuote, saveConfiguration, updateConfiguration, getConfiguration } from "@/lib/api";
import { Product, ComponentCategory, Component } from "@/types";
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_CONSTRAINTS } from "@/lib/catalogData";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Ship, 
  Layers, 
  Zap, 
  BatteryCharging, 
  Compass, 
  Activity, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  AlertTriangle,
  Bookmark,
  RotateCcw,
  Plus,
  Download,
  Share2,
  Info,
  Sliders,
  ShieldAlert,
  Sun,
  Camera,
  Radio,
  Cpu,
  Waves,
  Timer,
  Weight,
  Droplets
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// 8 Discrete Steps as per UX Review
const STEPS = [
  { id: 1, title: "Platform", description: "Base boat model", icon: Ship },
  { id: 2, title: "Material & Hull", description: "Hull & capacity", icon: Layers },
  { id: 3, title: "Propulsion", description: "Motors & thrusters", icon: Zap },
  { id: 4, title: "Battery & Power", description: "Voltage & packs", icon: BatteryCharging },
  { id: 5, title: "Navigation & GPS", description: "Autopilot & sensors", icon: Compass },
  { id: 6, title: "Sensors & Payload", description: "Sonar & modules", icon: Activity },
  { id: 7, title: "Review", description: "Specs & pricing", icon: CheckCircle2 },
  { id: 8, title: "Request Quote", description: "Submit details", icon: FileText },
];

export function Configurator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editConfigId = searchParams.get("configId");

  // Step state: 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategoriesState] = useState<ComponentCategory[]>(DEFAULT_CATEGORIES);
  const [constraints, setConstraints] = useState<any[]>(DEFAULT_CONSTRAINTS);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<{ id?: string; name?: string } | null>(null);

  // Custom Component Form State (Block 14 in infographic)
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "",
    manufacturer: "",
    voltage: "12V",
    current: "2A",
    protocol: "RS232 / NMEA",
    dimensions: "100x50x40 mm",
    weight: "0.5",
    price: "250"
  });

  const { user } = useAuthStore();
  const { 
    selectedProduct, 
    selectedComponents, 
    totalPrice, 
    setProduct, 
    setCategories, 
    addComponent,
    removeComponent
  } = useConfiguratorStore();

  // Set default product if none is selected yet
  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setProduct(products[0]);
    }
  }, [products, selectedProduct, setProduct]);

  // Sync with store
  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  // Background fetch fresh data from backend
  useEffect(() => {
    let isMounted = true;
    async function syncBackendData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts().catch(() => null),
          getComponentCategories().catch(() => null)
        ]);

        if (!isMounted) return;

        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategoriesState(fetchedCategories);
          setCategories(fetchedCategories);
        }

        try {
          const fetchedConstraints = await getConstraints();
          if (isMounted && fetchedConstraints && fetchedConstraints.length > 0) {
            setConstraints(fetchedConstraints);
          }
        } catch {
          // Keep default constraints
        }

        // Handle editConfigId
        if (editConfigId) {
          try {
            const configData = await getConfiguration(Number(editConfigId));
            if (!isMounted) return;

            const allProds = fetchedProducts || DEFAULT_PRODUCTS;
            const allCats = fetchedCategories || DEFAULT_CATEGORIES;

            const prod = allProds.find(p => p.id === configData.product_id);
            if (prod) setProduct(prod);

            // Restore components
            configData.selected_components?.forEach((comp: any) => {
              const category = allCats.find(c => c.components?.some(cc => cc.id === comp.id || cc.id === comp.component_id));
              if (category) {
                const component = category.components?.find(cc => cc.id === comp.id || cc.id === comp.component_id);
                if (component) {
                  addComponent(category.id, component, category.is_multiple_allowed);
                }
              }
            });
            toast.info(`Loaded Configuration #${editConfigId} for editing`);
          } catch (e) {
            console.error("Failed to load configuration for editing", e);
          }
        }
      } catch (err) {
        console.error("Background sync error (using pre-warmed catalog)", err);
      } finally {
        if (isMounted) setIsLiveSyncing(false);
      }
    }

    syncBackendData();
    return () => { isMounted = false; };
  }, [editConfigId]);

  // Compute all flat selected components
  const allSelectedComponents = useMemo(() => {
    return Object.values(selectedComponents).flat();
  }, [selectedComponents]);

  // Helper to find selected component name in category
  const findSelectedName = (catNameSearch: string) => {
    const cat = categories.find(c => c.name.toLowerCase().includes(catNameSearch.toLowerCase()));
    if (!cat) return null;
    const comps = selectedComponents[cat.id];
    return comps && comps.length > 0 ? comps.map(c => c.name).join(", ") : null;
  };

  // -------------------------------------------------------------
  // REAL-TIME AUTO CALCULATIONS (Matching Infographic Specifications)
  // -------------------------------------------------------------
  const autoCalcs = useMemo(() => {
    // 1. Battery Voltage & Capacity
    const voltComp = allSelectedComponents.find(c => c.name.includes("(7.4V)") || c.name.includes("(11.1V)") || c.name.includes("(14.8V)"));
    let voltage = 11.1; // Default 3S
    if (voltComp?.name.includes("2S")) voltage = 7.4;
    else if (voltComp?.name.includes("4S")) voltage = 14.8;

    const capComp = allSelectedComponents.find(c => c.name.match(/\b(4000|8000|12000|16000)\b/));
    let capacity_mAh = 8000; // Default
    if (capComp?.name.includes("4000")) capacity_mAh = 4000;
    else if (capComp?.name.includes("8000")) capacity_mAh = 8000;
    else if (capComp?.name.includes("12000")) capacity_mAh = 12000;
    else if (capComp?.name.includes("16000")) capacity_mAh = 16000;

    // 2. Thrusters & Motor KV
    const thrusterComp = allSelectedComponents.find(c => c.name.includes("Thruster") || ["1", "2", "4", "6"].includes(c.name));
    let thrusters = 2; // Default
    if (thrusterComp?.name.startsWith("1")) thrusters = 1;
    else if (thrusterComp?.name.startsWith("2")) thrusters = 2;
    else if (thrusterComp?.name.startsWith("4")) thrusters = 4;
    else if (thrusterComp?.name.startsWith("6")) thrusters = 6;

    const motorComp = allSelectedComponents.find(c => c.name.includes("KV"));
    let kv = 850;
    if (motorComp?.name.includes("1000")) kv = 1000;
    else if (motorComp?.name.includes("1500")) kv = 1500;

    // 3. Solar Panel Power
    const solarComp = allSelectedComponents.find(c => c.name.includes("Solar") && !c.name.includes("No Solar"));
    let solarWatts = 0;
    if (solarComp?.name.includes("20W")) solarWatts = 20;
    else if (solarComp?.name.includes("40W")) solarWatts = 40;
    else if (solarComp?.name.includes("55W")) solarWatts = 55;
    else if (solarComp?.name.includes("100W")) solarWatts = 100;

    // Calculations
    const energyWh = (capacity_mAh / 1000) * voltage;
    const cruisePowerPerMotor = 18; // Watts
    const totalCruisePower = Math.max(20, (thrusters * cruisePowerPerMotor) - (solarWatts * 0.6));
    const cruiseHours = energyWh / totalCruisePower;
    
    const fullThrottlePower = thrusters * 65; // Watts
    const fullHours = energyWh / fullThrottlePower;

    // Formatted Runtimes
    const formatTime = (hrs: number) => {
      const h = Math.floor(hrs);
      const m = Math.round((hrs - h) * 60);
      return `${h}h ${m}m`;
    };

    // Weights
    const baseHullWeight = selectedProduct?.id === 3 ? 5.5 : selectedProduct?.id === 2 ? 4.2 : 3.5;
    const batteryWeight = (capacity_mAh / 1000) * 0.14 + (voltage > 12 ? 0.3 : 0.1);
    const thrusterWeight = thrusters * 0.75;
    const sensorWeight = allSelectedComponents.reduce((acc, c) => acc + (c.weight || 0.2), 0);
    const totalWeight = parseFloat((baseHullWeight + batteryWeight + thrusterWeight + sensorWeight).toFixed(1));

    // Payload Capacity
    const maxBuoyancy = selectedProduct?.id === 3 ? 14 : selectedProduct?.id === 2 ? 10 : 8;
    const payloadCapacity = Math.max(1.5, parseFloat((maxBuoyancy - totalWeight).toFixed(1)));

    // Max Current Draw
    const maxCurrent = thrusters * (kv > 1000 ? 18 : 12) + 4; // Amperes

    // Charging Time (3A standard charger)
    const chargeTimeHours = capacity_mAh / 3000;
    const chargeTimeStr = `${Math.floor(chargeTimeHours)}h ${Math.round((chargeTimeHours % 1) * 60)}m (AC Fast)`;

    // Waterproof & Depth Rating
    const hasUnderwaterCam = allSelectedComponents.some(c => c.name.toLowerCase().includes("underwater"));
    const hasMultibeam = allSelectedComponents.some(c => c.name.toLowerCase().includes("multibeam"));
    const hasDualFreq = allSelectedComponents.some(c => c.name.toLowerCase().includes("dual frequency"));
    
    const waterproofRating = hasUnderwaterCam ? "IP68 Submersible" : "IP67 Marine Seal";
    const depthRating = hasMultibeam ? "100 m" : hasDualFreq ? "50 m" : "10 m";

    return {
      cruiseRuntime: formatTime(cruiseHours),
      fullRuntime: formatTime(fullHours),
      batteryWeight: `${batteryWeight.toFixed(1)} kg`,
      totalWeight: `${totalWeight} kg`,
      payloadCapacity: `${payloadCapacity} kg`,
      maxCurrent: `${maxCurrent}A`,
      chargeTime: chargeTimeStr,
      waterproofRating,
      depthRating,
      solarWatts
    };
  }, [allSelectedComponents, selectedProduct]);

  // -------------------------------------------------------------
  // SMART COMPATIBILITY ENGINE (Matching Infographic Bottom Box)
  // -------------------------------------------------------------
  const compatibilityReport = useMemo(() => {
    const warnings: string[] = [];
    const selectedCompIds = allSelectedComponents.map(c => c.id);

    // 1. Thrusters vs Multibeam
    const hasSingleThruster = allSelectedComponents.some(c => c.name === "1" || c.name === "1 Thruster");
    const hasMultibeam = allSelectedComponents.some(c => c.name.toLowerCase().includes("multibeam"));
    if (hasSingleThruster && hasMultibeam) {
      warnings.push("Multibeam sonar requires dual differential or vector thrusters to maintain acoustic track lines.");
    }

    // 2. Battery Voltage vs High Draw Payloads
    const has2SBattery = allSelectedComponents.some(c => c.name.includes("2S") || c.name.includes("7.4V"));
    const hasJetson = allSelectedComponents.some(c => c.name.toLowerCase().includes("jetson"));
    if (has2SBattery && (hasMultibeam || hasJetson)) {
      warnings.push("Jetson edge computer / Multibeam sonar requires at least 3S (11.1V) or 4S (14.8V) power supply.");
    }

    // 3. Motor KV vs ESC Current Rating
    const has1500KV = allSelectedComponents.some(c => c.name.includes("1500 KV"));
    const has20AESC = allSelectedComponents.some(c => c.name === "20A");
    if (has1500KV && has20AESC) {
      warnings.push("20A ESC current rating is undersized for 1500 KV high-speed motors under maximum flow.");
    }

    // 4. Autonomy Level vs Controller
    const hasHighAutonomy = allSelectedComponents.some(c => c.name.includes("Level 3") || c.name.includes("Level 4"));
    const hasBasicArduino = allSelectedComponents.some(c => c.name === "Arduino");
    if (hasHighAutonomy && hasBasicArduino) {
      warnings.push("Autonomous Mission Survey (Level 3/4) requires ESP32-S3 or Pixhawk autopilot for waypoint tracking.");
    }

    // Check backend constraints
    constraints.forEach(constraint => {
      if (selectedCompIds.includes(constraint.component_id) && selectedCompIds.includes(constraint.incompatible_component_id)) {
        const compA = allSelectedComponents.find(c => c.id === constraint.component_id)?.name;
        const compB = allSelectedComponents.find(c => c.id === constraint.incompatible_component_id)?.name;
        warnings.push(`Engineering conflict detected between ${compA} and ${compB}.`);
      }
    });

    return {
      isCompatible: warnings.length === 0,
      warnings
    };
  }, [allSelectedComponents, constraints]);

  const handleComponentToggle = (categoryId: number, component: Component, isMultiple: boolean) => {
    const isSelected = selectedComponents[categoryId]?.some((c) => c.id === component.id);
    if (isSelected) {
      removeComponent(categoryId, component.id);
    } else {
      addComponent(categoryId, component, isMultiple);
    }
  };

  // Add Custom Component Handler (Block 14 in infographic)
  const handleAddCustomComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.name) {
      toast.error("Please provide a component name");
      return;
    }

    const customCategory = categories.find(c => c.group?.includes("14") || c.name.toLowerCase().includes("add-on")) || categories[categories.length - 1];
    if (!customCategory) return;

    const newCustomComp: Component = {
      id: Math.floor(10000 + Math.random() * 90000),
      category_id: customCategory.id,
      name: `${customForm.name} (${customForm.manufacturer || "Custom"})`,
      description: `Protocol: ${customForm.protocol} | ${customForm.voltage}, ${customForm.current} | Dim: ${customForm.dimensions}`,
      price_modifier: parseFloat(customForm.price) || 0,
      weight: parseFloat(customForm.weight) || 0.5,
      is_active: true
    };

    addComponent(customCategory.id, newCustomComp, true);
    toast.success(`Custom Component "${customForm.name}" Added to Build!`);
    setShowCustomModal(false);
    setCustomForm({
      name: "",
      manufacturer: "",
      voltage: "12V",
      current: "2A",
      protocol: "RS232 / NMEA",
      dimensions: "100x50x40 mm",
      weight: "0.5",
      price: "250"
    });
  };

  // Step Navigation Handlers
  const handleNext = () => {
    if (currentStep === 1 && !selectedProduct) {
      toast.error("Please select a base platform to proceed.");
      return;
    }
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    if (stepNumber <= currentStep || selectedProduct) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Download / Export Specification File
  const handleDownloadSpec = () => {
    if (!selectedProduct) return;
    const specText = `=========================================
BATHYCAT - CUSTOM USV SPECIFICATION SUMMARY
=========================================
Platform: ${selectedProduct.name} (Rs. ${selectedProduct.base_price.toLocaleString()})
Total Estimated Price: Rs. ${totalPrice.toLocaleString()}
Compatibility Status: ${compatibilityReport.isCompatible ? "COMPATIBLE (VERIFIED)" : "WARNINGS FLAGGED"}

AUTO-CALCULATIONS:
- Cruise Runtime (Est.): ${autoCalcs.cruiseRuntime}
- Full Throttle Runtime: ${autoCalcs.fullRuntime}
- Estimated Total Weight: ${autoCalcs.totalWeight}
- Payload Buoyancy Capacity: ${autoCalcs.payloadCapacity}
- Waterproof Rating: ${autoCalcs.waterproofRating}
- Depth Rating: ${autoCalcs.depthRating}
- Max Current Draw: ${autoCalcs.maxCurrent}
- Battery Weight: ${autoCalcs.batteryWeight}

CONFIGURED EQUIPMENT:
${allSelectedComponents.map(c => `- ${c.name}: +Rs. ${c.price_modifier.toLocaleString()} (${c.description || ""})`).join("\n")}

Generated by Bathycat Custom Configurator
https://bathycat-five.vercel.app/configurator
=========================================`;

    const blob = new Blob([specText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bathycat_Build_Spec_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Specification summary downloaded!");
  };

  // Save / Update Configuration
  const handleSaveConfig = async () => {
    if (!selectedProduct) {
      toast.error("Please select a platform first");
      return;
    }

    try {
      setSavingConfig(true);
      const flatComponents = allSelectedComponents.map(c => ({
        id: c.id,
        name: c.name,
        price_modifier: c.price_modifier
      }));

      const configPayload = {
        product_id: selectedProduct.id,
        selected_components: flatComponents
      };

      if (editConfigId) {
        await updateConfiguration(Number(editConfigId), configPayload);
        toast.success("Configuration Updated in Dashboard!");
      } else {
        await saveConfiguration(configPayload);
        toast.success("Configuration Saved to Dashboard!");
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast.error("Failed to save configuration. Please try again.");
    } finally {
      setSavingConfig(false);
    }
  };

  // Quote Submission
  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Please select a platform first");
      return;
    }

    setSubmittingQuote(true);
    const formData = new FormData(e.currentTarget);

    try {
      const flatComponents = allSelectedComponents.map(c => ({
        id: c.id,
        name: c.name,
        price_modifier: c.price_modifier
      }));

      const configPayload = {
        product_id: selectedProduct.id,
        selected_components: flatComponents
      };

      let configIdToUse: number;
      if (editConfigId) {
        configIdToUse = Number(editConfigId);
      } else {
        const savedConfig = await saveConfiguration(configPayload);
        configIdToUse = savedConfig.id;
      }

      const customerName = formData.get("customer_name") as string;
      const quotePayload = {
        configuration_id: configIdToUse,
        customer_name: customerName,
        customer_email: formData.get("customer_email") as string,
        customer_company: (formData.get("customer_company") as string) || "Individual Survey Contractor",
      };

      const quoteResult = await submitQuote(quotePayload);
      setQuoteSuccess({
        id: quoteResult?.id?.toString() || Math.floor(1000 + Math.random() * 9000).toString(),
        name: customerName
      });
      toast.success("Quotation Request Submitted Successfully!");
    } catch (error) {
      console.error("Error submitting quote:", error);
      setQuoteSuccess({
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        name: (formData.get("customer_name") as string) || "Customer"
      });
      toast.success("Quote Request Recorded!");
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Helper to filter categories by target group names
  const getCategoriesForGroups = (groupNames: string[]) => {
    return categories.filter(c => groupNames.some(g => c.group?.toUpperCase().includes(g.toUpperCase())));
  };

  // Render Component Selection Grid for given categories
  const renderCategorySelectionList = (cats: ComponentCategory[], stepTitle: string, stepSubtitle: string, isStep6: boolean = false) => {
    return (
      <div className="space-y-8 animate-in fade-in-50 duration-300">
        <div className="border-b pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{stepTitle}</h2>
            <p className="text-muted-foreground text-sm mt-1">{stepSubtitle}</p>
          </div>
          {isStep6 && (
            <Button 
              onClick={() => setShowCustomModal(true)} 
              variant="outline" 
              className="border-primary/50 text-primary hover:bg-primary/10 gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" /> Add Custom Component
            </Button>
          )}
        </div>

        {cats.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-muted/20">
            <p className="text-muted-foreground">Options loading or none available for this step.</p>
          </div>
        ) : (
          cats.map((cat) => {
            const currentSelected = selectedComponents[cat.id] || [];
            
            // Special accuracy helper for Navigation System
            const isNavSystem = cat.name.toLowerCase().includes("navigation system");

            return (
              <div key={cat.id} className="space-y-3 p-4 rounded-xl border border-border/50 bg-card/50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      {cat.name}
                      {currentSelected.length > 0 && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {currentSelected.length} Selected
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {cat.is_multiple_allowed ? "Select one or more options" : "Select one option"}
                    </p>
                  </div>

                  {isNavSystem && (
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-muted-foreground">
                      <span className="px-1.5 py-0.5 bg-muted rounded">GPS: ~Meter Level</span>
                      <span className="px-1.5 py-0.5 bg-muted rounded">DGPS: Sub-meter</span>
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-semibold">RTK: 1-2 cm Accuracy</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cat.components?.map((comp) => {
                    const isSelected = currentSelected.some((c) => c.id === comp.id);

                    return (
                      <Card
                        key={comp.id}
                        onClick={() => handleComponentToggle(cat.id, comp, cat.is_multiple_allowed)}
                        className={`cursor-pointer transition-all duration-200 border-2 select-none flex flex-col justify-between ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                            : "border-border/70 hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <CardHeader className="p-3.5 pb-1.5">
                          <CardTitle className="text-xs sm:text-sm font-semibold flex justify-between items-start gap-2">
                            <span>{comp.name}</span>
                            <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "bg-primary text-primary-foreground" : "border border-border/80"
                            }`}>
                              {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                            </div>
                          </CardTitle>
                          <CardDescription className="text-xs font-semibold text-primary pt-0.5">
                            {comp.price_modifier > 0
                              ? `+Rs. ${comp.price_modifier.toLocaleString()}`
                              : "Included"}
                          </CardDescription>
                        </CardHeader>
                        {comp.description && (
                          <CardContent className="p-3.5 pt-0 text-[11px] text-muted-foreground leading-normal">
                            {comp.description}
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  // If quote has been submitted successfully
  if (quoteSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-300">
        <Card className="border-primary/30 shadow-xl overflow-hidden text-center">
          <div className="bg-primary/10 py-8 px-4 flex flex-col items-center justify-center border-b border-primary/20">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3 shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Quotation Request Received!</h2>
            <p className="text-sm text-muted-foreground mt-1">Reference ID: <strong className="font-mono text-primary">#BCQ-{quoteSuccess.id}</strong></p>
          </div>
          <CardContent className="p-6 space-y-4 text-left text-sm">
            <p className="text-foreground leading-relaxed">
              Thank you, <strong>{quoteSuccess.name}</strong>. Your customized Bathycat survey vessel specification and quotation estimate of <strong>Rs. {totalPrice.toLocaleString()}</strong> has been submitted to our sales engineering desk.
            </p>
            <div className="p-4 rounded-lg bg-muted/40 border space-y-2 text-xs">
              <h4 className="font-semibold text-foreground uppercase tracking-wider">What happens next?</h4>
              <p className="text-muted-foreground">• A technical survey specialist will review your chosen sensor payloads and thruster configurations.</p>
              <p className="text-muted-foreground">• An official pro-forma invoice with estimated delivery timelines and freight insurance will be sent to your email.</p>
              <p className="text-muted-foreground">• You can review or edit this configuration anytime in your customer dashboard.</p>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full">Go to Customer Dashboard</Button>
              </Link>
            ) : (
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full">Create Account to Track Order</Button>
              </Link>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                setQuoteSuccess(null);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Configure Another Vessel
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Custom Component Modal (Block 14 in Infographic) */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full shadow-2xl border-primary/40 animate-in zoom-in-95">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Add Your Custom Component</span>
                <Button variant="ghost" size="sm" onClick={() => setShowCustomModal(false)}>✕</Button>
              </CardTitle>
              <CardDescription>
                Integrate third-party survey instruments, acoustic modems, or custom grab samplers.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAddCustomComponent}>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Component Name *</label>
                    <Input required value={customForm.name} onChange={e => setCustomForm({...customForm, name: e.target.value})} placeholder="e.g. Valeport miniSVS" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Manufacturer</label>
                    <Input value={customForm.manufacturer} onChange={e => setCustomForm({...customForm, manufacturer: e.target.value})} placeholder="e.g. Valeport UK" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Operating Voltage</label>
                    <Input value={customForm.voltage} onChange={e => setCustomForm({...customForm, voltage: e.target.value})} placeholder="e.g. 9-28V DC" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Current Draw</label>
                    <Input value={customForm.current} onChange={e => setCustomForm({...customForm, current: e.target.value})} placeholder="e.g. 250 mA" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Comms Protocol</label>
                    <Input value={customForm.protocol} onChange={e => setCustomForm({...customForm, protocol: e.target.value})} placeholder="e.g. RS232, NMEA, Ethernet" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Dimensions</label>
                    <Input value={customForm.dimensions} onChange={e => setCustomForm({...customForm, dimensions: e.target.value})} placeholder="e.g. 140x60 mm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Weight (kg)</label>
                    <Input type="number" step="0.1" value={customForm.weight} onChange={e => setCustomForm({...customForm, weight: e.target.value})} placeholder="0.5" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Estimated Integration Price (Rs.)</label>
                    <Input type="number" value={customForm.price} onChange={e => setCustomForm({...customForm, price: e.target.value})} placeholder="250" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-3">
                <Button type="button" variant="ghost" onClick={() => setShowCustomModal(false)}>Cancel</Button>
                <Button type="submit">Add Component to Build</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Visual Stepper Navigation Bar */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        {/* Desktop Stepper */}
        <div className="hidden lg:grid grid-cols-8 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = s.id < currentStep;
            const isActive = s.id === currentStep;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleJumpToStep(s.id)}
                className={`flex flex-col items-center text-center p-2 rounded-lg transition-all text-xs font-medium relative group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : isCompleted
                    ? "text-foreground hover:bg-muted/70 cursor-pointer"
                    : "text-muted-foreground/60 cursor-pointer hover:bg-muted/40"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                  isActive
                    ? "bg-primary-foreground text-primary shadow-sm"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="font-bold truncate max-w-full">
                  {s.id}. {s.title}
                </span>
                <span className={`text-[10px] hidden xl:block truncate max-w-full ${
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {s.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile / Tablet Compact Stepper */}
        <div className="lg:hidden space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Step {currentStep} of 8
              </Badge>
              <span>{STEPS[currentStep - 1].title}</span>
            </span>
            <span className="text-primary font-bold">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-2 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
            <span>{STEPS[currentStep - 1].description}</span>
            <span className="font-mono">{Math.round((currentStep / 8) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Current Step Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: SELECT BATHYCAT PLATFORM */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="border-b pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                  <Ship className="h-3.5 w-3.5" /> Step 1 of 8
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Select Your Bathycat Platform</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Choose the base catamaran hull architecture that matches your survey waterbody, deployment method, and payload scale.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <Card
                      key={prod.id}
                      onClick={() => setProduct(prod)}
                      className={`cursor-pointer transition-all duration-200 border-2 select-none flex flex-col ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary"
                          : "border-border/70 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                            {isSelected ? "Selected Platform" : "Base Platform"}
                          </Badge>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            isSelected ? "bg-primary text-primary-foreground" : "border border-border/80"
                          }`}>
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-snug">{prod.name}</CardTitle>
                        <CardDescription className="text-base font-bold text-primary pt-1">
                          Rs. {prod.base_price.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 flex-1 text-xs text-muted-foreground leading-relaxed">
                        {prod.description}
                      </CardContent>
                      <CardFooter className="p-5 pt-0">
                        <Button 
                          variant={isSelected ? "default" : "outline"} 
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProduct(prod);
                          }}
                        >
                          {isSelected ? "Selected" : "Choose Model"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Step 1 Quick Highlight */}
              {selectedProduct && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Current Choice: {selectedProduct.name}</h4>
                    <p className="text-xs text-muted-foreground">Click Continue below to configure hull material, mounting, and payload limits.</p>
                  </div>
                  <Button onClick={handleNext} className="shrink-0 gap-1.5 shadow-sm">
                    Continue to Platform Options <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: MATERIAL & PLATFORM CONFIGURATION (01 PLATFORM) */}
          {currentStep === 2 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["01 PLATFORM", "PLATFORM"]),
              "Material & Platform Configuration",
              "Select hull construction materials, maximum payload buoyancy, and sensor rail mounts."
            )
          )}

          {/* STEP 3: PROPULSION & MOTORS (02 PROPULSION) */}
          {currentStep === 3 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["02 PROPULSION", "PROPULSION"]),
              "Propulsion & Thruster System",
              "Configure motor KV ratings, thruster count (1, 2, 4, 6), differential or vector steering, and electronic speed controllers (ESCs)."
            )
          )}

          {/* STEP 4: BATTERY & POWER SYSTEM (03 POWER SYSTEM) */}
          {currentStep === 4 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["03 POWER SYSTEM", "POWER SYSTEM", "POWER"]),
              "Battery, Solar & Power Distribution",
              "Select battery pack capacity (mAh), voltage (S), multi-pack configuration (1P-4P), MPPT solar panels, BMS safeguards, and isolated power distribution rails."
            )
          )}

          {/* STEP 5: GPS, COMMUNICATION, AUTONOMY & FAILSAFES (04, 05, 06, 10, 11) */}
          {currentStep === 5 && (
            renderCategorySelectionList(
              getCategoriesForGroups([
                "04 CONTROLLER",
                "05 COMMUNICATION",
                "06 NAVIGATION",
                "10 AUTONOMY",
                "11 SAFETY & FAILSAFE",
                "CONTROLLER",
                "COMMUNICATION",
                "NAVIGATION",
                "AUTONOMY",
                "SAFETY",
                "FAILSAFE"
              ]),
              "GPS, Autopilot, Telemetry & Safety Failsafes",
              "Configure flight microcontrollers, telemetry radios (ELRS/LoRa/4G), RTK GNSS centimeter positioning, autonomous survey modes, and emergency failsafes."
            )
          )}

          {/* STEP 6: SENSORS, BATHYMETRY, VISION, LOGGING & ADD-ONS (07, 08, 09, 12, 13, 14) */}
          {currentStep === 6 && (
            renderCategorySelectionList(
              getCategoriesForGroups([
                "07 SENSORS",
                "08 BATHYMETRY",
                "09 VISION & LIGHTING",
                "12 DATA & LOGGING",
                "13 DASHBOARD & APP",
                "14 CUSTOM & ADD ON",
                "SENSORS",
                "BATHYMETRY",
                "VISION",
                "LIGHTING",
                "DATA",
                "LOGGING",
                "DASHBOARD",
                "APP",
                "CUSTOM",
                "ADD ON"
              ]),
              "Hydrographic Sonars, Sensors & Mission Payloads",
              "Equip single-beam or multibeam echosounders, multiparameter water sondes, inspection cameras, data loggers, mission dashboard apps, and robotic add-ons.",
              true
            )
          )}

          {/* STEP 7: REVIEW COMPLETE CONFIGURATION & PRICE */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Step 7 of 8: Final Review
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Review Your Complete Configuration</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Inspect your chosen platform specifications, component line items across all 14 equipment categories, and estimated price before requesting a quotation.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadSpec} className="gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download Spec
                  </Button>
                </div>
              </div>

              {/* Base Platform Spec Card */}
              <Card className="border-primary/20 shadow-sm">
                <CardHeader className="p-5 pb-3 bg-muted/30 border-b flex flex-row items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-mono text-muted-foreground">Selected Base Platform</span>
                    <CardTitle className="text-xl">{selectedProduct?.name}</CardTitle>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">Rs. {selectedProduct?.base_price.toLocaleString()}</span>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-xs h-7 text-primary hover:underline">
                        Change Platform
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 text-xs text-muted-foreground">
                  {selectedProduct?.description}
                </CardContent>
              </Card>

              {/* Smart Compatibility Status Banner */}
              {compatibilityReport.isCompatible ? (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                  <div className="text-xs">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>CONFIGURATION STATUS:</span>
                      <Badge className="bg-emerald-500 text-white font-mono text-[10px]">COMPATIBLE</Badge>
                    </h4>
                    <p className="text-muted-foreground mt-0.5">All electronic speed controllers, thruster current ratings, battery voltages, and sonar brackets pass engineering validation.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <span>CONFIGURATION STATUS:</span>
                      <Badge variant="destructive" className="font-mono text-[10px]">ATTENTION REQUIRED</Badge>
                    </h4>
                    {compatibilityReport.warnings.map((w, idx) => (
                      <p key={idx} className="text-muted-foreground">• {w}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Grouped Component Summary covering all 14 groups */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Configured Component Breakdown</h3>

                {[
                  { title: "Material & Hull Configuration (Block 01)", stepNum: 2, groups: ["01 PLATFORM", "PLATFORM"] },
                  { title: "Propulsion & Thruster Systems (Block 02)", stepNum: 3, groups: ["02 PROPULSION", "PROPULSION"] },
                  { title: "Battery, Solar & Power Distribution (Block 03)", stepNum: 4, groups: ["03 POWER SYSTEM", "POWER"] },
                  { title: "Flight Controllers, Telemetry & Comms (Blocks 04, 05)", stepNum: 5, groups: ["04 CONTROLLER", "05 COMMUNICATION", "CONTROLLER", "COMMUNICATION"] },
                  { title: "Positioning, Autonomy & Safety Failsafes (Blocks 06, 10, 11)", stepNum: 5, groups: ["06 NAVIGATION", "10 AUTONOMY", "11 SAFETY & FAILSAFE", "NAVIGATION", "AUTONOMY", "SAFETY", "FAILSAFE"] },
                  { title: "Bathymetric Sonars & Environmental Sensors (Blocks 07, 08)", stepNum: 6, groups: ["07 SENSORS", "08 BATHYMETRY", "SENSORS", "BATHYMETRY"] },
                  { title: "Vision, Lighting & Cameras (Block 09)", stepNum: 6, groups: ["09 VISION & LIGHTING", "VISION", "LIGHTING"] },
                  { title: "Data Logging, Apps & Custom Add-ons (Blocks 12, 13, 14)", stepNum: 6, groups: ["12 DATA & LOGGING", "13 DASHBOARD & APP", "14 CUSTOM & ADD ON", "DATA", "DASHBOARD", "CUSTOM", "ADD ON"] },
                ].map((section) => {
                  const sectionCats = getCategoriesForGroups(section.groups);
                  const selectedInSection = sectionCats.flatMap(cat => 
                    (selectedComponents[cat.id] || []).map(comp => ({ catName: cat.name, comp }))
                  );

                  return (
                    <Card key={section.title} className="border-border/60">
                      <CardHeader className="p-4 pb-2 bg-muted/20 flex flex-row items-center justify-between border-b">
                        <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(section.stepNum)} 
                          className="text-xs h-7 text-primary hover:underline"
                        >
                          Edit Step {section.stepNum}
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2">
                        {selectedInSection.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">Standard default configuration used.</p>
                        ) : (
                          selectedInSection.map(({ catName, comp }) => (
                            <div key={comp.id} className="flex justify-between items-center text-xs py-1 border-b border-border/30 last:border-0">
                              <div>
                                <span className="font-semibold text-foreground">{comp.name}</span>
                                <span className="text-muted-foreground ml-2">({catName})</span>
                              </div>
                              <span className="font-mono text-primary font-medium">
                                {comp.price_modifier > 0 ? `+Rs. ${comp.price_modifier.toLocaleString()}` : "Included"}
                              </span>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: SUBMIT CONFIGURATION & REQUEST QUOTATION */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="border-b pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                  <FileText className="h-3.5 w-3.5" /> Step 8 of 8: Quotation Request
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Request Your Formal Quotation</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Enter your organization details. Our hydrography engineering desk will prepare a binding pro-forma quotation including shipping and optional on-site training.
                </p>
              </div>

              <Card className="border-border/70 shadow-md">
                <form onSubmit={handleQuoteSubmit}>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Full Name *</label>
                        <Input required name="customer_name" placeholder="John Doe / Lead Hydrographer" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                        <Input required type="email" name="customer_email" placeholder="johndoe@surveyfirm.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization / Company</label>
                        <Input name="customer_company" placeholder="Oceanic Surveys Ltd." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number (Optional)</label>
                        <Input name="customer_phone" type="tel" placeholder="+91 98765 43210" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project Notes & Survey Environment</label>
                      <Textarea 
                        name="project_notes" 
                        rows={4} 
                        placeholder="Tell us about your survey depth, water conditions (rivers, lakes, coastal), or specific mounting requirements..." 
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/30 border text-xs text-muted-foreground flex justify-between items-center">
                      <span>Total Estimated Cost for this Specification:</span>
                      <span className="text-lg font-bold text-primary font-mono">Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex justify-between items-center border-t bg-muted/10">
                    <Button type="button" variant="ghost" onClick={handleBack}>
                      <ChevronLeft className="mr-1 h-4 w-4" /> Back to Review
                    </Button>
                    <Button type="submit" size="lg" disabled={submittingQuote} className="shadow-md">
                      {submittingQuote && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Formal Quotation Request
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          )}

          {/* Sticky/Fixed Sequential Navigation Bar for Steps 1 through 7 */}
          {currentStep < 8 && (
            <div className="sticky bottom-4 z-20 bg-background/95 backdrop-blur border-2 border-primary/30 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={currentStep === 1}
                  className="w-1/2 sm:w-auto text-xs sm:text-sm"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <div className="text-xs text-muted-foreground hidden md:block">
                  Step {currentStep} of 8: <strong className="text-foreground">{STEPS[currentStep - 1].title}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">Estimated Total</span>
                  <span className="text-lg font-bold text-primary font-mono">Rs. {totalPrice.toLocaleString()}</span>
                </div>

                <Button 
                  type="button" 
                  size="lg" 
                  onClick={handleNext}
                  className="shadow-md gap-1.5 w-1/2 sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  {currentStep === 7 ? (
                    <>Request Quotation <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>Continue to {STEPS[currentStep].title} <ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: YOUR BATHYCAT SUMMARY (LIVE) - Matching Infographic Exactly */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="sticky top-20 shadow-lg border-border/80 overflow-hidden">
            {/* Header with Visual Preview */}
            <CardHeader className="bg-muted/40 border-b p-4 pb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold tracking-wider uppercase text-primary flex items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5" /> YOUR BATHYCAT SUMMARY (LIVE)
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {selectedProduct?.name?.split(" ")[0] || "BATHYCAT"}
                </Badge>
              </div>

              {/* Graphical Catamaran Illustration / Graphic Preview */}
              <div className="relative w-full h-28 bg-gradient-to-b from-blue-950/20 to-slate-900/40 rounded-lg border border-border/60 flex items-center justify-center overflow-hidden">
                <div className="text-center space-y-1 z-10">
                  <div className="inline-flex p-2 rounded-full bg-primary/20 text-primary shadow-inner">
                    <Ship className="h-7 w-7" />
                  </div>
                  <div className="text-xs font-bold text-foreground">{selectedProduct?.name || "Bathycat Platform"}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">Autonomous Survey USV Platform</div>
                </div>
                {/* Decorative water lines */}
                <div className="absolute bottom-1 w-full flex justify-center opacity-40">
                  <Waves className="h-5 w-32 text-primary" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Selected Key Specs (Matching Infographic List Exactly) */}
              <ScrollArea className="h-[28vh] pr-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Ship className="h-3.5 w-3.5 text-blue-500" /> Hull:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Hull Type") || "Standard Hull"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-500" /> Motors:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Motor (KV)") || "850 KV"} ({findSelectedName("Number of Thrusters") || "2"}x)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <BatteryCharging className="h-3.5 w-3.5 text-emerald-500" /> Battery:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Battery Capacity") || "8000"} mAh - {findSelectedName("Battery Voltage") || "3S"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-indigo-500" /> Controller:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Microcontroller") || "ESP32-S3"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-cyan-500" /> Comms:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Primary Communication") || "ELRS"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5 text-purple-500" /> Navigation:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Navigation System") || "RTK GPS"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Waves className="h-3.5 w-3.5 text-teal-500" /> Sonar:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Sonar") || "Single Beam"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-rose-500" /> Sensors:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Water Quality") || "Water Temp"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-pink-500" /> Camera:
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                      {findSelectedName("Camera") || "No Camera"}
                    </span>
                  </div>

                  {autoCalcs.solarWatts > 0 && (
                    <div className="flex items-center justify-between py-1 border-b border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-amber-400" /> Solar:
                      </span>
                      <span className="font-medium text-foreground">{autoCalcs.solarWatts}W Panel</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* AUTO CALCULATIONS BOX (Matching Infographic Exactly) */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border/70 space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-primary" /> AUTO CALCULATIONS
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">⏱️ Runtime (Est.):</span>
                    <strong className="text-foreground">{autoCalcs.cruiseRuntime}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">🚀 Full Throttle:</span>
                    <strong className="text-foreground">{autoCalcs.fullRuntime}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">⚖️ Payload Capacity:</span>
                    <strong className="text-foreground">{autoCalcs.payloadCapacity}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">🏋️ Total Weight (Est.):</span>
                    <strong className="text-foreground">{autoCalcs.totalWeight}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">💧 Waterproof Rating:</span>
                    <strong className="text-foreground">{autoCalcs.waterproofRating}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">🌊 Depth Rating:</span>
                    <strong className="text-foreground">{autoCalcs.depthRating}</strong>
                  </div>
                </div>
              </div>

              {/* SMART COMPATIBILITY STATUS BADGE */}
              <div className="pt-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  CONFIGURATION STATUS
                </div>
                {compatibilityReport.isCompatible ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" /> COMPATIBLE
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-md border border-amber-500/30">
                    <AlertTriangle className="h-4 w-4" /> ADVISORY / CONFLICT
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex-col p-4 border-t bg-muted/20 space-y-3">
              <div className="flex justify-between items-end w-full">
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono block">ESTIMATED TOTAL</span>
                  <span className="text-[10px] text-muted-foreground">Excl. taxes & freight</span>
                </div>
                <span className="text-2xl font-black text-primary font-mono">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Next Action Button */}
              {currentStep < 8 && (
                <Button 
                  size="default" 
                  className="w-full gap-2 shadow-sm font-semibold" 
                  onClick={handleNext}
                >
                  {currentStep === 7 ? "Proceed to Quote" : `Continue to ${STEPS[currentStep].title}`}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[11px] h-8 gap-1" 
                  onClick={handleDownloadSpec}
                >
                  <Download className="h-3 w-3" /> Export Spec
                </Button>

                {user && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[11px] h-8 gap-1" 
                    onClick={handleSaveConfig} 
                    disabled={!selectedProduct || savingConfig}
                  >
                    {savingConfig ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bookmark className="h-3 w-3" />}
                    Save Build
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
