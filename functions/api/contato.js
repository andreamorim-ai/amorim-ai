// Cloudflare Pages Function: POST /api/contato
// Envia o contato por e-mail para EMAIL_DESTINO e, se a pessoa marcou, inscreve na newsletter.
import { enviarEmail, inscrever } from './_email.js';

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

  const ok = await enviarEmail(env, { assunto: `Contato pelo site: ${d.nome} (${d.assunto})`, html, responderPara: d.email }).catch(() => false);
  if (d.newsletter) await inscrever(env, d.email, 'contato', d.nome).catch(() => {});
  return new Response(ok ? 'ok' : 'erro', { status: ok ? 200 : 502 });
}
