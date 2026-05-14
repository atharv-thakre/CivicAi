import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        strategies: "generateSW",
        manifest: {
          name: "CivicAlert - Civic Complaint Platform",
          short_name: "CivicAlert",
          description: "Report and track civic complaints in your community",
          theme_color: "#1f2937",
          background_color: "#ffffff",
          display: "standalone",
          scope: "/",
          start_url: "/",
          orientation: "portrait-primary",
          icons: [
            {
              src: "/icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
            {
              src: "/icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,gif,jpg,jpeg}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*$/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "runtime-cache",
                expiration: {
                  maxEntries: 32,
                  maxAgeSeconds: 3600,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
          navigateFallback: "index.html",
          suppressWarnings: true,
        },
      }),
    ],
    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== "true",
    },
  };
});
