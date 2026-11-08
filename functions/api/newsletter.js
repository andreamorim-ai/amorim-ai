// Cloudflare Pages Function: POST /api/newsletter
// Grava o e-mail na lista da newsletter na Brevo.
// Variáveis no painel da Cloudflare (Settings > Environment variables):
//   BREVO_API_KEY  · chave de API da Brevo (secreta)
//   BREVO_LIST_ID  · número da lista "Newsletter Amorim.AI"

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  if (form.get('site')) return new Response('ok'); // campo-isca contra robôs
  const email = String(form.get('email') || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response('e-mail inválido', { status: 400 });
  const ok = await inscrever(env, email, 'site');
  return new Response(ok ? 'ok' : 'erro', { status: ok ? 200 : 502 });
}

export async function inscrever(env, email, origem, nome) {
  const r = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email,
      listIds: [Number(env.BREVO_LIST_ID)],
      updateEnabled: true,
      attributes: { ...(nome ? { FIRSTNAME: nome } : {}), ORIGEM: origem },
    }),
  });
  return r.ok || r.status === 204;
}
