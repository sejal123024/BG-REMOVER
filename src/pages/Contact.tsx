import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, HelpCircle, User, Phone, MapPin, Clock } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/services/emailService";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Send the email
    const result = await sendContactEmail(contactForm);
    
    if (result.success) {
      // Clear form after successful submission
      setContactForm({ name: "", email: "", message: "" });
    }
  };

  const commonIssues = [
    {
      title: "Background not removing properly?",
      solution: "Try uploading a higher resolution image or ensure the subject has clear edges from the background."
    },
    {
      title: "Upload taking too long?",
      solution: "Check your internet connection and try reducing the image size to under 10MB."
    },
    {
      title: "Download not working?",
      solution: "Try using a different browser or disable any download-blocking extensions."
    },
    {
      title: "Webhook connection failed?",
      solution: "Ensure your n8n workflow is active and the webhook URL is correctly configured."
    },
    {
      title: "Account login issues?",
      solution: "Clear your browser cache and cookies, then try logging in again."
    },
    {
      title: "Payment/Subscription problems?",
      solution: "Contact our support team directly for immediate assistance with billing issues."
    }
  ];

  return (
    <PublicLayout>
      <section className="py-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-6 py-2 text-sm text-muted-foreground shadow-lg mb-8"
          >
            <Mail className="h-4 w-4 text-primary" />
            Contact Us
          </motion.div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Get In <span className="text-gradient-primary">Touch</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            We're here to help you with any questions, issues, or feedback. Reach out to our support team 
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Send Us a Message
                  <CardDescription>
                    Fill out the form below and we'll respond within 24 hours
                  </CardDescription>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-medium">How can we help?</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <Card className="rounded-3xl shadow-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
                    <HelpCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Common Issues & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="p-4 rounded-xl bg-background/50 hover:bg-background/70 transition-colors">
                    <h4 className="font-semibold mb-2 text-primary">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground">{issue.solution}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <User className="h-5 w-5" />
                  Developer Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Sejal Kumavat</p>
                    <p className="text-sm text-muted-foreground">Developer & Founder</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-secondary">
                    <Mail className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">sejalkumavat34@gmail.com</p>
                    <p className="text-sm text-muted-foreground">Direct support contact</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For technical issues, feature requests, or partnership opportunities, 
                    feel free to reach out directly. I typically respond within 24 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-xl bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">sejalkumavat34@gmail.com</p>
                  <p className="text-xs text-muted-foreground">Response time: 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-secondary mx-auto mb-4">
                    <Clock className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Support Hours</h3>
                  <p className="text-sm text-muted-foreground mb-2">Monday - Friday</p>
                  <p className="text-xs text-muted-foreground">9:00 AM - 6:00 PM IST</p>
                </div>
                <div className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-accent mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-sm text-muted-foreground mb-2">Based in India</p>
                  <p className="text-xs text-muted-foreground">Serving users worldwide</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </PublicLayout>
  );
};

export default Contact;
