"use client";

import { useEffect, useState } from "react";
import { getComponentCategories, getConstraints, createConstraint, deleteConstraint } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function InventoryConstraintsPage() {
  const [components, setComponents] = useState<any[]>([]);
  const [constraints, setConstraints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedComp1, setSelectedComp1] = useState<string>("");
  const [selectedComp2, setSelectedComp2] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, constraintsRes] = await Promise.all([
        getComponentCategories(),
        getConstraints()
      ]);
      
      // Flatten components from categories
      const allComps = catsRes.flatMap((cat: any) => cat.components);
      setComponents(allComps);
      setConstraints(constraintsRes);
    } catch (error) {
      console.error("Failed to load inventory data", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddConstraint = async () => {
    if (!selectedComp1 || !selectedComp2) {
      toast.error("Please select both components");
      return;
    }
    if (selectedComp1 === selectedComp2) {
      toast.error("A component cannot be incompatible with itself");
      return;
    }
    
    try {
      setIsAdding(true);
      await createConstraint({
        component_id: parseInt(selectedComp1),
        incompatible_component_id: parseInt(selectedComp2)
      });
      toast.success("Constraint added successfully");
      setSelectedComp1("");
      setSelectedComp2("");
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add constraint");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteConstraint = async (id: number) => {
    try {
      await deleteConstraint(id);
      toast.success("Constraint deleted");
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete constraint");
    }
  };

  const getComponentName = (id: number) => {
    const comp = components.find(c => c.id === id);
    return comp ? comp.name : `Unknown (${id})`;
  };

  if (loading && components.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory & Constraints</h1>
        <p className="text-muted-foreground">Manage component compatibilities and restrictions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Constraint</CardTitle>
          <CardDescription>
            Select two components that are incompatible. If a user selects the primary component, the secondary one will be flagged as incompatible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Primary Component</label>
              <Select value={selectedComp1} onValueChange={setSelectedComp1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a component..." />
                </SelectTrigger>
                <SelectContent>
                  {components.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-center py-2 px-2 text-muted-foreground">
              <span className="font-bold">NOT COMPATIBLE WITH</span>
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Secondary Component</label>
              <Select value={selectedComp2} onValueChange={setSelectedComp2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a component..." />
                </SelectTrigger>
                <SelectContent>
                  {components.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddConstraint} disabled={isAdding} className="w-full md:w-auto">
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Constraints</CardTitle>
          <CardDescription>A list of all currently active component constraints.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule ID</TableHead>
                <TableHead>Primary Component</TableHead>
                <TableHead>Incompatible With</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {constraints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No constraints defined.
                  </TableCell>
                </TableRow>
              ) : (
                constraints.map((constraint) => (
                  <TableRow key={constraint.id}>
                    <TableCell>#{constraint.id}</TableCell>
                    <TableCell className="font-medium">
                      {getComponentName(constraint.component_id)}
                    </TableCell>
                    <TableCell className="text-destructive font-medium">
                      {getComponentName(constraint.incompatible_component_id)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteConstraint(constraint.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
