// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://canaan-thirdspace-demo.web.app',
  integrations: [sitemap()],
  redirects: {
    '/old-age-home.html': '/about'
  }
});