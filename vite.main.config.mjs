import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  // Electron main-process build.
  // In packaged builds, the main entry is inside app.asar and we must ensure
  // runtime dependencies are resolvable. The safest approach is to bundle
  // dependencies into the output instead of relying on node_modules resolution.
  build: {
    // Electron Forge plugin-vite expects an SSR-style build for main/preload.
    ssr: true,
    rollupOptions: {
      external: ["electron"],
    },
  },
  ssr: {
    // Force-bundle dependencies (simple-git, groq-sdk, ignore, etc.).
    noExternal: true,
    external: ["electron"],
  },
});
