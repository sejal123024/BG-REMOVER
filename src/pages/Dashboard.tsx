import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, CreditCard, TrendingUp, Clock, Upload, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<{ total_credits: number; used_today: number } | null>(null);
  const [uploads, setUploads] = useState<{ file_name: string; created_at: string; status: string }[]>([]);
  const [totalUploads, setTotalUploads] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      const [creditsRes, uploadsRes, countRes] = await Promise.all([
        supabase.from("credits").select("total_credits, used_today").eq("user_id", user.id).single(),
        supabase.from("uploads").select("file_name, created_at, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("uploads").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (creditsRes.data) setCredits(creditsRes.data);
      if (uploadsRes.data) setUploads(uploadsRes.data);
      if (countRes.count !== null) setTotalUploads(countRes.count);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const remaining = credits ? credits.total_credits - credits.used_today : 0;

  const stats = [
    { label: "Images Processed", value: String(totalUploads), icon: Image },
    { label: "Credits Remaining", value: String(remaining), icon: CreditCard },
    { label: "Used Today", value: String(credits?.used_today ?? 0), icon: TrendingUp },
  ];

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="flex flex-col gap-2 mb-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
            </div>
            <Button variant="hero" size="lg" asChild className="shadow-lg shadow-primary/25 animate-pulse hover:animate-none text-base px-8 py-3">
              <Link to="/upload">
                <Upload className="h-5 w-5 mr-2" />
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
                  You have <span className="text-foreground font-semibold">{remaining} of {credits?.total_credits ?? 5}</span> free daily credits remaining.
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
            {uploads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No uploads yet. Start by uploading your first image!
              </div>
            ) : (
              <div className="divide-y divide-border">
                {uploads.map((upload) => (
                  <div key={upload.file_name + upload.created_at} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Image className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{upload.file_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(upload.created_at)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Dashboard;
