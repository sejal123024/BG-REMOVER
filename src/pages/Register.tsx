import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle } from "@/integrations/supabase/oauth";

const Register = () => {
  const [showPw, setShowPw] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    if (fullName.trim().length < 2) {
      toast({ 
        title: "Name required", 
        description: "Please enter your full name.", 
        variant: "destructive" 
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ 
        title: "Invalid email format", 
        description: "Please enter a valid email address.", 
        variant: "destructive" 
      });
      return;
    }
    
    // Validate password
    if (password.length < 8) {
      toast({ 
        title: "Password too short", 
        description: "Minimum 8 characters required.", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/login?message=Please confirm your email`,
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        let errorMessage = error.message;
        
        // Provide better error messages
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please try logging in.";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Password must be at least 8 characters long.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        }
        
        toast({ 
          title: "Signup failed", 
          description: errorMessage, 
          variant: "destructive" 
        });
      } else {
        console.log("Signup successful:", data);
        if (data.session) {
          toast({ 
            title: "Account created!", 
            description: "Welcome to BG Remover!", 
          });
          navigate("/dashboard");
        } else {
          toast({ 
            title: "Account created!", 
            description: "Please check your email to confirm your account.", 
          });
        }
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      toast({ 
        title: "Signup failed", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
  setLoading(true);
  
  try {
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast({ 
        title: "Redirecting to Google...", 
        description: "Please complete the sign-in process in your browser.", 
      });
    } else {
      console.error("Google signup failed:", result.error);
      
      let errorMessage = result.error || "Unable to connect with Google";
      
      // Show suggestions if available
      if (result.suggestions && result.suggestions.length > 0) {
        errorMessage += "\n\nSuggestions:\n" + result.suggestions.map(s => `• ${s}`).join('\n');
      }
      
      toast({ 
        title: "Google signup failed", 
        description: errorMessage,
        variant: "destructive" 
      });
    }
  } catch (error) {
    console.error("Unexpected Google signup error:", error);
    toast({ 
      title: "Google signup failed", 
      description: "An unexpected error occurred. Please try again or use email signup.",
      variant: "destructive" 
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <PublicLayout>
      <section className="flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Start removing backgrounds for free</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button variant="hero" className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </section>
    </PublicLayout>
  );
};

export default Register;
