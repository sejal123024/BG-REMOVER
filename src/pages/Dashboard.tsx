import { motion } from "framer-motion";
import { Image, CreditCard, TrendingUp, Clock, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";

const stats = [
  { label: "Images Processed", value: "24", icon: Image },
  { label: "Credits Remaining", value: "3", icon: CreditCard },
  { label: "This Month", value: "87", icon: TrendingUp },
];

const recentUploads = [
  { name: "product-shot.jpg", date: "2 hours ago", status: "done" },
  { name: "headshot.png", date: "5 hours ago", status: "done" },
  { name: "team-photo.jpg", date: "1 day ago", status: "done" },
  { name: "logo-mockup.webp", date: "2 days ago", status: "done" },
];

const Dashboard = () => (
  <PublicLayout>
    <section className="py-16">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-2 mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              New Upload
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscription Banner */}
        <div className="glass-card rounded-2xl p-6 mb-8 border-primary/20 relative overflow-hidden">
          <div className="bg-gradient-hero absolute inset-0" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gradient-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">Free Plan</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You have <span className="text-foreground font-semibold">3 of 5</span> free daily credits remaining.
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="glass-card rounded-2xl">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-semibold">Recent Uploads</h2>
          </div>
          <div className="divide-y divide-border">
            {recentUploads.map((upload) => (
              <div key={upload.name} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Image className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{upload.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {upload.date}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default Dashboard;
