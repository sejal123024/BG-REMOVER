import PublicLayout from "@/components/PublicLayout";
import { Code2, Key, Zap, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const endpoints = [
  { method: "POST", path: "/v1/remove-bg", description: "Remove background from an image. Accepts multipart/form-data with an image file." },
  { method: "GET", path: "/v1/credits", description: "Check your remaining API credits and usage." },
  { method: "GET", path: "/v1/uploads", description: "List your recent processed images." },
];

const ApiDocs = () => (
  <PublicLayout>
    <section className="py-24 md:py-32">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            REST API
          </div>
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">
            API <span className="text-gradient-primary">Documentation</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Integrate background removal into your applications with our simple API.
          </p>
        </div>

        {/* Quick Start */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Quick Start</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Get your API key from the Dashboard and start making requests.
          </p>
          <pre className="bg-muted rounded-xl p-4 text-sm overflow-x-auto">
            <code className="text-foreground">{`curl -X POST https://api.bgremover.com/v1/remove-bg \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@photo.jpg"`}</code>
          </pre>
        </div>

        {/* Endpoints */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Endpoints</h2>
          </div>
          <div className="space-y-4">
            {endpoints.map((ep) => (
              <div key={ep.path} className="flex items-start gap-4 p-4 rounded-xl bg-muted">
                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {ep.method}
                </span>
                <div>
                  <code className="text-sm font-semibold text-foreground">{ep.path}</code>
                  <p className="mt-1 text-sm text-muted-foreground">{ep.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileJson className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Response Format</h2>
          </div>
          <pre className="bg-muted rounded-xl p-4 text-sm overflow-x-auto">
            <code className="text-foreground">{`{
  "success": true,
  "result_url": "https://cdn.bgremover.com/results/abc123.png",
  "credits_remaining": 42
}`}</code>
          </pre>
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/register">Get Your API Key</Link>
          </Button>
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default ApiDocs;
