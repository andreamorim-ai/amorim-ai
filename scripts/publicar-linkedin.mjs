// Cria no Typefully o post do LinkedIn para cada artigo novo.
// Uso: node scripts/publicar-linkedin.mjs src/content/artigos/arquivo.md [outro.md ...]
// Variáveis (segredos do GitHub):
//   TYPEFULLY_API_KEY          · chave da API do Typefully
//   TYPEFULLY_SOCIAL_SET       · id do conjunto do LinkedIn pessoal (357141)
//   TYPEFULLY_SOCIAL_SET_EMPRESA · id do conjunto da página Mentoria Amorim.AI (opcional)
//   TYPEFULLY_PUBLISH_AT       · "now", "next-free-slot" ou vazio (vazio = só rascunho para revisar)
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const SITE = 'https://amorim.ai';
const { TYPEFULLY_API_KEY: KEY, TYPEFULLY_SOCIAL_SET: PESSOAL, TYPEFULLY_SOCIAL_SET_EMPRESA: EMPRESA } = process.env;
const PUBLISH_AT = process.env.TYPEFULLY_PUBLISH_AT || null;

function frontmatter(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const o = {};
  for (const linha of m[1].split('\n')) {
    const k = linha.match(/^([a-z_]+):\s*(.*)$/);
    if (k) o[k[1]] = k[2].replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
  }
  return o;
}

async function criar(socialSet, texto, titulo) {
  const r = await fetch(`https://api.typefully.com/v2/social-sets/${socialSet}/drafts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      draft_title: titulo,
      publish_at: PUBLISH_AT,
      platforms: { linkedin: { enabled: true, posts: [{ text: texto }] } },
    }),
  });
  const corpo = await r.text();
  if (!r.ok) throw new Error(`Typefully ${r.status}: ${corpo}`);
  return corpo;
}

if (!KEY || !PESSOAL) { console.error('Faltam TYPEFULLY_API_KEY e TYPEFULLY_SOCIAL_SET.'); process.exit(1); }

for (const arq of process.argv.slice(2)) {
  if (basename(arq).startsWith('_')) continue;
  const fm = frontmatter(readFileSync(arq, 'utf8'));
  if (fm.rascunho === 'true') { console.log(`Rascunho, ignorado: ${arq}`); continue; }
  const slug = basename(arq, '.md');
  const link = `${SITE}/artigos/${slug}`;
  const texto = `${fm.post_linkedin || fm.resumo}\n\nArtigo completo: ${link}`;
  console.log(`Criando post para "${fm.titulo}"`);
  await criar(PESSOAL, texto, fm.titulo);
  if (EMPRESA) await criar(EMPRESA, `${fm.titulo}\n\n${fm.resumo}\n\nLeia: ${link}`, fm.titulo);
}
