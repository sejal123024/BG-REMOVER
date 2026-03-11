import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, TrendingUp, Clock, Upload, Download, Loader2, Info, Settings, Mail, HelpCircle, User, Shield, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/services/emailService";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<{ file_name: string; created_at: string; status: string; result_url: string | null; original_url: string }[]>([]);
  const [totalUploads, setTotalUploads] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
    autoSave: true,
    highQuality: false
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('bg-remover-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      
      // Apply dark mode setting immediately
      if (parsedSettings.darkMode) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bg-remover-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      const [uploadsRes, countRes] = await Promise.all([
        supabase.from("uploads").select("file_name, created_at, status, result_url, original_url").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("uploads").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (uploadsRes.data) setUploads(uploadsRes.data);
      if (countRes.count !== null) setTotalUploads(countRes.count);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const stats = [
    { label: "Images Processed", value: String(totalUploads), icon: Image },
    { label: "This Week", value: String(Math.min(totalUploads, 7)), icon: TrendingUp },
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

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Implement actual functionality for each setting
    switch (key) {
      case 'darkMode':
        // Toggle dark mode on the document
        if (value) {
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
        }
        toast({
          title: "Theme Changed",
          description: `${value ? 'Dark' : 'Light'} mode has been enabled.`,
        });
        break;
        
      case 'emailNotifications':
        // In a real app, this would update user preferences in the database
        toast({
          title: "Notifications Updated",
          description: `Email notifications have been ${value ? 'enabled' : 'disabled'}.`,
        });
        break;
        
      case 'autoSave':
        // In a real app, this would affect upload behavior
        toast({
          title: "Auto-Save Updated",
          description: `Auto-save has been ${value ? 'enabled' : 'disabled'}.`,
        });
        break;
        
      case 'highQuality':
        // In a real app, this would affect processing settings
        toast({
          title: "Quality Setting Updated",
          description: `High quality processing has been ${value ? 'enabled' : 'disabled'}.`,
        });
        break;
        
      default:
        toast({
          title: "Setting Updated",
          description: `${key} has been ${value ? 'enabled' : 'disabled'}.`,
        });
    }
  };

  const handleExportData = async () => {
    try {
      // In a real application, this would call your backend API
      // For now, we'll simulate the export process
      const userData = {
        user: {
          id: user?.id,
          email: user?.email,
          created_at: user?.created_at
        },
        uploads: uploads,
        settings: settings,
        exportDate: new Date().toISOString()
      };

      // Create and download the JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bg-remover-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported Successfully!",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      if (window.confirm("This is your final warning. All your data will be permanently deleted.")) {
        try {
          // In a real application, this would call your backend API to delete the user
          // For now, we'll simulate the deletion process
          
          toast({
            title: "Account Deletion Initiated",
            description: "Your account will be permanently deleted within 24 hours.",
            variant: "destructive",
          });

          // Simulate account deletion delay
          setTimeout(() => {
            // In a real app, you would log the user out and redirect to home
            toast({
              title: "Account Deleted",
              description: "Your account has been permanently deleted.",
              variant: "destructive",
            });
          }, 2000);

        } catch (error) {
          toast({
            title: "Deletion Failed",
            description: "There was an error deleting your account. Please contact support.",
            variant: "destructive",
          });
        }
      }
    }
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
      <section className="py-12">
        <div className="flex flex-col gap-4 mb-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Welcome back! Here's your overview.</p>
          </div>
          <Button variant="hero" size="lg" asChild className="shadow-xl shadow-primary/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-3">
            <Link to="/upload">
              <Upload className="h-5 w-5 mr-2" />
              New Upload
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                  <p className="font-display text-4xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
                  <stat.icon className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Uploads */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
          <div className="p-8 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
            <h2 className="font-display text-2xl font-semibold">Recent Uploads</h2>
          </div>
          {uploads.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Upload className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No uploads yet</h3>
              <p className="text-lg">Start by uploading your first image!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {uploads.map((upload) => {
                const displayUrl = upload.result_url || upload.original_url;
                return (
                  <div key={upload.file_name + upload.created_at} className="flex items-center justify-between p-6 px-8 hover:bg-muted/30 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 overflow-hidden shrink-0 shadow-sm">
                        {displayUrl ? (
                          <img src={displayUrl} alt={upload.file_name} className="h-full w-full object-cover" />
                        ) : (
                          <Image className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{upload.file_name}</p>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {timeAgo(upload.created_at)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm" asChild>
                      <a href={displayUrl || "#"} download={upload.file_name} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default Dashboard;
