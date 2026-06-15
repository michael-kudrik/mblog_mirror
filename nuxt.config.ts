import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: 'blog.mikekudrik.boats'
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png'
        },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/sitemap'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'houston',
        }
      }
    }
  },
  devtools: { enabled: true },
  css: ['./app/assets/main.css'],
  vite: {
    optimizeDeps: {
      include: []
    },
    plugins: [tailwindcss()]
  },
  compatibilityDate: '2024-04-03'
})