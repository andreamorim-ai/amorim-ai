// Dados de contato e links, num lugar só.
export const SITE = {
  nome: 'André Amorim',
  marca: 'Amorim.AI',
  dominio: 'https://amorim.ai',
  email: 'andre@amorim.ai',
  whatsapp: '5511963985092',
  whatsappExibicao: '+55 11 96398-5092',
  linkedinPessoal: 'https://www.linkedin.com/in/andredeamorimbarbosa',
  // Trocar pela URL real da página quando André enviar.
  linkedinEmpresa: 'https://www.linkedin.com/search/results/companies/?keywords=Mentoria%20Amorim.AI',
  // Trocar pela URL da newsletter do LinkedIn quando André enviar.
  linkedinNewsletter: 'https://www.linkedin.com/in/andredeamorimbarbosa',
};

export const wa = (texto) =>
  `https://wa.me/${SITE.whatsapp}${texto ? '?text=' + encodeURIComponent(texto) : ''}`;

export const mes = (d) =>
  new Date(d).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace('.', '').replace(' de ', ' ');
