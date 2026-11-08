// Provedor de e-mail do site. Usa o Resend se RESEND_API_KEY existir; senão, a Brevo.
// Variáveis no Cloudflare (Settings > Variables and Secrets):
//   Resend: RESEND_API_KEY (Secret), EMAIL_DESTINO, EMAIL_REMETENTE (ex.: "Site amorim.ai <site@amorim.ai>")
//   Brevo:  BREVO_API_KEY (Secret), BREVO_LIST_ID, EMAIL_DESTINO, EMAIL_REMETENTE

export async function enviarEmail(env, { assunto, html, responderPara }) {
  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Até o domínio ser verificado no Resend, use onboarding@resend.dev como remetente.
        from: env.EMAIL_REMETENTE || 'Site amorim.ai <onboarding@resend.dev>',
        to: [env.EMAIL_DESTINO],
        reply_to: responderPara,
        subject: assunto,
        html,
      }),
    });
    return r.ok;
  }
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Site amorim.ai', email: env.EMAIL_REMETENTE },
      to: [{ email: env.EMAIL_DESTINO, name: 'André Amorim' }],
      replyTo: { email: responderPara },
      subject: assunto,
      htmlContent: html,
    }),
  });
  return r.ok;
}

export async function inscrever(env, email, origem, nome) {
  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name: nome || undefined, unsubscribed: false }),
    });
    return r.ok || r.status === 409; // 409 = contato já existe
  }
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
