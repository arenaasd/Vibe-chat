import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chat-app-backend-roan-three.vercel.app',  // Your backend URL
        changeOrigin: true,  // Ensures the Host header matches the backend
        secure: true,  // Use this if your backend uses HTTPS (recommended)
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional: rewrite '/api' prefix if needed
      },
    },
  },
});
