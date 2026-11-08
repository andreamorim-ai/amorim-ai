# amorim.ai

Site da Amorim.AI: mentoria executiva em IA, palestras e artigos de André Amorim.

- Código: Astro (site estático) + Cloudflare Pages Functions para os formulários.
- Hospedagem: Cloudflare Pages (gratuito, uso comercial permitido).
- Domínio: amorim.ai, registrado na GoDaddy.
- Formulários e newsletter: Brevo.
- LinkedIn: Typefully, acionado por GitHub Action a cada artigo novo.

## Como publicar um artigo

1. Copie `src/content/artigos/_modelo-novo-artigo.md` com um nome novo, sem acento e com hífens. Exemplo: `ia-na-pauta-do-conselho.md`.
2. Preencha título, resumo, data e o texto. Se quiser um texto próprio para o LinkedIn, preencha `post_linkedin`.
3. Troque `rascunho: true` por `rascunho: false` e envie ao GitHub.
4. Em cerca de dois minutos o artigo está no ar em `amorim.ai/artigos/<nome-do-arquivo>` e o post aparece no Typefully. Por padrão ele entra como rascunho para você revisar e publicar. Para publicar direto, crie no GitHub a variável `TYPEFULLY_PUBLISH_AT` com `next-free-slot` (próximo horário da fila) ou `now`.

Também dá para pedir ao Claude: "publica este artigo no site". Ele cria o arquivo e envia.

## Colocar no ar (uma vez)

### 1. GitHub
1. Crie uma conta em github.com, se ainda não tiver.
2. Crie um repositório privado chamado `amorim-ai` e envie esta pasta para ele.
3. Em Settings > Secrets and variables > Actions, crie os segredos:
   - `TYPEFULLY_API_KEY`: chave gerada no Typefully em Settings > API.
   - `TYPEFULLY_SOCIAL_SET`: `357141` (LinkedIn pessoal).
   - `TYPEFULLY_SOCIAL_SET_EMPRESA`: id do conjunto da página Mentoria Amorim.AI, depois de conectada.

### 2. Brevo (formulários e newsletter)
1. Crie uma conta gratuita em brevo.com.
2. Em Contatos > Listas, crie a lista "Newsletter Amorim.AI" e anote o número dela.
3. Em Remetentes e domínios, autentique o domínio amorim.ai (a Brevo mostra os registros DNS para incluir).
4. Em SMTP e API > Chaves de API, gere uma chave.

### 3. Cloudflare Pages
1. Crie uma conta gratuita em cloudflare.com.
2. Workers & Pages > Criar > Pages > Conectar ao Git > escolha o repositório `amorim-ai`.
3. Configuração do build: framework Astro, comando `npm run build`, pasta de saída `dist`.
4. Em Settings > Environment variables (produção), crie:
   - `BREVO_API_KEY` (como segredo)
   - `BREVO_LIST_ID`
   - `EMAIL_DESTINO` = `andre@amorim.ai`
   - `EMAIL_REMETENTE` = `site@amorim.ai`
5. O site fica disponível num endereço `*.pages.dev` para conferir antes de virar amorim.ai.

### 4. Domínio amorim.ai (GoDaddy → Cloudflare)
Atenção: o e-mail andre@amorim.ai (Titan) depende dos registros MX do domínio. Eles precisam ser copiados antes de trocar qualquer coisa.

1. Na Cloudflare, Adicionar site > `amorim.ai` > plano Free. Ela importa os registros DNS atuais.
2. Confira se os registros MX e TXT do Titan (e-mail) foram importados. Compare com o painel DNS da GoDaddy. Se faltar algum, crie igual.
3. Na GoDaddy, em Domínios > amorim.ai > DNS > Servidores de nomes, troque para os dois servidores que a Cloudflare indicar.
4. Quando a Cloudflare marcar o domínio como ativo (minutos a algumas horas), vá ao projeto Pages > Domínios personalizados e adicione `amorim.ai` e `www.amorim.ai`.
5. Para `mentoria.amorim.ai`, crie uma Regra de redirecionamento para `https://amorim.ai/#mentoria`.
6. Envie um e-mail de teste para andre@amorim.ai e confirme que chegou.

O domínio continua registrado e renovado na GoDaddy. Só o DNS passa a ser gerenciado pela Cloudflare.
