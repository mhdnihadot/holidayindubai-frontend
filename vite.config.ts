import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiOrigin = env.VITE_API_URL ? new URL(env.VITE_API_URL).origin : 'http://localhost:4000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts: ['www.holidayindubai.com', 'holidayindubai.com', 'localhost', '.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'],
      // Used when the dev server is opened through an ngrok tunnel: the API's CORS list
      // doesn't include ngrok origins, so requests go same-origin and Vite forwards them.
      proxy: {
        '/__api': {
          target: apiOrigin,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: '',
          rewrite: (p) => p.replace(/^\/__api/, ''),
          configure: (proxy) => {
            // Server-to-server call — drop the browser's ngrok Origin so CORS checks don't reject it
            proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
          },
        },
      },
    },
    preview: {
      allowedHosts: ['www.holidayindubai.com', 'holidayindubai.com', 'localhost'],
    },
  }
})
