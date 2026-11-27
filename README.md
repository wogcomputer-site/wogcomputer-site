# WOG COMPUTER — Pacote de homologação V5.0.0
## Base institucional V3.0.0 + loja em desenvolvimento

**Site oficial:** https://wogcomputer.com.br/  
**Empresa:** WOG COMPUTER — Comércio e Serviços de Informática  
**Base funcional:** versão 2.3.5 fornecida pelo responsável pelo projeto  
**Arquitetura:** HTML5, CSS3 e JavaScript estático  
**Publicação:** GitHub / Cloudflare Pages, conforme configuração de hospedagem existente  

## Base institucional preservada (V3.0.0)

A versão 3.0.0 parte do pacote 2.3.5 e preserva sua estrutura comercial e funcional. O escopo desta atualização é aplicar as imagens otimizadas entregues, remover um arquivo placeholder sem uso e melhorar a priorização de carregamento sem reconstruir a página nem trocar a arquitetura.

## Funcionalidades preservadas

- Página institucional e nove soluções comerciais.
- Navegação responsiva e menu móvel.
- Formulário de orçamento que prepara a mensagem e abre o WhatsApp para revisão e envio pelo visitante.
- Links de WhatsApp, Instagram, Facebook e LinkedIn.
- Eventos GA4 implementados no projeto, incluindo cliques sociais, interesse em serviços, CTA de orçamento e `generate_lead`.
- Metadados SEO, canonical, Open Graph, Twitter Cards e JSON-LD.
- `robots.txt`, `sitemap.xml` e domínio customizado em `CNAME`.

## Google Analytics 4 e Google Search Console

O código de origem contém a instalação direta do GA4 com o ID `G-Y3W56JDHZ1`. Ela foi mantida sem adicionar um segundo snippet de Google Tag Manager, pois o pacote não contém a instalação do contêiner `GTM-5R5QJV8Z` mencionada em documentação anterior. Os eventos são enviados quando o código consegue acessar `gtag`; isso não comprova, por si só, a recepção na propriedade.

A configuração de propriedade, verificação DNS/HTML, sitemap enviado, indexação, eventos principais e dimensões personalizadas do GA4 são mantidos na conta externa do Google e não podem ser verificados nem alterados por este pacote. Validar após publicação no GA4 DebugView/Tempo real e no Search Console.

## Imagens e organização de `assets/`

Os seis arquivos do pacote de imagens substituíram os arquivos com o mesmo nome, preservando os caminhos usados pelo HTML. Os arquivos `instagram.webp`, `facebook.webp`, `linkedin.webp` e `favicon.svg` foram mantidos porque continuam referenciados. O arquivo `placeholder.txt` foi removido porque não possui referência no HTML, CSS ou JavaScript.

| Arquivo | Dimensão | Tamanho final aproximado |
|---|---:|---:|
| `logo-wogcomputer.webp` | 640 × 640 | 67,6 KB |
| `loja-wogcomputer.webp` | 720 × 720 | 71,3 KB |
| `loja-interior.webp` | 720 × 720 | 74,6 KB |
| `loja-moderna.webp` | 720 × 720 | 76,7 KB |
| `bancada-assistencia.webp` | 1000 × 563 | 74,4 KB |
| `og-wogcomputer.jpg` | 1200 × 630 | 185,7 KB |

A logo WebP fornecida possui canal alfa (transparência). Os nomes dos arquivos foram preservados para não quebrar referências existentes.

## Melhorias de desempenho aplicadas

- Preload da imagem principal da seção hero.
- `fetchpriority="high"` na imagem LCP, sem `loading="lazy"`.
- `loading="lazy"` e `decoding="async"` nas imagens abaixo da primeira dobra.
- Atributos explícitos de largura e altura nas imagens principais para ajudar a reservar espaço e reduzir mudanças de layout.
- Remoção do `@import` do Google Fonts e uso de fontes do sistema para evitar dependência externa de fontes no caminho crítico de renderização.
- Atualização do cache-busting de CSS e JavaScript para `3.0.0`.
- `CNAME` incluído para `wogcomputer.com.br`, conforme a configuração de domínio exibida no repositório.

A troca de fontes externas por fontes do sistema pode produzir pequenas diferenças tipográficas entre navegadores, mantendo hierarquia, pesos e identidade visual geral.

## O que não foi alterado

- ID do GA4 e lógica dos eventos.
- Campos e fluxo do formulário.
- Número de WhatsApp, e-mail, endereço e conteúdo comercial.
- Estrutura HTML das seções e regras responsivas existentes, exceto atributos de carregamento das imagens.
- `robots.txt`, `sitemap.xml` e metadados SEO já existentes.
- Integrações externas e credenciais, que não são armazenadas no ZIP.

