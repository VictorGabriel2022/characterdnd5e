import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    
    tailwindcss(),],
  base:'https://victorgabriel2022.github.io/characterdnd5e'
})
