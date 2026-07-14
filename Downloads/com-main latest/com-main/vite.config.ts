import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode } ) => ({
  // This base path is CRITICAL for GitHub Pages deployment.
  // Replace REPO_NAME with the name of your GitHub repository.
  base: "/",

  // The server block is useful for local development.
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react()
  ].filter(Boolean),

  // This resolve.alias block is ESSENTIAL for your project to build.
  // It tells Vite that "@/" is an alias for the "src/" directory.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
