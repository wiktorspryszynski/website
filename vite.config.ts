import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync, statSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'serve-legacy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? '').split('?')[0]
          if (!url.startsWith('/legacy/v1')) { next(); return }
          // Let actual files (assets, etc.) be served normally
          const publicFile = resolve(process.cwd(), 'public', url.slice(1))
          if (existsSync(publicFile) && statSync(publicFile).isFile()) { next(); return }
          // Everything else under /legacy/v1 → legacy SPA index
          const indexFile = resolve(process.cwd(), 'public/legacy/v1/index.html')
          if (existsSync(indexFile)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(readFileSync(indexFile))
            return
          }
          next()
        })
      },
    },
  ],
  define: {
    __GIT_SHA__: JSON.stringify((process.env.VITE_GIT_SHA ?? 'dev').slice(0, 7)),
    __BUILD_NUMBER__: JSON.stringify(process.env.VITE_BUILD_NUMBER ?? 'local'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
})
