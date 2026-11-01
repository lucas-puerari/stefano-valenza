import { getCollection } from 'astro:content';

export async function getPublishedArticles() {
  // Drafts are visible while running the local dev server, never in production builds.
  const articles = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

// Astro's base is / for local development and /repo/ on project Pages.
export function assetPath(path: string, base: string) {
  return `${base.replace(/\/$/, '')}${path}`;
}
