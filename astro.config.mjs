import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    inlineStylesheets: "always",
  },
  output: "static",
  site: "https://www.agenticbuilders.sg",
  server: {
    host: true,
    allowedHosts: ["yjmbpro.local"],
  },
});
