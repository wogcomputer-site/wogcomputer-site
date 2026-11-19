# WOG COMPUTER — Relatório técnico de atualização
## Versão 2.3.5 — Novembro de 2026

**Site:** https://wogcomputer.com.br/  
**Projeto:** WOG COMPUTER — Comércio e Serviços de Informática  
**Base de atualização:** pacote completo da versão 2.3.4 enviado pelo responsável pelo projeto.

---

## 1. Objetivo da versão

Atualizar o site institucional sem reconstruir a estrutura, preservando as funcionalidades anteriores, a identidade visual, os arquivos de mídia existentes, o formulário de orçamento, o atendimento via WhatsApp, os metadados SEO e a integração atual do Google Analytics 4.

A prioridade comercial desta versão é ampliar a apresentação dos serviços, facilitar a identificação da necessidade do visitante e melhorar a mensuração de interesse e geração de contatos.

## 2. Alterações implementadas

### 2.1. Aba Soluções — nove serviços

Foram mantidos os seis serviços originais e acrescentadas três novas soluções:

1. **Infraestrutura de TI** — planejamento, implantação e gestão de redes, servidores, estações de trabalho, ambientes tecnológicos e Microsoft 365 quando aplicável.
2. **Segurança da informação** — proteção de dados, dispositivos e acessos, análise de riscos e apoio à adequação à LGPD.
3. **Backup em nuvem** — backup, armazenamento, recuperação de dados e continuidade das operações.
4. **Suporte e manutenção** — suporte técnico e manutenção preventiva e corretiva.
5. **Redes e conectividade** — redes cabeadas, Wi-Fi e conectividade entre unidades.
6. **Contratos de TI** — serviços recorrentes com escopo, níveis de atendimento e acompanhamento definidos.
7. **Marketing Estratégico e Gestão de Presença Digital** — planejamento de marketing, gestão de redes sociais, criação de conteúdos, campanhas e ações para fortalecer a marca e gerar oportunidades comerciais.
8. **Sites, Domínios e Hospedagem** — criação e atualização de sites, registro e configuração de domínios, hospedagem, e-mail profissional integrado e presença digital.
9. **Internet, Link Dedicado, TV e Streaming** — opções de conectividade e serviços associados, conforme disponibilidade e cobertura.

Microsoft 365 foi incorporado ao contexto de Infraestrutura de TI e Contratos de TI, quando aplicável. A adequação à LGPD foi incorporada ao contexto de Segurança da Informação.

### 2.2. Formulário de orçamento e WhatsApp

- A lista de interesses do formulário foi atualizada para incluir as nove soluções.
- O formulário continua abrindo o WhatsApp com a mensagem preenchida para revisão e envio pelo visitante.
- Os dados pessoais digitados no formulário permanecem somente na mensagem preparada para o WhatsApp; não são enviados como parâmetros ao GA4.
- Ao clicar no CTA de uma solução, o formulário passa a selecionar automaticamente o serviço correspondente.
- O nome do serviço selecionado é incluído no assunto da mensagem preparada para o WhatsApp.

**Limite funcional:** o site abre o WhatsApp com a mensagem pronta, mas o visitante ainda precisa confirmar o envio dentro do WhatsApp. O evento de analytics registra a abertura/intenção, não comprova que a mensagem foi efetivamente enviada ou que um contrato foi fechado.

### 2.3. Redes sociais — ícones WebP

- Foram adicionados arquivos WebP leves para Instagram, Facebook e LinkedIn.
- Os três ícones são exibidos no mesmo padrão de tamanho e posicionamento do cabeçalho já existente.
- Os links abrem em nova aba e mantêm `rel="noopener noreferrer"`.
- A logo institucional WOG COMPUTER existente foi preservada sem alteração.
- O endereço LinkedIn utilizado é `https://www.linkedin.com/feed/`, exatamente o endereço fornecido para esta etapa. Esse link direciona ao feed geral do LinkedIn, não a uma página pública institucional específica da WOG COMPUTER. Quando a URL pública correta da empresa for informada, deverá ser substituída no `index.html`.

### 2.4. Google Analytics 4

Foi preservada a instalação direta do GA4 já existente, com o ID de mensuração `G-Y3W56JDHZ1`.

Eventos existentes preservados:
- `whatsapp_click`
- `service_interest_click`
- `quote_cta_click`
- `quote_form_whatsapp_open`

Novos eventos:
- `instagram_click`
- `facebook_click`
- `linkedin_click`
- `social_media_click`
- `service_quote_cta_click`
- `generate_lead`

Parâmetros relevantes:
- `social_network`: rede social clicada.
- `link_url`: destino do link social.
- `link_location`: local do link no site.
- `service_name`: solução de interesse.
- `interest`: opção escolhida no formulário.
- `form_id`: identificação do formulário.

Não são enviados ao GA4 nome, empresa ou conteúdo livre da mensagem do visitante.

