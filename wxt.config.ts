import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Tief",
    description:
      "Thief website sections and get the code for your own website.",
    version: "0.0.1",
    permissions: ["activeTab"],
  },
  vite: () => ({
    plugins: [react()],
  }),
  outDir: "dist",
});
