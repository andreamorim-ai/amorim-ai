// Cloudflare Pages Function: POST /api/newsletter
// Grava o e-mail na lista da newsletter (Resend ou Brevo, ver _email.js).
import { inscrever } from './_email.js';

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  if (form.get('site')) return new Response('ok'); // campo-isca contra robôs
  const email = String(form.get('email') || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response('e-mail inválido', { status: 400 });
  const ok = await inscrever(env, email, 'site').catch(() => false);
  return new Response(ok ? 'ok' : 'erro', { status: ok ? 200 : 502 });
}
