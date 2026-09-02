"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";
import { Product } from "@/types";
import { Loader2, Anchor } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 min-h-[calc(100vh-16rem)]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Our Base Platforms</h1>
        <p className="text-lg text-muted-foreground">
          Bathycat offers industry-leading Unmanned Surface Vehicles. Choose a base platform below and fully customize it to match your mission requirements.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col border-primary/20 bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="aspect-video bg-muted/30 flex justify-center items-center rounded-t-xl border-b border-border/50">
                <Anchor className="h-16 w-16 text-primary/40" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription className="text-xl font-medium text-primary mt-2">
                  Starting at Rs. {product.base_price.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/configurator">Configure {product.name}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
