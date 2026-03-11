import { supabase } from "./client";

export const checkSupabaseConnection = async () => {
  try {
    // Check if environment variables are set first
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    console.log("Checking environment variables:");
    console.log("VITE_SUPABASE_URL:", supabaseUrl);
    console.log("VITE_SUPABASE_PUBLISHABLE_KEY:", supabaseKey ? `${supabaseKey.substring(0, 20)}...` : "undefined");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return {
        connected: false,
        error: "Missing environment variables",
        details: "VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set. Please restart your dev server after updating .env file."
      };
    }

    if (supabaseUrl === "https://YOUR-PROJECT-REF.supabase.co" || 
        supabaseKey === "YOUR-ANON-PUBLIC-KEY") {
      console.error("Supabase environment variables are not configured");
      return {
        connected: false,
        error: "Environment variables not configured",
        details: "Please update your .env file with actual Supabase credentials and restart the dev server"
      };
    }

    // Test basic connection by checking if we can get the session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase connection error:", error);
      return { 
        connected: false, 
        error: error.message,
        details: "Failed to get session from Supabase. Check your credentials."
      };
    }

    console.log("Supabase connection successful");
    return {
      connected: true,
      url: supabaseUrl,
      hasSession: !!session
    };
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Failed to connect to Supabase. Check your configuration."
    };
  }
};

export const testSupabaseAuth = async () => {
  try {
    // Test OAuth providers
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true, // Just test if OAuth is configured
      },
    });
    
    if (error && !error.message.includes('No provider')) {
      return {
        oauthConfigured: false,
        error: error.message,
        details: "Google OAuth is not properly configured in Supabase"
      };
    }
    
    return {
      oauthConfigured: true,
      details: "Google OAuth is configured"
    };
  } catch (error) {
    return {
      oauthConfigured: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Failed to test OAuth configuration"
    };
  }
};
