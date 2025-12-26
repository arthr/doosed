import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  server: {
    allowedHosts: [],
    port: 5173,
    strictPort: true,
  },
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true, // Enable sourcemaps for production debugging
  },
  // Otimizações para desenvolvimento
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'immer'],
  },
});
