import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En producción (GitHub Pages) la app se sirve en /nombre-repo/
// VITE_BASE lo define el workflow; en local queda '/'
const base = process.env.VITE_BASE ? `/${process.env.VITE_BASE}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
