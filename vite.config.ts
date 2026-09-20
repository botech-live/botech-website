import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, mkdirSync } from 'node:fs'

// Public SPA routes. Each gets a real `index.html` shell at `/<route>/index.html`
// so GitHub Pages serves them with an HTTP 200 (instead of a soft-404 via
// 404.html) — required for deep-page indexing.
const SPA_ROUTES = [
  'about',
  'services',
  'products',
  'work',
  'contact',
  'privacy',
  'terms',
  'raseed',
  'clover',
  'delete-account',
]

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        const dist = (p: string) => path.resolve(__dirname, 'dist', p)
        copyFileSync(dist('index.html'), dist('404.html'))
        for (const route of SPA_ROUTES) {
          const dir = dist(route)
          mkdirSync(dir, { recursive: true })
          copyFileSync(dist('index.html'), path.join(dir, 'index.html'))
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          ui: ['@/components/ui'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
})