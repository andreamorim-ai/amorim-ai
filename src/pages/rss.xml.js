import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const artigos = (await getCollection('artigos', (a) => !a.data.rascunho))
    .sort((x, y) => y.data.data.valueOf() - x.data.data.valueOf());
  return rss({
    title: 'André Amorim · Artigos',
    description: 'IA, estratégia e governança para executivos.',
    site: context.site,
    items: artigos.map((a) => ({
      title: a.data.titulo,
      description: a.data.resumo,
      pubDate: a.data.data,
      link: `/artigos/${a.id}/`,
    })),
    customData: '<language>pt-br</language>',
  });
}
