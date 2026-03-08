import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/PublicLayout";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect to try it out",
    features: ["5 images/day", "Standard quality", "JPG & PNG support", "Web dashboard"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For professionals & teams",
    features: [
      "Unlimited images",
      "HD quality output",
      "All formats (JPG, PNG, WEBP)",
      "Priority processing",
      "API access",
      "Download history",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Credit Pack",
    price: "₹199",
    period: "/ 50 credits",
    description: "Pay as you go",
    features: ["50 images per pack", "HD quality output", "All formats", "No expiry", "API access"],
    cta: "Buy Credits",
    popular: false,
  },
];

const Pricing = () => (
  <PublicLayout>
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">
            Simple, Transparent <span className="text-gradient-primary">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-8 flex flex-col relative ${
                plan.popular ? "border-primary glow-red-soft" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6">
                <span className="font-display text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "hero" : "outline"}
                className="mt-8 w-full"
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default Pricing;