**Configuração posterior no GA4:** para utilizar `social_network` e `service_name` em relatórios personalizados, cadastrar esses parâmetros como dimensões personalizadas. O evento `generate_lead` poderá ser marcado como evento principal (conversão) na interface do GA4 depois de confirmar seu recebimento.

**Google Search Console:** não é ferramenta de rastreamento de cliques em botões ou links externos do site. Ele acompanha desempenho na Pesquisa Google, indexação e aspectos de pesquisa. A mensuração de cliques nas redes sociais é feita pelo GA4.

**Limite de mensuração:** os eventos confirmam o clique no site. Não comprovam visualização de perfil, login, leitura de publicação, envio de mensagem dentro da rede social ou fechamento de venda.

## 3. Arquivos alterados e adicionados

- `index.html` — serviços, opções do formulário, links sociais, imagens WebP, metadados e cache-busting.
- `script.js` — rastreamento GA4, seleção automática de serviço e evento de geração de lead.
- `styles.css` — suporte aos ícones WebP mantendo as dimensões e o padrão visual do cabeçalho.
- `README.md` — documentação atualizada para a versão 2.3.5.
- `RELATORIO-TECNICO-WOG-COMPUTER-v2.3.5.md` — este relatório.
- `assets/instagram.webp`
- `assets/facebook.webp`
- `assets/linkedin.webp`

Arquivos existentes mantidos:
- `assets/logo-wogcomputer.webp`
- `assets/loja-wogcomputer.webp`
- `assets/loja-interior.webp`
- `assets/loja-moderna.webp`
- `assets/bancada-assistencia.webp`
- `assets/favicon.svg`
- `assets/og-wogcomputer.jpg`
- `robots.txt`
- `sitemap.xml`

Os parâmetros de cache foram atualizados para `2.3.5` em `styles.css` e `script.js`.

## 4. Validações locais realizadas

| Verificação | Resultado |
|---|---|
| Leitura e parsing do HTML | Aprovado |
| Parsing do JSON-LD | Aprovado |
| Parsing do sitemap XML | Aprovado |
| Sintaxe JavaScript com `node --check` | Aprovado |
| Referências locais a imagens e arquivos | Sem arquivos ausentes |
| Âncoras internas | Sem destinos ausentes |
| Quantidade de soluções | 9 cartões identificados |
| Ícones sociais | 3 links e 3 imagens WebP identificados |
| Eventos GA4 sociais | 3 eventos específicos e evento geral presentes |
| Evento de geração de lead | Presente no JavaScript |
| Opções do formulário | Atualizadas para as nove soluções e demais opções existentes |

Os ícones sociais WebP gerados nesta versão são arquivos leves:
- Instagram: aproximadamente 2,5 KB.
- Facebook: aproximadamente 0,7 KB.
- LinkedIn: aproximadamente 1,0 KB.

### Responsividade e testes de navegador

O CSS responsivo original foi preservado, incluindo os breakpoints existentes para tablet e celular. Foram acrescentadas regras para dimensionar as imagens WebP dentro dos mesmos botões circulares.

**Limitação do ambiente de validação:** a tentativa de executar Chromium/Playwright localmente foi bloqueada pelo ambiente de execução. Portanto, não declaro um teste visual automatizado de navegador como aprovado. A responsividade precisa ser conferida após o upload em desktop e celular, preferencialmente também em um aparelho real.

## 5. Publicação e validação em produção

Após publicar no GitHub/Cloudflare Pages:

1. Abrir `https://wogcomputer.com.br/` em janela anônima.
2. Conferir os nove cartões da seção Soluções.
3. Clicar em um CTA de serviço e confirmar que o formulário seleciona o serviço correto.
4. Enviar o formulário de teste e verificar se o WhatsApp abre com os dados e assunto corretos.
5. Clicar nos ícones Instagram, Facebook e LinkedIn e confirmar que cada destino abre em nova aba.
6. No GA4, utilizar Tempo real ou DebugView para verificar os eventos.
7. Confirmar os eventos específicos de cada rede social.
8. Cadastrar dimensões personalizadas para `social_network` e `service_name`, se desejado.
9. Conferir `robots.txt` e `sitemap.xml`.
10. Executar PageSpeed Insights e revisar a experiência mobile.

## 6. Histórico de versões

| Versão | Escopo |
|---|---|
| 2.3.3 | SEO técnico, metadados, dados estruturados, canonical, sitemap e robots.txt |
| 2.3.4 | Otimização das cinco imagens principais para WebP |
| 2.3.5 | Nove soluções comerciais, ícones WebP das redes sociais, LinkedIn, eventos GA4 sociais, seleção automática de serviço e geração de lead |

---

**WAGNER GARCIA**  
Gerente de Projetos de Infraestrutura de TI  
Segurança da Informação | Gestão de Tecnologia | Soluções Empresariais

**WOG COMPUTER — Comércio e Serviços de Informática**  
https://wogcomputer.com.br/  
wogcomputer@yahoo.com.br  
WhatsApp: +55 27 99758-9719

*WOG COMPUTER — Tecnologia que move negócios.*
