// vite.config.js
// Vite is the build tool — faster than Create React App
// This config adds the React plugin so JSX works
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend runs on this port during development
  },
});
