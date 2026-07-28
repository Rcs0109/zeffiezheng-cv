import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'

export default defineConfig({
  base: '/zeffiezheng-cv/',
  plugins: [
    react(),
    tailwindcss(),
    // GitHub Pages SPA fallback: copy index.html as 404.html
    {
      name: 'copy-404',
      writeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
})
