import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      port: Number(env.PORT) || 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },

    preview: {
      // eslint-disable-next-line no-undef
      port: Number(process.env.PORT) || Number(env.PORT) || 3000,
      host: "0.0.0.0",
      strictPort: true,
      cors: true,

      allowedHosts: ["frontend-service-production-3662.up.railway.app"],
    },

    build: {
      outDir: "dist",
    },

    publicDir: "public",
  };
});
