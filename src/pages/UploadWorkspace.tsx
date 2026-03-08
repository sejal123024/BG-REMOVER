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

  const handleProcess = () => {
    setState("uploading");
    setTimeout(() => setState("processing"), 1000);
    setTimeout(async () => {
      const processedUrl = preview; // placeholder — real API will return processed URL
      setResultUrl(processedUrl);
      setState("done");

      // Save to database with data URL so it persists
      if (file) {
        const dataUrl = await fileToDataUrl(file);
        await saveUploadRecord(file.name, file.size, dataUrl, dataUrl);
        toast({ title: "Processing complete", description: "Image saved to your uploads." });
      }
    }, 3000);
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
                        src={preview!}
                        alt="Processed"
                        className="max-h-full max-w-full object-contain"
                        style={{ filter: "hue-rotate(10deg)" }}
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
