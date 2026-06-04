import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'fs'
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
          const legacyUrls = ['/legacy/v1', '/legacy/v1/']
          if (legacyUrls.includes(url)) {
            const file = resolve(process.cwd(), 'public/legacy/v1/index.html')
            if (existsSync(file)) {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end(readFileSync(file))
              return
            }
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