## Limites e validações externas

A captura fornecida do PageSpeed mobile mostra: Desempenho 90, Acessibilidade 96, Práticas recomendadas 100 e SEO 100. A auditoria desktop exibida aponta ausência de `fetchpriority=high` na imagem LCP e uma cadeia crítica de até 2.027 ms. A pontuação desktop não está visível nas capturas recebidas.

A auditoria também mostra o script `email-decode.min.js` injetado pelo Cloudflare (aprox. 844 ms na captura), o arquivo `script.js` (aprox. 779 ms), CSS (aprox. 578 ms), fontes Google e `/cdn-cgi/rum`. O pacote removeu a dependência das fontes Google e corrigiu a prioridade da imagem LCP. Os scripts injetados e RUM são controlados no painel Cloudflare e precisam de avaliação separada.

**Não há garantia de primeira página do Google.** SEO técnico ajuda rastreamento e compreensão, mas o posicionamento depende também de concorrência, conteúdo útil, autoridade, perfil local, reputação e tempo.

## Publicação segura

1. Manter a branch/tag/ZIP da versão 2.3.5 como referência imutável.
2. Publicar esta versão primeiro em branch de homologação ou preview do Cloudflare Pages.
3. Testar desktop e celular, menu, nove soluções, seleção automática do formulário, WhatsApp, e-mail e redes sociais.
4. Confirmar no GA4 DebugView/Tempo real os eventos de teste.
5. Confirmar `https://wogcomputer.com.br/robots.txt` e `/sitemap.xml`.
6. Executar novamente PageSpeed Insights em celular e computador e comparar os resultados.
7. Só então promover o commit para produção.

Consulte `RELATORIO-TECNICO-WOG-COMPUTER-v3.0.0.md`, `RELATORIO-SEO-PERFORMANCE-v3.0.0.md` e `CHECKLIST-IMPLANTACAO-v3.0.0.md`.


## Loja V4.0.0 — catálogo demonstrativo
Consulte `DOCUMENTACAO-CATALOGO-V4.0.0.md`, `loja/catalogo-demo.json`, `database/schema-v4.0.0.sql` e `prototipos/painel-catalogo-demo.html`. Todos os produtos são indisponíveis e os preços são fictícios para homologação.

## Loja V4.0.0 — Etapa 3 (homologação)

O painel administrativo inicial está em `/admin/`. A API usa Cloudflare Pages Functions em `/api/*`, banco Cloudflare D1 e upload de imagens assinado pelo backend para o Cloudinary. Consulte `CONFIGURACAO-ETAPA3-V4.0.0.md` antes de publicar a branch de homologação. Não publique em produção nem compartilhe `.dev.vars` ou credenciais.


## V4.0.0 — Homologação
Consulte `ENTREGA-HOMOLOGACAO-V4.0.0.md` para escopo, limitações, configuração e testes obrigatórios. Este pacote ainda não está apto a receber pedidos reais.


## Escopo V4.0.0
Este repositório/pacote é uma homologação incremental. O site institucional preserva a base V3.0.0; a loja, o painel e a API estão em desenvolvimento e exigem configuração e testes antes de qualquer publicação.

- Painel administrativo em `/admin/` e API em `/api/`.
- Banco D1 ainda depende de criação e preenchimento do `database_id` no `wrangler.toml`.
- Segredos devem ser cadastrados exclusivamente no ambiente Cloudflare; nunca versionar `.dev.vars` nem compartilhar `CLOUDINARY_API_SECRET`.
- O cadastro aceita no máximo 5 imagens por produto (JPG, PNG ou WebP, até 10 MB cada).
- A vitrine ainda usa catálogo demonstrativo e não deve apresentar preços/estoques fictícios como oferta real.
- Não há checkout, carrinho, cálculo real de frete, confirmação de pagamento, pedidos ou notificações comerciais operacionais.

**Não publicar em produção nem apontar o domínio principal para esta versão sem aprovação e homologação completa.**


## REVISÃO DE SEGURANÇA — pacote de homologação
- Limite máximo de 5 imagens por produto no frontend e no backend.
- Login com bloqueio após 5 falhas em janela de 15 minutos, dependente da migração D1 `0002_admin_login_protection.sql`.
- Requisições mutáveis exigem cabeçalho Origin do mesmo domínio; logout exige sessão autenticada.
- Imagens aceitas apenas quando URL e public_id correspondem à conta Cloudinary configurada e à pasta de produtos.
- Este pacote permanece exclusivo para homologação; configure D1 e secrets antes do deploy. Não contém checkout nem processamento de pagamentos.
