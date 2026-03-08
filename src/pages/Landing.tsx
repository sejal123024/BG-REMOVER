import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Sparkles, Download, Zap, Image, Shield, Clock, Code2 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import heroDemoImg from "@/assets/hero-demo.jpg";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "State-of-the-art AI removes backgrounds with pixel-perfect accuracy.",
  },
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "Process images in under 5 seconds. No waiting around.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Images auto-delete after 24 hours. Your data stays yours.",
  },
  {
    icon: Code2,
    title: "API Access",
    description: "Integrate background removal into your apps with our REST API.",
  },
];

const steps = [
  { icon: Upload, title: "Upload", description: "Drag & drop or browse your image" },
  { icon: Sparkles, title: "Process", description: "AI removes the background instantly" },
  { icon: Download, title: "Download", description: "Get your transparent PNG" },
];

const Landing = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-hero absolute inset-0" />
        <div className="container relative py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              AI-Powered Background Removal
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Remove Backgrounds{" "}
              <span className="text-gradient-primary">In Seconds</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Upload your image and let our AI do the magic. Get clean, transparent backgrounds
              instantly — no design skills needed.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="lg" className="h-13 px-8 text-base" asChild>
                <Link to="/register">Start Removing — Free</Link>
              </Button>
              <Button variant="heroOutline" size="lg" className="h-13 px-8 text-base" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="glass-card rounded-2xl overflow-hidden p-1">
              <img
                src={heroDemoImg}
                alt="Background removal demo - before and after comparison"
                className="w-full rounded-xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Three Simple Steps
            </h2>
            <p className="mt-4 text-muted-foreground">No learning curve. Just results.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="mb-1 text-sm font-semibold text-primary">Step {i + 1}</div>
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Built for <span className="text-gradient-primary">Professionals</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Everything you need for perfect cutouts.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <div className="glass-card rounded-3xl p-12 text-center md:p-16 relative overflow-hidden">
            <div className="bg-gradient-hero absolute inset-0" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold md:text-5xl">
                Ready to Remove Backgrounds?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Join thousands of designers, marketers, and developers who trust BG Remover.
              </p>
              <Button variant="hero" size="lg" className="mt-8 h-13 px-10 text-base animate-pulse-glow" asChild>
                <Link to="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Landing;
