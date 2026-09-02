"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getApprovedQuotes } from "@/lib/api";
import { Loader2, Eye } from "lucide-react";

export default function DealerDashboardPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await getApprovedQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Failed to load quotes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "Approved") {
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dealer Dashboard</h1>
        <p className="text-muted-foreground">View all approved quotes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approved Quotes</CardTitle>
          <CardDescription>Configurations approved by Admin for dealership fulfillment.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Config ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">No approved quotes found.</TableCell>
                  </TableRow>
                ) : (
                  quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.customer_name}</TableCell>
                      <TableCell>{quote.customer_email}</TableCell>
                      <TableCell>{quote.customer_company || "-"}</TableCell>
                      <TableCell>#{quote.configuration_id}</TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex justify-between items-center pr-8">
                                <span>Quote #{quote.id} Details</span>
                                {getStatusBadge(quote.status)}
                              </DialogTitle>
                              <DialogDescription>
                                Requested by {quote.customer_name} ({quote.customer_email}) on {new Date(quote.created_at).toLocaleDateString()}
                                {quote.project_details && (
                                  <div className="mt-2 text-foreground bg-muted p-2 rounded-md">
                                    <strong>Project Details:</strong> {quote.project_details}
                                  </div>
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            {quote.configuration ? (
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-lg">Base Platform</h4>
                                    <p>{quote.configuration.product?.name || `Product ID: ${quote.configuration.product_id}`}</p>
                                  </div>
                                  <div className="text-right">
                                    <h4 className="font-semibold text-lg">Total Value</h4>
                                    <p className="text-xl font-bold">Rs. {quote.configuration.total_price?.toLocaleString() || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-lg mb-2">Selected Components</h4>
                                  {quote.configuration.selected_components && quote.configuration.selected_components.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                      {quote.configuration.selected_components.map((comp: any, idx: number) => (
                                        <li key={idx}>
                                          {comp.name} 
                                          <span className="text-muted-foreground text-sm ml-2">
                                            (+Rs. {(comp.price_modifier || 0).toLocaleString()})
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-muted-foreground text-sm">No additional components selected.</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                                <p>Configuration details not available.</p>
                              </div>
                            )}
                            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                              {quote.status === "Approved" && (
                                <Button 
                                  onClick={async () => {
                                    try {
                                      await import('@/lib/api').then(m => m.updateQuoteStatus(quote.id, "Completed"));
                                      fetchQuotes();
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                >
                                  Mark as Completed
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
