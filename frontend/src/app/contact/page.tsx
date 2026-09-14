"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully!", {
        description: "A Bathycat survey specialist will respond within 24 hours.",
      });
    }, 800);
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl min-h-[calc(100vh-16rem)]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <MessageSquare className="h-3.5 w-3.5" />
          Get in Touch
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Contact Bathycat</h1>
        <p className="text-muted-foreground text-lg">
          Have questions about custom builds, hydrographic sensors, payload integration, or dealership inquiries? Our engineering team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium text-foreground">General & Sales:</p>
              <a href="mailto:info@bathycat.com" className="text-primary hover:underline">info@bathycat.com</a>
              <p className="font-medium text-foreground pt-2">Technical & Warranty:</p>
              <a href="mailto:support@bathycat.com" className="text-primary hover:underline">support@bathycat.com</a>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Phone & Hotline
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="text-muted-foreground">Mon - Fri, 9:00 AM - 6:00 PM (IST)</p>
              <p className="font-mono font-medium text-foreground">+91 98765 43210</p>
              <p className="text-xs text-muted-foreground">Emergency field support line available for enterprise subscribers.</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Engineering Headquarters
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Bathycat Marine Robotics Lab</p>
              <p>Technology Innovation Hub, IIT Roorkee Campus</p>
              <p>Roorkee, Uttarakhand 247667, India</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Response Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              We aim to review all survey vessel inquiries within 24 business hours. If you already have a configured boat, you can also submit a quote directly from our Configurator.
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below and our marine robotics specialists will get back to you promptly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold">Thank You!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your inquiry has been received. One of our survey boat technical advisors will review your requirements and reach out via email.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input required placeholder="Capt. Sarah Jenkins" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address *</label>
                      <Input required type="email" placeholder="sarah@oceansurvey.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Organization / Company</label>
                      <Input placeholder="Coastal Hydrography Labs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Inquiry Type</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="quote">Custom Vessel Build & Pricing</option>
                        <option value="technical">Hydrographic Sensor Compatibility</option>
                        <option value="dealer">Dealership & Distribution</option>
                        <option value="support">Existing Boat Warranty / Support</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message & Project Scope *</label>
                    <Textarea 
                      required 
                      rows={5} 
                      placeholder="Please tell us about your survey environment (e.g., coastal, inland reservoir, shallow river), target sensors (multibeam, single-beam, water quality), and mission goals..." 
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Inquiry
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
