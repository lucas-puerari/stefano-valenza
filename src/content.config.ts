import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ base: './content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    type: z.enum(['review', 'guide', 'story']),
    brewery: z.string().optional(),
    style: z.string().optional(),
    // Put images under public/images; paths are absolute from the site root.
    cover: z.string().startsWith('/images/').optional(),
    coverAlt: z.string().min(1).optional(),
    draft: z.boolean().default(false),
  }).refine((data) => !data.cover || !!data.coverAlt, {
    message: 'A cover image also requires coverAlt.'
  }),
});

const homePage = defineCollection({
  loader: glob({ base: './content/pages', pattern: 'home.md' }),
  schema: z.object({
    eyebrow: z.string().min(1),
    titleFirstLine: z.string().min(1),
    titleSecondLine: z.string().min(1),
    titleEmphasis: z.string().min(1),
    featuredLabel: z.string().min(1),
    articlesEyebrow: z.string().min(1),
    articlesTitle: z.string().min(1),
    articlesIntro: z.string().min(1),
    articleCountLabel: z.string().min(1),
    articleCountSingularLabel: z.string().min(1),
    emptyArticles: z.string().min(1),
  }),
});

const aboutPage = defineCollection({
  loader: glob({ base: './content/pages', pattern: 'about.md' }),
  schema: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    portrait: z.string().startsWith('/images/').optional(),
    portraitAlt: z.string().min(1).optional(),
  }).refine((data) => !data.portrait || !!data.portraitAlt, {
    message: 'A portrait image also requires portraitAlt.',
  }),
});

const collaborationsPage = defineCollection({
  loader: glob({ base: './content/pages', pattern: 'collaborations.md' }),
  schema: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    contactEmail: z.email().optional(),
    contactLabel: z.string().min(1).optional(),
  }).refine((data) => !!data.contactEmail === !!data.contactLabel, {
    message: 'contactEmail and contactLabel must be provided together.',
  }),
});

const siteSettings = defineCollection({
  loader: glob({ base: './content/pages', pattern: 'site.md' }),
  schema: z.object({
    name: z.string().min(1),
    homePageTitle: z.string().min(1),
    tagline: z.string().min(1),
    prototype: z.boolean().default(true),
    description: z.string().min(1),
    brandMark: z.string().min(1),
    brandFirstLine: z.string().min(1),
    brandSecondLine: z.string().min(1),
    navigationLabel: z.string().min(1),
    mobileMenuLabel: z.string().min(1),
    homeLabel: z.string().min(1),
    navArticles: z.string().min(1),
    navAbout: z.string().min(1),
    navCollaborations: z.string().min(1),
    skipLinkLabel: z.string().min(1),
    footerMessage: z.string().min(1),
    vatDisplay: z.string().min(1),
    reviewLabel: z.string().min(1),
    guideLabel: z.string().min(1),
    storyLabel: z.string().min(1),
    draftLabel: z.string().min(1),
    readArticleLabel: z.string().min(1),
    allArticlesLabel: z.string().min(1),
    backToArticlesLabel: z.string().min(1),
    relatedArticlesLabel: z.string().min(1),
    breweryLabel: z.string().min(1),
    styleLabel: z.string().min(1),
  }),
});

export const collections = { articles, homePage, aboutPage, collaborationsPage, siteSettings };
