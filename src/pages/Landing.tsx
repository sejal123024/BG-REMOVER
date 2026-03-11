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
        <div className="relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-6 py-2 text-sm text-muted-foreground shadow-lg">
              <Zap className="h-4 w-4 text-primary" />
              AI-Powered Background Removal
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Remove Backgrounds{" "}
              <span className="text-gradient-primary">In Seconds</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Upload your image and let our AI do the magic. Get clean, transparent backgrounds
              instantly — no design skills needed.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/25 hover:shadow-2xl transition-all duration-300 hover:scale-105" asChild>
                <Link to="/register">Start Removing — Free</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 mx-auto max-w-5xl"
          >
            <div className="glass-card rounded-3xl overflow-hidden p-2 shadow-2xl">
              <img
                src={heroDemoImg}
                alt="Background removal demo - before and after comparison"
                className="w-full rounded-2xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-border/50">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Three Simple Steps
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">No learning curve. Just results.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-3xl p-10 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
                <step.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="mb-2 text-sm font-semibold text-primary">Step {i + 1}</div>
              <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border/50">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Built for <span className="text-gradient-primary">Professionals</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">Everything you need for perfect cutouts.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <feature.icon className="h-10 w-10 text-primary mb-6" />
              <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="glass-card rounded-3xl p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="bg-gradient-hero absolute inset-0" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold md:text-6xl mb-6">
              Ready to Remove Backgrounds?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Join thousands of designers, marketers, and developers who trust BG Remover.
            </p>
            <Button variant="hero" size="lg" className="mt-10 h-14 px-12 text-lg shadow-xl shadow-primary/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse-glow" asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Landing;
