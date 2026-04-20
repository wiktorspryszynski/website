import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // root domeny
  plugins: [react()],
  define: {
    __GIT_SHA__: JSON.stringify((process.env.VITE_GIT_SHA ?? 'dev').slice(0, 7)),
    __BUILD_NUMBER__: JSON.stringify(process.env.VITE_BUILD_NUMBER ?? 'local'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
})
