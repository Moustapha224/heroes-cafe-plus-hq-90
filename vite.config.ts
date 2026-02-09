import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Changing cacheDir forces Vite to rebuild its optimized deps.
  // This fixes cases where an old pre-bundled react-leaflet build (React 19-only) is still being used.
  cacheDir: "node_modules/.vite-lovable",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  optimizeDeps: {
    // Force re-optimization so we don't keep stale optimized bundles.
    force: true,
    // Avoid pre-bundling react-leaflet, which previously produced an invalid bundle for React 18.
    exclude: ["react-leaflet", "@react-leaflet/core"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent duplicate React instances
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
