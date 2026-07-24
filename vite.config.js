import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: './node_modules/.vite',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
