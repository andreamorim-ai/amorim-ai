import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amorim.ai',
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
