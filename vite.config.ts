import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "build",
    },

    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],

    server: {
        host: "localhost",
        port: 3000,
        open: true,
    },
});
