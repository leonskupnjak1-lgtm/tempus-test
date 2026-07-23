import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    entry: 'src/main.jsx',
    dirStyle: 'flat',
    formatting: 'none',
    // Helmet-managed tags (canonical, JSON-LD) get injected right after
    // <head>, ahead of the static charset meta — pushing it well past the
    // spec-recommended first-1024-bytes. Move it back to the very front.
    onPageRendered: (_route, html) => {
      const charsetTag = '<meta charset="UTF-8" />';
      return html
        .replace(charsetTag, '')
        .replace('<head>', `<head>${charsetTag}`);
    },
  },
})
