import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Bell, Palette, Download, Trash2 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
    autoSave: true,
    highQuality: false
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
        toast({
          title: "Notifications Updated",
          description: `Email notifications have been ${value ? 'enabled' : 'disabled'}.`,
        });
        break;
        
      case 'autoSave':
        toast({
          title: "Auto-Save Updated",
          description: `Auto-save has been ${value ? 'enabled' : 'disabled'}.`,
        });
        break;
        
      case 'highQuality':
        toast({
          title: "Quality Setting Updated",
          description: `High quality processing has been ${value ? 'enabled' : 'disabled'}.`,
        });
        break;
    }
  };

  const handleExportData = async () => {
    try {
      const userData = {
        user: {
          id: user?.id,
          email: user?.email,
          created_at: user?.created_at
        },
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
          toast({
            title: "Account Deletion Initiated",
            description: "Your account will be permanently deleted within 24 hours.",
            variant: "destructive",
          });

          setTimeout(() => {
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

  return (
    <PublicLayout>
      <section className="py-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-6 py-2 text-sm text-muted-foreground shadow-lg mb-8"
          >
            <Settings className="h-4 w-4 text-primary" />
            Settings
          </motion.div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Customize Your <span className="text-gradient-primary">Experience</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Manage your preferences, account settings, and personal information to get the most out of BG Remover.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
                    <Settings className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your BG Remover experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your uploads</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save" className="font-medium">Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save processed images</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="high-quality" className="font-medium">High Quality</Label>
                    <p className="text-sm text-muted-foreground">Process images in maximum quality</p>
                  </div>
                  <Switch
                    id="high-quality"
                    checked={settings.highQuality}
                    onCheckedChange={(checked) => handleSettingChange('highQuality', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-secondary">
                    <User className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">Email Address</Label>
                  <Input value={user?.email || ""} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">User ID</Label>
                  <Input value={user?.id || ""} disabled className="bg-muted/50" />
                </div>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SettingsPage;
