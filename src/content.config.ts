import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articoli = defineCollection({
  loader: glob({ base: './content/articoli', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    type: z.enum(['recensione', 'guida', 'storia']),
    brewery: z.string().optional(),
    style: z.string().optional(),
    // Put images under public/images; paths are absolute from the site root.
    cover: z.string().startsWith('/images/').optional(),
    coverAlt: z.string().min(1).optional(),
    draft: z.boolean().default(false),
  }).refine((data) => !data.cover || !!data.coverAlt, {
    message: 'Quando usi cover, aggiungi anche coverAlt.',
  }),
});

export const collections = { articoli };
