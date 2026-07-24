import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const server = await createServer({
  root: process.cwd(),
  configFile: false,
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

await server.listen();
server.printUrls();
