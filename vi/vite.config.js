import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* Absolute base: routes are real paths (/about), so relative asset URLs
     would resolve against the route segment and break. */
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    /* three.js (~134 KB gzip) is lazy-loaded, never on the critical path. */
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        /* Keep the framework in its own long-lived chunk so app edits do not
           invalidate it in visitors' caches. */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            /* three.js is only ever loaded on demand, in its own chunk. */
            if (id.includes('/three/')) return 'three';
            if (id.includes('react-router') || id.includes('@remix-run')) return 'router';
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react';
          }
        }
      }
    }
  },
  server: { port: 5174, open: false }
});
