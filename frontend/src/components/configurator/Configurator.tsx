"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getProducts, getComponentCategories, submitQuote, saveConfiguration } from "@/lib/api";
import { Product, ComponentCategory, Component } from "@/types";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

// Simple Quote Form directly in here for MVP
function QuoteForm({ onBack }: { onBack: () => void }) {
  const { selectedProduct, selectedComponents, totalPrice } = useConfiguratorStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (!selectedProduct) throw new Error("No product selected");

      // 1. Save the configuration
      const flatComponents = Object.values(selectedComponents).flat().map(c => ({
        id: c.id,
        name: c.name,
        price_modifier: c.price_modifier
      }));

      const configPayload = {
        product_id: selectedProduct.id,
        selected_components: flatComponents
      };
      
      const savedConfig = await saveConfiguration(configPayload);

      // 2. Submit the quote
      const quotePayload = {
        configuration_id: savedConfig.id,
        customer_name: formData.get('customer_name') as string,
        customer_email: formData.get('customer_email') as string,
        customer_company: formData.get('customer_company') as string,
      };

      await submitQuote(quotePayload);

      toast.success("Quote Requested Successfully", {
        description: "Our team will get back to you shortly.",
      });
    } catch (error) {
      toast.error("Error submitting quote", {
        description: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Request a Quote</CardTitle>
        <CardDescription>Enter your details to get a formal quote for your configuration.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input required name="customer_name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input required type="email" name="customer_email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <input name="customer_company" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Oceanic Surveys Ltd." />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function Configurator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("base");
  const [step, setStep] = useState<"configure" | "quote">("configure");
  const { user } = useAuthStore();
  const [savingConfig, setSavingConfig] = useState(false);
  const [constraints, setConstraints] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const editConfigId = searchParams.get('configId');

  const { 
    selectedProduct, 
    categories, 
    selectedComponents, 
    totalPrice, 
    setProduct, 
    setCategories, 
    addComponent,
    removeComponent
  } = useConfiguratorStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedProducts = await getProducts();
        const fetchedCategories = await getComponentCategories();
        
        let fetchedConstraints: any[] = [];
        try {
          fetchedConstraints = await import("@/lib/api").then(m => m.getConstraints());
        } catch (constraintErr) {
          console.error("Failed to load constraints:", constraintErr);
          // Don't crash the whole page if constraints fail to load
        }
        
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setConstraints(fetchedConstraints);
        
        if (editConfigId) {
          try {
            const configData = await import("@/lib/api").then(m => m.getConfiguration(Number(editConfigId)));
            const prod = fetchedProducts.find(p => p.id === configData.product_id);
            if (prod) setProduct(prod);
            
            // Clear existing and add selected components
            configData.selected_components.forEach((comp: any) => {
              const category = fetchedCategories.find(c => c.components.some(cc => cc.id === comp.id || cc.id === comp.component_id));
              if (category) {
                const component = category.components.find(cc => cc.id === comp.id || cc.id === comp.component_id);
                if (component) {
                  addComponent(category.id, component, category.is_multiple_allowed);
                }
              }
            });
          } catch (e) {
            console.error("Failed to load configuration for editing", e);
            toast.error("Failed to load configuration");
          }
        } else if (fetchedProducts.length > 0 && !selectedProduct) {
          // Auto select first product if none selected
          setProduct(fetchedProducts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch configurator data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [editConfigId]); // Note: In a real app we might want to clear Zustand state on unmount or on hard navigation

  // Compute currently incompatible component IDs based on selected components
  const selectedCompIds = Object.values(selectedComponents).flat().map(c => c.id);
  const incompatibleCompIds = new Set<number>();
  const incompatibilityMap = new Map<number, string>(); // Maps an incompatible ID to the name of the component it conflicts with

  constraints.forEach(constraint => {
    if (selectedCompIds.includes(constraint.component_id)) {
      incompatibleCompIds.add(constraint.incompatible_component_id);
      
      // Find name of the conflicting component
      const confName = Object.values(selectedComponents).flat().find(c => c.id === constraint.component_id)?.name;
      incompatibilityMap.set(constraint.incompatible_component_id, confName || "a selected component");
    }
  });

  const handleSaveConfig = async () => {
    try {
      setSavingConfig(true);
      if (!selectedProduct) {
        throw new Error("No product selected");
      }
      
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
        const { updateConfiguration } = await import("@/lib/api");
        await updateConfiguration(Number(editConfigId), configPayload);
        toast.success("Configuration Updated", {
          description: "Changes have been saved to your dashboard.",
        });
      } else {
        await saveConfiguration(configPayload);
        toast.success("Configuration Saved", {
          description: "You can view it in your dashboard.",
        });
      }
    } catch (error) {
      console.error("Failed to save configuration error:", error);
      toast.error("Failed to save configuration", {
        description: "Please try again.",
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleComponentToggle = (categoryId: number, component: Component, isMultiple: boolean) => {
    const isSelected = selectedComponents[categoryId]?.some((c) => c.id === component.id);
    if (isSelected) {
      removeComponent(categoryId, component.id);
    } else {
      if (incompatibleCompIds.has(component.id)) {
        const confName = incompatibilityMap.get(component.id);
        toast.warning("Incompatible Component", {
          description: `This component is known to be incompatible with ${confName}.`,
        });
      }
      addComponent(categoryId, component, isMultiple);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (step === "quote") {
    return <QuoteForm onBack={() => setStep("configure")} />;
  }

  // Extract unique groups from categories
  const groups = Array.from(new Set(categories.map(c => c.group).filter(Boolean))) as string[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Configuration Options */}
      <div className="lg:col-span-2 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full rounded-md border p-2 bg-muted/50">
            <TabsList className="w-full justify-start !h-auto flex flex-wrap bg-transparent gap-2">
              <TabsTrigger value="base" className="flex-auto min-w-[140px] h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Base Platform
              </TabsTrigger>
              {groups.map((group) => (
                <TabsTrigger key={group} value={group} className="flex-auto min-w-[140px] h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  {group.replace(/^\d+\s/, '')}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="base" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <Card 
                    key={prod.id} 
                    className={`cursor-pointer transition-all ${selectedProduct?.id === prod.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setProduct(prod)}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {prod.name}
                        {selectedProduct?.id === prod.id && <Check className="h-5 w-5 text-primary" />}
                      </CardTitle>
                      <CardDescription>Rs. {prod.base_price.toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{prod.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {groups.map((group) => (
              <TabsContent key={group} value={group} className="m-0 space-y-8">
                {categories.filter(c => c.group === group).map((cat) => (
                  <div key={cat.id}>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cat.is_multiple_allowed ? "Select one or more options." : "Select one option."}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cat.components?.map((comp) => {
                        const isSelected = selectedComponents[cat.id]?.some((c) => c.id === comp.id);
                        const isIncompatible = incompatibleCompIds.has(comp.id);
                        return (
                          <Card 
                            key={comp.id} 
                            className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-primary/50'} ${isIncompatible && !isSelected ? 'opacity-60 grayscale' : ''}`}
                            onClick={() => handleComponentToggle(cat.id, comp, cat.is_multiple_allowed)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex justify-between items-start">
                                <span className="flex items-center">
                                  {comp.name}
                                  {isIncompatible && !isSelected && (
                                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-destructive/20 text-destructive rounded-sm" title="Incompatible with your configuration">
                                      INCOMPATIBLE
                                    </span>
                                  )}
                                </span>
                                {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2 mt-1" />}
                              </CardTitle>
                              <CardDescription>
                                {comp.price_modifier > 0 ? `+Rs. ${comp.price_modifier.toLocaleString()}` : 'Included'}
                              </CardDescription>
                            </CardHeader>
                            {comp.description && (
                              <CardContent>
                                <p className="text-xs text-muted-foreground">{comp.description}</p>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Right Column: Live Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24 shadow-lg border-primary/20">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ScrollArea className="h-[40vh] pr-4">
              <div className="space-y-4">
                {selectedProduct && (
                  <div className="flex justify-between items-start border-b border-border/50 pb-2">
                    <div>
                      <h4 className="font-medium">{selectedProduct.name}</h4>
                      <p className="text-xs text-muted-foreground">Base Platform</p>
                    </div>
                    <span className="font-medium">Rs. {selectedProduct.base_price.toLocaleString()}</span>
                  </div>
                )}
                
                {categories.map((cat) => {
                  const selection = selectedComponents[cat.id];
                  if (!selection || selection.length === 0) return null;
                  
                  return (
                    <div key={cat.id} className="border-b border-border/50 pb-2">
                      <p className="text-xs text-muted-foreground mb-1">{cat.name}</p>
                      {selection.map((comp) => (
                        <div key={comp.id} className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{comp.name}</h4>
                          <span className="text-sm">
                            {comp.price_modifier > 0 ? `+Rs. ${comp.price_modifier.toLocaleString()}` : '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col pt-2 pb-6 border-t bg-muted/20">
            <div className="flex justify-between items-end w-full mb-6 mt-2">
              <span className="text-lg font-medium">Estimated Total</span>
              <span className="text-3xl font-bold text-primary">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <Button size="lg" className="w-full" onClick={() => setStep("quote")} disabled={!selectedProduct}>
              Request Formal Quote
            </Button>
            {user && (
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full mt-2" 
                onClick={handleSaveConfig} 
                disabled={!selectedProduct || savingConfig}
              >
                {savingConfig && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editConfigId ? "Update Configuration" : "Save for Later"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
