import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// On Pages the default address is owner.github.io/repo/ (or owner.github.io/).
// SITE_URL can override it, for example when using a custom domain.
const repository = process.env.GITHUB_REPOSITORY;
const defaultUrl = repository
  ? (() => {
      const [owner, name] = repository.split('/');
      const path = name.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '' : `/${name}`;
      return `https://${owner.toLowerCase()}.github.io${path}/`;
    })()
  : 'http://localhost:4321/';
const site = new URL(process.env.SITE_URL || defaultUrl);

export default defineConfig({
  site: site.href,
  base: site.pathname,
  vite: { plugins: [tailwindcss()] },
});
