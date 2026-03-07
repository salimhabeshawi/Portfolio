import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    technologies: z.array(
      z.object({
        label: z.string(),
        key: z.string().optional()
      })
    ),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string().url()
      })
    ),
    order: z.number().int().nonnegative()
  })
});

export const collections = { projects };
