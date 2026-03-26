import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // <--- EZ A KULCS WINDOWSHOZ!
    },
    host: true, // Hogy kintről is elérhető legyen
    strictPort: true,
    port: 5173, 
  }
})