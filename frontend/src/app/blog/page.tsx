import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

const POSTS = [
  {
    slug: "bathymetric-surveying-autonomous-usv",
    title: "The Future of Shallow Water Bathymetry: Why Autonomous USVs are Replacing Manned Boats",
    excerpt: "How autonomous catamaran platforms reduce survey costs by up to 70% while improving depth sounding accuracy in dangerous or inaccessible waters.",
    date: "September 8, 2026",
    author: "Dr. Arvind Sharma",
    category: "Hydrography",
    readTime: "5 min read"
  },
  {
    slug: "rtk-gps-multibeam-integration",
    title: "Centimeter-Level Accuracy: Integrating Dual-Antenna RTK GNSS with Swath Bathymetry",
    excerpt: "Technical walkthrough on mitigating multipath errors, wave heave, and roll-pitch compensation during high-resolution riverbed mapping.",
    date: "August 24, 2026",
    author: "Bathycat Engineering",
    category: "Technical Guide",
    readTime: "8 min read"
  },
  {
    slug: "battery-endurance-survey-missions",
    title: "Maximizing Survey Endurance: Battery Chemistry, BMS Safety, and Solar Hybrid Systems",
    excerpt: "A deep dive into lithium pack thermal management, MPPT solar trickle charging, and extended 10+ hour field missions.",
    date: "August 12, 2026",
    author: "Marine Robotics Team",
    category: "Power Systems",
    readTime: "6 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl min-h-[calc(100vh-16rem)]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          Field Insights & Engineering
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Bathycat Marine Blog</h1>
        <p className="text-muted-foreground text-lg">
          Latest developments in hydrography, autonomous vessel design, bathymetric mapping case studies, and field best practices.
        </p>
      </div>

      {/* Posts List */}
      <div className="grid gap-6">
        {POSTS.map((post) => (
          <Card key={post.slug} className="border-border/60 hover:border-primary/50 transition-all shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <CardTitle className="text-2xl hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm pt-2 text-muted-foreground leading-relaxed">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center text-xs text-muted-foreground border-t border-border/40 pt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {post.date}
                </span>
              </div>
              <span className="inline-flex items-center text-primary font-medium">
                Read Article <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
