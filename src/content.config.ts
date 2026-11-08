import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada artigo é um arquivo .md em src/content/artigos.
// Para publicar: criar o arquivo, salvar e enviar ao GitHub. O site atualiza sozinho
// e a automação cria o post no LinkedIn.
const artigos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    data: z.coerce.date(),
    tipo: z.enum(['Artigo', 'Post']).default('Artigo'),
    // Link do post ou artigo no LinkedIn, quando já existe lá.
    linkedin: z.string().url().optional(),
    // Texto do post que a automação publica no LinkedIn. Se vazio, usa o resumo.
    post_linkedin: z.string().optional(),
    // true = não aparece no site nem dispara a automação.
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { artigos };
