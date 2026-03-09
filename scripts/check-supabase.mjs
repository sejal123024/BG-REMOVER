import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

let url = process.env.VITE_SUPABASE_URL;
let anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Fallback: read from .env if env vars are not set
if (!url || !anon) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const envPath = resolve(__dirname, "..", ".env").replace(/scripts[\\/]\\.\\./, "");
    const raw = readFileSync(resolve(__dirname, "../.env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^(VITE_SUPABASE_URL|VITE_SUPABASE_PUBLISHABLE_KEY)\s*=\s*\"?(.+?)\"?$/);
      if (m) {
        if (m[1] === "VITE_SUPABASE_URL") url = m[2];
        if (m[1] === "VITE_SUPABASE_PUBLISHABLE_KEY") anon = m[2];
      }
    }
  } catch {
    // ignore, will error out below
  }
}

if (!url || !anon) {
  console.log("REACHABLE: no");
  console.log("EXCEPTION: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, anon);

try {
  const res = await supabase.from("profiles").select("id", { head: true, count: "exact" });
  if (res.error) {
    console.log("REACHABLE: yes");
    console.log("QUERY_ERROR:", res.error.message);
  } else {
    console.log("REACHABLE: yes");
    console.log("QUERY_OK: head count available");
  }
} catch (e) {
  console.log("REACHABLE: no");
  console.log("EXCEPTION:", e?.message ?? String(e));
  process.exit(1);
}
