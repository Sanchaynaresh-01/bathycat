"use client";

import { useEffect, useState } from "react";
import { getComponentCategories, createComponent, updateComponent, deleteComponent } from "@/lib/api";
import { ComponentCategory, Component } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Layers, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AdminComponentsPage() {
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getComponentCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateComponent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const category_id = parseInt(formData.get("category_id") as string);
    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price_modifier: parseFloat(formData.get("price_modifier") as string),
      category_id: category_id,
      is_active: true
    };

    try {
      await createComponent(payload);
      toast.success("Component created successfully");
      setOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to create component");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateComponent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingComponent) return;
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price_modifier: parseFloat(formData.get("price_modifier") as string),
    };

    try {
      await updateComponent(editingComponent.id, payload);
      toast.success("Component updated successfully");
      setEditingComponent(null);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update component");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this component?")) return;
    setDeletingId(id);
    try {
      await deleteComponent(id);
      toast.success("Component deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete component");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">Manage accessories, parts, and their prices.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Component</DialogTitle>
              <DialogDescription>Add a new option to a specific category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateComponent} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  required 
                  name="category_id" 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.group})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Component Name</label>
                <input required name="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Garmin GPSMAP 8410" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea required name="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Detailed specs..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Modifier (Rs.)</label>
                <input required type="number" step="0.01" name="price_modifier" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="1200" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={creating || !selectedCategoryId}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories & Components</CardTitle>
          <CardDescription>Browse through all available configuration options.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {categories.map((category) => (
                <AccordionItem key={category.id} value={`cat-${category.id}`}>
                  <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-md">
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{category.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({category.group})</span>
                      <span className="ml-auto mr-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {category.components?.length || 0} items
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2 px-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price Modifier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!category.components || category.components.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground text-sm">No components in this category.</TableCell>
                          </TableRow>
                        ) : (
                          category.components.map((comp) => (
                            <TableRow key={comp.id}>
                              <TableCell className="font-medium text-xs">#{comp.id}</TableCell>
                              <TableCell>{comp.name}</TableCell>
                              <TableCell className={comp.price_modifier > 0 ? "text-green-600 font-medium" : ""}>
                                {comp.price_modifier > 0 ? `+Rs. ${comp.price_modifier.toLocaleString()}` : 'Included'}
                              </TableCell>
                              <TableCell>
                                {comp.is_active ? (
                                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-green-500/10 text-green-500">Active</span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground">Inactive</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => setEditingComponent(comp)}>Edit</Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(comp.id)} disabled={deletingId === comp.id}>
                                    {deletingId === comp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingComponent} onOpenChange={(open) => !open && setEditingComponent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Component</DialogTitle>
            <DialogDescription>Update details for {editingComponent?.name}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateComponent} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Component Name</label>
              <input required name="name" defaultValue={editingComponent?.name} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required name="description" defaultValue={editingComponent?.description || ""} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Modifier (Rs.)</label>
              <input required type="number" step="0.01" name="price_modifier" defaultValue={editingComponent?.price_modifier} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingComponent(null)}>Cancel</Button>
              <Button type="submit" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
