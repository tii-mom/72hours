import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  const manualChunks = (id: string) => {
    if (!id.includes("node_modules")) {
      return;
    }

    if (id.includes("motion")) {
      return "motion";
    }

    if (id.includes("react-router-dom")) {
      return "router";
    }

    if (id.includes("lucide-react")) {
      return "icons";
    }

    if (
      id.includes("@radix-ui") ||
      id.includes("class-variance-authority") ||
      id.includes("clsx") ||
      id.includes("tailwind-merge")
    ) {
      return "ui-vendor";
    }
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
    },
  };
});
