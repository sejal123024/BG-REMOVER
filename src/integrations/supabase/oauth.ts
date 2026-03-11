import { supabase } from "./client";

export const signInWithGoogle = async () => {
  try {
    console.log("🚀 Starting Google OAuth flow...");
    
    // Get current origin for redirect
    const origin = window.location.origin;
    const redirectTo = `${origin}/dashboard`;
    
    console.log("📍 Redirect URL:", redirectTo);
    
    // Try OAuth with better error handling
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("❌ OAuth failed:", error);
      return { 
        success: false, 
        error: error.message,
        suggestions: getSuggestions(error.message)
      };
    }
    
    console.log("✅ OAuth initiated successfully");
    return { success: true, method: 'oauth' };
    
  } catch (error) {
    console.error("❌ Unexpected OAuth error:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred",
      suggestions: ["Check your internet connection", "Try again later", "Use email signup instead"]
    };
  }
};

function getSuggestions(errorMessage: string): string[] {
  const suggestions: string[] = [];
  
  if (errorMessage.includes('popup') || errorMessage.includes('blocked')) {
    suggestions.push("Allow popups for this site in your browser settings");
    suggestions.push("Try refreshing the page and attempt again");
  }
  
  if (errorMessage.includes('redirect')) {
    suggestions.push("Check if your redirect URL is properly configured");
    suggestions.push("Make sure the domain is whitelisted in Google OAuth");
  }
  
  if (errorMessage.includes('provider') || errorMessage.includes('disabled')) {
    suggestions.push("Contact administrator to enable Google OAuth");
    suggestions.push("Use email signup as an alternative");
  }
  
  suggestions.push("Try using email signup instead");
  suggestions.push("Check browser console for more details");
  
  return suggestions;
}

// Helper function to handle OAuth callback
export const handleOAuthCallback = async () => {
  try {
    console.log("🔄 Handling OAuth callback...");
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (data.session) {
      console.log("✅ OAuth successful, user logged in");
      return { success: true, session: data.session };
    } else {
      console.log("⏳ No session found, checking for error in URL...");
      
      // Check for OAuth errors in URL
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error) {
        throw new Error(errorDescription || error);
      }
      
      return { success: false, error: "No session found after OAuth" };
    }
  } catch (error) {
    console.error("❌ OAuth callback error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Callback failed" 
    };
  }
};
