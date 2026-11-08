// Cloudflare Pages Function: POST /api/contato
// Envia o contato por e-mail para andre@amorim.ai pela Brevo e, se a pessoa marcou,
// inscreve na newsletter.
// Variáveis: BREVO_API_KEY, BREVO_LIST_ID, EMAIL_DESTINO (andre@amorim.ai), EMAIL_REMETENTE (ex.: site@amorim.ai)
import { inscrever } from './newsletter.js';

const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function onRequestPost({ request, env }) {
  const f = await request.formData();
  if (f.get('site')) return new Response('ok');
  const d = Object.fromEntries(['nome', 'cargo', 'email', 'whatsapp', 'assunto', 'mensagem', 'newsletter'].map((k) => [k, String(f.get(k) || '').trim()]));
  if (!d.nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return new Response('dados inválidos', { status: 400 });

  const html = `<h2>Novo contato pelo site amorim.ai</h2>
<p><b>Nome:</b> ${esc(d.nome)}<br><b>Cargo e empresa:</b> ${esc(d.cargo)}<br><b>E-mail:</b> ${esc(d.email)}<br>
<b>WhatsApp:</b> ${esc(d.whatsapp)}<br><b>Interesse:</b> ${esc(d.assunto)}<br><b>Newsletter:</b> ${d.newsletter ? 'sim' : 'não'}</p>
<p><b>Mensagem:</b><br>${esc(d.mensagem).replace(/\n/g, '<br>')}</p>`;

  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Site amorim.ai', email: env.EMAIL_REMETENTE },
      to: [{ email: env.EMAIL_DESTINO, name: 'André Amorim' }],
      replyTo: { email: d.email, name: d.nome },
      subject: `Contato pelo site: ${d.nome} (${d.assunto})`,
      htmlContent: html,
    }),
  });
  if (d.newsletter) await inscrever(env, d.email, 'contato', d.nome).catch(() => {});
  return new Response(r.ok ? 'ok' : 'erro', { status: r.ok ? 200 : 502 });
}
