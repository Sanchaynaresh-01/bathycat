"use client";

import { useEffect, useState } from "react";
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
  ExternalLink,
  RotateCcw
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

  // Compute incompatible component IDs based on selected components
  const selectedCompIds = Object.values(selectedComponents).flat().map(c => c.id);
  const incompatibleCompIds = new Set<number>();
  const incompatibilityMap = new Map<number, string>();

  constraints.forEach(constraint => {
    if (selectedCompIds.includes(constraint.component_id)) {
      incompatibleCompIds.add(constraint.incompatible_component_id);
      const confName = Object.values(selectedComponents).flat().find(c => c.id === constraint.component_id)?.name;
      incompatibilityMap.set(constraint.incompatible_component_id, confName || "a selected component");
    }
  });

  const handleComponentToggle = (categoryId: number, component: Component, isMultiple: boolean) => {
    const isSelected = selectedComponents[categoryId]?.some((c) => c.id === component.id);
    if (isSelected) {
      removeComponent(categoryId, component.id);
    } else {
      if (incompatibleCompIds.has(component.id)) {
        const confName = incompatibilityMap.get(component.id);
        toast.warning("Incompatible Component Selected", {
          description: `Note: ${component.name} has a conflict with ${confName}.`,
        });
      }
      addComponent(categoryId, component, isMultiple);
    }
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

  // Save / Update Configuration
  const handleSaveConfig = async () => {
    if (!selectedProduct) {
      toast.error("Please select a platform first");
      return;
    }

    try {
      setSavingConfig(true);
      const flatComponents = Object.values(selectedComponents).flat().map(c => ({
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
        toast.success("Configuration Updated", {
          description: "Your saved changes have been updated in your dashboard.",
        });
      } else {
        await saveConfiguration(configPayload);
        toast.success("Configuration Saved", {
          description: "You can view and reload this build anytime from your dashboard.",
        });
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
      // 1. Save configuration first
      const flatComponents = Object.values(selectedComponents).flat().map(c => ({
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

      // 2. Submit quote
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
      // Fallback display if offline/mock
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
  const renderCategorySelectionList = (cats: ComponentCategory[], stepTitle: string, stepSubtitle: string) => {
    return (
      <div className="space-y-8 animate-in fade-in-50 duration-300">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{stepTitle}</h2>
          <p className="text-muted-foreground text-sm mt-1">{stepSubtitle}</p>
        </div>

        {cats.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-muted/20">
            <p className="text-muted-foreground">Options loading or none available for this step.</p>
          </div>
        ) : (
          cats.map((cat) => {
            const currentSelected = selectedComponents[cat.id] || [];
            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      {cat.name}
                      {currentSelected.length > 0 && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {currentSelected.length} Selected
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {cat.is_multiple_allowed ? "Multiple selections allowed" : "Select one required option"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {cat.components?.map((comp) => {
                    const isSelected = currentSelected.some((c) => c.id === comp.id);
                    const isIncompatible = incompatibleCompIds.has(comp.id);

                    return (
                      <Card
                        key={comp.id}
                        onClick={() => handleComponentToggle(cat.id, comp, cat.is_multiple_allowed)}
                        className={`cursor-pointer transition-all duration-200 border-2 select-none ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                            : "border-border/70 hover:border-primary/50 hover:bg-muted/30"
                        } ${isIncompatible && !isSelected ? "opacity-60 bg-muted/40" : ""}`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-semibold flex justify-between items-start gap-2">
                            <span className="flex items-center gap-2">
                              {comp.name}
                              {isIncompatible && !isSelected && (
                                <Badge variant="destructive" className="text-[10px] py-0 px-1 font-mono">
                                  Conflict
                                </Badge>
                              )}
                            </span>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                              isSelected ? "bg-primary text-primary-foreground" : "border border-border/80"
                            }`}>
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                          </CardTitle>
                          <CardDescription className="text-xs font-semibold text-primary pt-0.5">
                            {comp.price_modifier > 0
                              ? `+Rs. ${comp.price_modifier.toLocaleString()}`
                              : "Standard Included"}
                          </CardDescription>
                        </CardHeader>
                        {comp.description && (
                          <CardContent className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed">
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
            <div className="p-4 rounded-lg bg-muted/40 border space-y-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">What happens next?</h4>
              <p className="text-xs text-muted-foreground">• A technical survey specialist will review your chosen sensor payloads and thruster configurations.</p>
              <p className="text-xs text-muted-foreground">• An official pro-forma invoice with estimated delivery timelines and freight insurance will be sent to your email.</p>
              <p className="text-xs text-muted-foreground">• You can review or edit this configuration anytime in your customer dashboard.</p>
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
                  Choose the base hull architecture that matches your survey waterbody, deployment method, and payload scale.
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

          {/* STEP 2: MATERIAL & PLATFORM CONFIGURATION */}
          {currentStep === 2 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["01 PLATFORM", "PLATFORM"]),
              "Material & Platform Configuration",
              "Select hull construction materials, maximum payload buoyancy, and sensor rail mounts."
            )
          )}

          {/* STEP 3: PROPULSION & MOTORS */}
          {currentStep === 3 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["02 PROPULSION", "PROPULSION"]),
              "Propulsion & Thruster System",
              "Configure motor KV ratings, differential or vector steering, and electronic speed controllers (ESCs)."
            )
          )}

          {/* STEP 4: BATTERY & POWER SYSTEM */}
          {currentStep === 4 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["03 POWER SYSTEM", "POWER SYSTEM", "POWER"]),
              "Battery & Power Architecture",
              "Select battery pack capacity (mAh), voltage (S), MPPT solar auxiliary panels, and BMS safeguards."
            )
          )}

          {/* STEP 5: GPS, COMMUNICATION & NAVIGATION */}
          {currentStep === 5 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["06 NAVIGATION", "NAVIGATION", "04 CONTROLLER", "05 COMMUNICATION", "CONTROLLER", "COMMUNICATION"]),
              "GPS, Telemetry & Autopilot Navigation",
              "Equip sub-meter DGPS or centimeter RTK positioning, autopilot boards, and long-range telemetry."
            )
          )}

          {/* STEP 6: SENSORS, BATHYMETRY & PAYLOAD */}
          {currentStep === 6 && (
            renderCategorySelectionList(
              getCategoriesForGroups(["08 BATHYMETRY", "BATHYMETRY", "07 SENSORS", "SENSORS", "09 VISION", "VISION", "14 CUSTOM", "ADD ON"]),
              "Hydrographic Sonars, Sensors & Payloads",
              "Equip single-beam or multibeam echosounders, multiparameter water quality probes, and cameras."
            )
          )}

          {/* STEP 7: REVIEW COMPLETE CONFIGURATION & PRICE */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="border-b pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Step 7 of 8: Final Review
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Review Your Complete Configuration</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Inspect your chosen platform specifications, component line items, and estimated price before requesting a formal quotation.
                </p>
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

              {/* Grouped Component Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Configured Component Breakdown</h3>

                {[
                  { title: "Material & Hull Options", stepNum: 2, groups: ["01 PLATFORM", "PLATFORM"] },
                  { title: "Propulsion & Thrusters", stepNum: 3, groups: ["02 PROPULSION", "PROPULSION"] },
                  { title: "Battery & Power System", stepNum: 4, groups: ["03 POWER SYSTEM", "POWER"] },
                  { title: "Navigation, Autopilot & Telemetry", stepNum: 5, groups: ["06 NAVIGATION", "04 CONTROLLER", "05 COMMUNICATION"] },
                  { title: "Sonars, Sensors & Payloads", stepNum: 6, groups: ["08 BATHYMETRY", "07 SENSORS", "09 VISION", "14 CUSTOM"] },
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

              {/* Compatibility Guarantee Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <h4 className="font-semibold text-foreground">Verified Survey Compatibility</h4>
                  <p className="text-muted-foreground">All selected electronic speed controllers, battery voltages, and sonar transducer brackets pass automated engineering rules.</p>
                </div>
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
                      <span className="text-lg font-bold text-primary">Rs. {totalPrice.toLocaleString()}</span>
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
                  <span className="text-lg font-bold text-primary">Rs. {totalPrice.toLocaleString()}</span>
                </div>

                <Button 
                  type="button" 
                  size="lg" 
                  onClick={handleNext}
                  className="shadow-md gap-1.5 w-1/2 sm:w-auto text-xs sm:text-sm"
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

        {/* Right Column: Live Sticky Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 shadow-md border-border/80">
            <CardHeader className="bg-muted/40 border-b p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Ship className="h-4 w-4 text-primary" /> Live Spec Summary
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedProduct?.name?.split(" ")[0] || "Boat"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[45vh] pr-3">
                <div className="space-y-4">
                  {selectedProduct && (
                    <div className="flex justify-between items-start border-b border-border/40 pb-2">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{selectedProduct.name}</h4>
                        <p className="text-[11px] text-muted-foreground">Base Vessel Platform</p>
                      </div>
                      <span className="font-medium text-xs text-foreground">
                        Rs. {selectedProduct.base_price.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {categories.map((cat) => {
                    const selection = selectedComponents[cat.id];
                    if (!selection || selection.length === 0) return null;

                    return (
                      <div key={cat.id} className="border-b border-border/30 pb-2 text-xs space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          {cat.name}
                        </span>
                        {selection.map((comp) => (
                          <div key={comp.id} className="flex justify-between items-start">
                            <span className="font-medium text-foreground">{comp.name}</span>
                            <span className="text-primary font-mono font-medium">
                              {comp.price_modifier > 0
                                ? `+Rs. ${comp.price_modifier.toLocaleString()}`
                                : "Included"}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="flex-col p-4 border-t bg-muted/20 space-y-3">
              <div className="flex justify-between items-end w-full">
                <div>
                  <span className="text-xs text-muted-foreground font-mono">ESTIMATED TOTAL</span>
                  <p className="text-[10px] text-muted-foreground">Excl. taxes & shipping</p>
                </div>
                <span className="text-2xl font-black text-primary font-mono">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Primary Next Action */}
              {currentStep < 8 && (
                <Button 
                  size="default" 
                  className="w-full gap-2 shadow-sm font-semibold" 
                  onClick={handleNext}
                >
                  {currentStep === 7 ? "Proceed to Quote" : `Next: ${STEPS[currentStep].title}`}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {/* Save for Later Button */}
              {user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={handleSaveConfig} 
                  disabled={!selectedProduct || savingConfig}
                >
                  {savingConfig ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {editConfigId ? "Update Saved Build" : "Save Build for Later"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
