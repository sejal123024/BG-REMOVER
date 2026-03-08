import PublicLayout from "@/components/PublicLayout";
import { motion } from "framer-motion";
import { Sparkles, Clock, Shield, Code2, Layers, Palette, Globe, Cpu } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Removal", description: "State-of-the-art deep learning models deliver pixel-perfect background removal on any image." },
  { icon: Clock, title: "Lightning Fast", description: "Process images in under 5 seconds — no waiting, no queues." },
  { icon: Shield, title: "Secure & Private", description: "Images auto-delete after 24 hours. Your data stays yours." },
  { icon: Code2, title: "REST API", description: "Integrate background removal into your apps with a simple REST API." },
  { icon: Layers, title: "Batch Processing", description: "Remove backgrounds from hundreds of images at once with our bulk endpoint." },
  { icon: Palette, title: "Custom Backgrounds", description: "Replace removed backgrounds with solid colors, gradients, or custom images." },
  { icon: Globe, title: "CDN Delivery", description: "Processed images are served from a global CDN for blazing-fast access." },
  { icon: Cpu, title: "Edge Processing", description: "Images are processed at edge locations closest to your users for minimal latency." },
];

const Features = () => (
  <PublicLayout>
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">
            Powerful <span className="text-gradient-primary">Features</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need for professional-grade background removal.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default Features;
