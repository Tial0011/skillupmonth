import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { host: true },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap", "gsap/ScrollTrigger"]
        }
      }
    }
  }
});