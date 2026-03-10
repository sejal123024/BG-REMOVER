import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, Download, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

type ProcessingState = "idle" | "uploading" | "processing" | "done";

const UploadWorkspace = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [state, setState] = useState<ProcessingState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const WEBHOOK_URL =
    ((import.meta.env.VITE_BG_REMOVE_WEBHOOK_URL as string) || "").trim() ||
    "https://sejalkumavat.app.n8n.cloud/webhook/bg-remover";
  
  // Force binary mode for n8n webhook compatibility
  const SEND_MODE = "binary";

  const handleFile = useCallback((f: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(f.type)) return;
    if (f.size > 10 * 1024 * 1024) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setState("idle");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const saveUploadRecord = async (fileName: string, fileSize: number, originalDataUrl: string, resultDataUrl: string | null) => {
    if (!user) return;
    const { error } = await supabase.from("uploads").insert({
      user_id: user.id,
      file_name: fileName,
      file_size: fileSize,
      original_url: originalDataUrl,
      result_url: resultDataUrl,
      status: "done",
    });
    if (error) {
      console.error("Failed to save upload record:", error);
    }
  };

  const fileToDataUrl = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  };

  const blobToDataUrl = (b: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(b);
    });

  const createDemoResult = async (f: File): Promise<{ blob: Blob }> => {
      // Create a simple demo effect by adding a transparent background
      // This is just a simulation - in a real app you'd use a proper background removal library
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Draw the image
            ctx.drawImage(img, 0, 0);
            
            // Get image data and create a simple transparency effect
            // This is a very basic simulation - real background removal is much more complex
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Simple edge detection and transparency simulation
            for (let i = 0; i < data.length; i += 4) {
              // Make pixels at the edges more transparent (very basic demo)
              const x = (i / 4) % canvas.width;
              const y = Math.floor((i / 4) / canvas.width);
              const edgeDistance = Math.min(x, y, canvas.width - x - 1, canvas.height - y - 1);
              
              if (edgeDistance < 20) {
                data[i + 3] = Math.floor(data[i + 3] * (edgeDistance / 20)); // Fade edges
              }
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({ blob });
            } else {
              // Fallback: return original file as blob
              f.arrayBuffer().then(buffer => {
                const fallbackBlob = new Blob([buffer], { type: f.type });
                resolve({ blob: fallbackBlob });
              });
            }
          }, 'image/png');
        };
        
        img.src = URL.createObjectURL(f);
      });
    };

    const sendToWebhook = async (f: File): Promise<{ blob?: Blob; url?: string }> => {
    const sanitizeUrl = (raw: unknown): string | null => {
      if (typeof raw !== "string") return null;
      const s = raw.trim().replace(/^`+|`+$/g, "").replace(/^"+|"+$/g, "");
      try {
        // Basic URL validity check
        const u = new URL(s);
        return u.href;
      } catch {
        return s || null;
      }
    };
    // Strategy: prefer multipart in browser to avoid CORS preflight; binary as fallback or if forced
    const tryForm = async () => {
      const fd = new FormData();
      fd.append("file", f, f.name);
      try {
        const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        const ct = res.headers.get("content-type") || "";
        console.log(`Form response content-type: ${ct}`);
        
        // Clone the response to avoid stream being read multiple times
        const responseClone = res.clone();
        
        if (ct.startsWith("image/")) {
          const blob = await res.blob();
          console.log(`Form received image blob, size: ${blob.size} bytes`);
          return { blob };
        }
        if (ct.includes("application/json")) {
          const j = await res.json().catch(() => ({})) as Partial<{
            url?: string;
            result_url?: string;
            image_url?: string;
            myField?: string;
            secure_url?: string;
            error?: string;
            message?: string;
          }>;
          console.log(`Form received JSON response:`, j);
          
          // Check for error in response
          if (j.error || j.message) {
            throw new Error(`Form webhook error: ${j.error || j.message}`);
          }
          
          const u =
            sanitizeUrl(j?.result_url) ||
            sanitizeUrl(j?.url) ||
            sanitizeUrl(j?.image_url) ||
            sanitizeUrl(j?.myField) ||
            sanitizeUrl(j?.secure_url);
          if (u) return { url: u };
        }
        if (ct.startsWith("text/")) {
          const t = await res.text();
          console.log(`Form received text response: ${t}`);
          const u = sanitizeUrl(t);
          if (u) return { url: u };
        }
        
        // For unknown content types, try to get as blob from the cloned response
        try {
          const blob = await responseClone.blob();
          if (blob.size > 0) {
            console.log(`Form received unknown blob, size: ${blob.size} bytes, type: ${blob.type}`);
            return { blob };
          }
        } catch (blobError) {
          console.error(`Form failed to get response as blob:`, blobError);
        }
        
        throw new Error(`Form unsupported response type: ${ct}`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Form request failed: ${error.message}`);
        }
        throw new Error("Form request failed with unknown error");
      }
    };
    const tryBinary = async () => {
      try {
        // Create headers for n8n webhook compatibility
        const headers = new Headers();
        headers.append('Accept', 'application/json, image/*, */*');
        
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: headers,
          // Let browser set Content-Type automatically for binary data
          body: f,
        });
        
        console.log(`Webhook response status: ${res.status} ${res.statusText}`);
        console.log(`Response headers:`, Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Webhook error response: ${errorText}`);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        
        const ct = res.headers.get("content-type") || "";
        console.log(`Response content-type: ${ct}`);
        
        // Clone the response to avoid stream being read multiple times
        const responseClone = res.clone();
        
        if (ct.startsWith("image/")) {
          const blob = await res.blob();
          console.log(`Received image blob, size: ${blob.size} bytes`);
          return { blob };
        }
        
        if (ct.includes("application/json")) {
          const j = await res.json().catch(() => ({})) as Partial<{
            url?: string;
            result_url?: string;
            image_url?: string;
            myField?: string;
            secure_url?: string;
            error?: string;
            message?: string;
          }>;
          
          console.log(`Received JSON response:`, j);
          
          // Check for error in response
          if (j.error || j.message) {
            throw new Error(`Webhook error: ${j.error || j.message}`);
          }
          
          const u =
            sanitizeUrl(j?.result_url) ||
            sanitizeUrl(j?.url) ||
            sanitizeUrl(j?.image_url) ||
            sanitizeUrl(j?.myField) ||
            sanitizeUrl(j?.secure_url);
          if (u) return { url: u };
        }
        
        if (ct.startsWith("text/")) {
          const t = await res.text();
          console.log(`Received text response: ${t}`);
          const u = sanitizeUrl(t);
          if (u) return { url: u };
        }
        
        // For unknown content types, try to get as blob from the cloned response
        try {
          const blob = await responseClone.blob();
          if (blob.size > 0) {
            console.log(`Received unknown blob, size: ${blob.size} bytes, type: ${blob.type}`);
            return { blob };
          }
        } catch (blobError) {
          console.error(`Failed to get response as blob:`, blobError);
        }
        
        throw new Error(`Unsupported response type: ${ct}`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Binary request failed: ${error.message}`);
        }
        throw new Error("Binary request failed with unknown error");
      }
    };
    // Force binary mode for n8n webhook compatibility
    try {
      console.log(`Attempting binary request to: ${WEBHOOK_URL}`);
      return await tryBinary();
    } catch (binaryError) {
      console.log("Binary request failed, trying form as fallback:", binaryError);
      try {
        console.log(`Attempting form request to: ${WEBHOOK_URL}`);
        return await tryForm();
      } catch (formError) {
        console.error("Both binary and form requests failed:", { binaryError, formError });
        throw new Error(`Webhook connection failed. Binary: ${binaryError instanceof Error ? binaryError.message : 'Unknown error'}. Form: ${formError instanceof Error ? formError.message : 'Unknown error'}`);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setState("uploading");
    setTimeout(() => setState("processing"), 300);
    try {
      const result = await sendToWebhook(file);
      let outUrl: string | null = null;
      if (result.blob) {
        outUrl = URL.createObjectURL(result.blob);
      } else if (result.url) {
        outUrl = result.url;
      } else {
        outUrl = preview;
      }
      setResultUrl(outUrl);
      setState("done");

      // Persist record
      const originalDataUrl = await fileToDataUrl(file);
      const resDataUrl =
        result.blob ? await blobToDataUrl(result.blob) : outUrl || originalDataUrl;
      await saveUploadRecord(file.name, file.size, originalDataUrl, resDataUrl);
      toast({ title: "Processing complete", description: "Image processed and saved." });
    } catch (e: unknown) {
      console.error("Webhook error:", e);
      console.error("Error details:", {
        message: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : 'No stack trace',
        name: e instanceof Error ? e.name : 'Unknown',
        webhookUrl: WEBHOOK_URL,
        fileName: file.name,
        fileSize: file.size
      });
      
      // Try demo fallback when webhook fails
      try {
        console.log("Attempting demo fallback...");
        const demoResult = await createDemoResult(file);
        const demoUrl = URL.createObjectURL(demoResult.blob);
        setResultUrl(demoUrl);
        setState("done");
        
        // Persist demo record
        const originalDataUrl = await fileToDataUrl(file);
        const demoDataUrl = await blobToDataUrl(demoResult.blob);
        await saveUploadRecord(file.name, file.size, originalDataUrl, demoDataUrl);
        
        toast({ 
          title: "Demo mode activated", 
          description: "Webhook unavailable - showing demo background removal effect." 
        });
      } catch (demoError) {
        console.error("Demo fallback also failed:", demoError);
        setState("idle");
        toast({
          title: "Processing failed",
          description:
            "Could not reach the background-removal service. Ensure the webhook is active (n8n test mode requires 'Execute workflow' before calling).",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = async () => {
    const url = resultUrl || preview;
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const baseName = file?.name?.replace(/\.[^.]+$/, "") || "image";
      a.download = `${baseName}-no-bg.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setState("idle");
  };

  return (
    <PublicLayout>
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Remove Background
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload an image (JPG, PNG, WEBP — max 10 MB)
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label
                  className={`upload-zone flex cursor-pointer flex-col items-center justify-center gap-4 p-16 md:p-24 ${
                    dragActive ? "upload-zone-active" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      Drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or <span className="text-primary font-medium">browse files</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button onClick={reset} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl overflow-hidden bg-muted aspect-square flex items-center justify-center">
                    <img
                      src={preview!}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-muted aspect-square flex items-center justify-center"
                    style={{
                      backgroundImage: state === "done"
                        ? "none"
                        : "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--surface)) 0% 50%) 50% / 20px 20px",
                    }}
                  >
                    {state === "done" ? (
                      <img
                        src={(resultUrl || preview)!}
                        alt="Processed"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : state === "processing" || state === "uploading" ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          {state === "uploading" ? "Uploading..." : "Removing background..."}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Result will appear here</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                  {state === "idle" && (
                    <Button variant="hero" size="lg" onClick={handleProcess}>
                      Remove Background
                    </Button>
                  )}
                  {state === "done" && (
                    <>
                      <Button variant="hero" size="lg" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button variant="outline" onClick={reset}>
                        Upload New
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PublicLayout>
  );
};

export default UploadWorkspace;
