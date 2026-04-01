import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'faker-cli',
  description: 'Agent-friendly CLI for generating fake data',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'faker-cli' }],
    ['meta', { property: 'og:description', content: 'Agent-friendly CLI for generating fake data' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'faker-cli' }],
    ['meta', { name: 'twitter:description', content: 'Agent-friendly CLI for generating fake data' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap', rel: 'stylesheet' }],
  ],
  appearance: 'dark',
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Usage', link: '/usage' },
      { text: 'Modules', link: '/modules' },
      { text: 'Releases', link: '/releases' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
      ],
      '/usage': [
        {
          text: 'Usage',
          items: [
            { text: 'Overview', link: '/usage' },
            { text: 'Schema Mode', link: '/usage#schema-mode' },
            { text: 'Output Formats', link: '/usage#output-formats' },
            { text: 'Locales & Determinism', link: '/usage#locales-determinism' },
            { text: 'All Flags', link: '/usage#all-flags' },
          ],
        },
      ],
      '/modules': [
        {
          text: 'Module Reference',
          items: [
            { text: 'Overview', link: '/modules' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zcaceres/faker-cli' },
    ],
    footer: {
      message: 'MIT Licensed. Wraps @faker-js/faker.',
      copyright: 'Built by <a href="https://zach.dev" target="_blank">zach.dev</a>',
    },
  },
})
