"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyQuotes, getMyConfigurations, deleteConfiguration, updateConfiguration } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle2, Edit2, Trash2, Edit3 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingConfig, setRenamingConfig] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Simple auth check - delay slightly to allow hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      if (!token) {
        router.push("/login");
      } else if (user && user.role !== "Customer") {
        logout();
        router.push("/login");
      }
    }
  }, [token, user, mounted, router, logout]);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [quotesData, configsData] = await Promise.all([
        getMyQuotes(),
        getMyConfigurations()
      ]);
      setQuotes(quotesData);
      setConfigs(configsData);
    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  if (!mounted || loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteConfiguration(id);
      toast.success("Configuration deleted");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete configuration");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRename = async () => {
    if (!renamingConfig || !newName.trim()) return;
    try {
      await updateConfiguration(renamingConfig.id, { name: newName });
      toast.success("Configuration renamed");
      setRenamingConfig(null);
      await fetchData();
    } catch (error) {
      toast.error("Failed to rename configuration");
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.full_name}</p>
      </div>

      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes">My Quotes</TabsTrigger>
          <TabsTrigger value="configurations">Saved Configurations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Quote Requests</CardTitle>
              <CardDescription>Track the status of your requested quotes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Project Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        You have not submitted any quotes yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">#{quote.id}</TableCell>
                        <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {quote.project_details || "No details provided"}
                        </TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configurations">
          <Card>
            <CardHeader>
              <CardTitle>Saved Configurations</CardTitle>
              <CardDescription>View your saved boat configurations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {configs.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    You have not saved any configurations yet.
                  </div>
                ) : (
                  configs.map((config) => {
                    const hasQuote = quotes.some(q => q.configuration_id === config.id);
                    return (
                      <Card key={config.id} className="overflow-hidden flex flex-col">
                        <CardHeader className="bg-muted/50 pb-4">
                          <CardTitle className="text-lg flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="truncate" title={config.name || `Config #${config.id}`}>
                                {config.name || `Config #${config.id}`}
                              </span>
                              {hasQuote && (
                                <span title="Quote Requested"><CheckCircle2 className="h-5 w-5 text-green-500" /></span>
                              )}
                            </div>
                            <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">
                              {new Date(config.created_at).toLocaleDateString()}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            {config.product?.name || `Base Platform ID: ${config.product_id}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1">
                          <p className="text-sm text-muted-foreground mb-4">
                            {config.selected_components?.length || 0} additional components selected
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg">
                              Rs. {config.total_price?.toLocaleString() || "0"}
                            </span>
                          </div>
                        </CardContent>
                        {!hasQuote && (
                          <CardFooter className="bg-muted/20 border-t pt-4 flex gap-2 justify-end">
                            <Dialog open={renamingConfig?.id === config.id} onOpenChange={(open) => {
                              if (!open) setRenamingConfig(null);
                              else {
                                setRenamingConfig(config);
                                setNewName(config.name || `Config #${config.id}`);
                              }
                            }}>
                              <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })} title="Rename">
                                <Edit3 className="h-4 w-4" />
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Rename Configuration</DialogTitle>
                                  <DialogDescription>Enter a new name for your configuration.</DialogDescription>
                                </DialogHeader>
                                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Configuration Name" />
                                <DialogFooter>
                                  <Button onClick={handleRename}>Save</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => router.push(`/configurator?configId=${config.id}`)} title="Edit Components">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(config.id)} disabled={deletingId === config.id} title="Delete">
                              {deletingId === config.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
