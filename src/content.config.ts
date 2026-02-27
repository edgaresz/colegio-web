import { defineCollection, z } from "astro:content";

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    mapEmbedUrl: z.string().optional(),
  }),
});

const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

const gallery = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    images: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { pages, news, gallery };
