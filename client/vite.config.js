import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: true,
    proxy: {
      "/chat": {
        target: "http://192.168.0.110:3000/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
