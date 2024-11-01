import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import manifest from './public/manifest.json'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: "CacheFirst",
          options: {
            cacheName: "images"
          }
        },
        {
          urlPattern: ({ request }) => request.destination === 'script',
          handler: "NetworkFirst",
          options: {
            cacheName: "scripts"
          }
        },
        {
          urlPattern: ({ request }) => request.destination === 'style',
          handler: "NetworkFirst",
          options: {
            cacheName: "styles"
          }
        },
        {
          urlPattern: ({ request }) => request.destination === 'document',
          handler: "NetworkFirst",
          options: {
            cacheName: "documents"
          }
        },
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/api'),
          handler: "NetworkFirst",
          options: {
            cacheName: "api-calls",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
    },
    manifest: manifest as any
  })
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production",
        rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  }
})
