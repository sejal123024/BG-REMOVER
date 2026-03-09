import { useEffect } from "react";
import PublicLayout from "@/components/PublicLayout";

const OAuthInitiate = () => {
  useEffect(() => {
    // Placeholder route for OAuth initiation used by external auth libraries.
    // Intentionally minimal; libraries handle the flow via URL and storage.
    console.log("OAuth initiation route loaded");
  }, []);

  return (
    <PublicLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Redirecting…</h1>
          <p className="text-muted-foreground mt-2">Continuing secure sign-in flow.</p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OAuthInitiate;
