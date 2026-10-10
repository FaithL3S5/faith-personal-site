import { basename } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vitest/config";

// next/image expects StaticImageData, Vite would hand back a plain URL string.
const staticImageData: Plugin = {
  name: "static-image-data",
  enforce: "pre",
  load(id) {
    if (!/\.(png|jpe?g|webp)$/.test(id)) return null;
    return `export default { src: "/${basename(id)}", width: 100, height: 100 };`;
  },
};

export default defineConfig({
  plugins: [staticImageData, react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["test/setup.ts"],
    restoreMocks: true,
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/app/**/*.{png,ico,txt,webmanifest}"],
    },
  },
});
