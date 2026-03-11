import { motion } from "framer-motion";
import { Info, Shield, Zap, Image, Download, Clock } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Remove backgrounds in seconds with our advanced AI technology"
    },
    {
      icon: Image,
      title: "High Quality",
      description: "Get pixel-perfect results with professional-grade output"
    },
    {
      icon: Download,
      title: "Easy Export",
      description: "Download your images in multiple formats with one click"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Process images anytime, anywhere with our reliable service"
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
            <Info className="h-4 w-4 text-primary" />
            About BG Remover
          </motion.div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            AI-Powered <span className="text-gradient-primary">Background Removal</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            BG Remover is an advanced AI-powered tool that instantly removes backgrounds from your images. 
            Our cutting-edge technology ensures pixel-perfect results in seconds, making it the perfect 
            solution for designers, marketers, and content creators.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
                    <Info className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We're dedicated to making professional image editing accessible to everyone. 
                  Our mission is to simplify complex visual tasks through innovative AI technology, 
                  allowing users to achieve studio-quality results without technical expertise.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">What We Offer:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Instant background removal</li>
                    <li>High-quality output processing</li>
                    <li>Multiple format support (PNG, JPG, WEBP)</li>
                    <li>Secure and private processing</li>
                    <li>API access for developers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-secondary">
                    <Shield className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is our top priority. All images are automatically deleted after 24 hours, 
                  and we never store your original files. Our secure servers ensure your data remains 
                  protected at all times with enterprise-grade encryption.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Security Measures:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>End-to-end encryption</li>
                    <li>Auto-deletion after 24 hours</li>
                    <li>No data sharing with third parties</li>
                    <li>GDPR compliant infrastructure</li>
                    <li>Secure server architecture</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold md:text-5xl mb-6">
            Key <span className="text-gradient-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for perfect background removal, powered by advanced AI technology
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
    </PublicLayout>
  );
};

export default About;
