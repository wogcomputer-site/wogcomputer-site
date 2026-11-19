
# WOG COMPUTER
## Comércio e Serviços de Informática
### Documentação Técnica e Institucional — Versão 2.3.5

**Tecnologia que move negócios.**

Site institucional oficial da WOG COMPUTER, desenvolvido para apresentar soluções empresariais em infraestrutura de TI, segurança da informação, suporte técnico, equipamentos e serviços tecnológicos.

🌐 **Site oficial:** https://wogcomputer.com.br

---

## 1. IDENTIFICAÇÃO DO PROJETO

| Informação | Descrição |
|---|---|
| Projeto | Site Institucional WOG COMPUTER |
| Empresa | WOG COMPUTER |
| Versão atual | 2.3.5 |
| Tipo | Website institucional |
| Arquitetura | Site estático |
| Linguagens | HTML5, CSS3 e JavaScript |
| Repositório | GitHub |
| Hospedagem e publicação | Infraestrutura web configurada para o domínio oficial |
| Domínio | wogcomputer.com.br |
| Idioma | Português — Brasil |

## 2. OBJETIVOS DO PROJETO

Desenvolver uma presença digital profissional para a WOG COMPUTER, com foco em:

- Fortalecimento da identidade institucional.
- Apresentação dos serviços e soluções tecnológicas.
- Captação de clientes empresariais.
- Solicitação de orçamentos.
- Atendimento comercial pelo WhatsApp.
- Integração com redes sociais.
- Monitoramento de acessos e conversões.
- Otimização para mecanismos de busca (SEO).

## 3. ESTRUTURA DO PROJETO

```text
WOG_COMPUTER/
│
├── assets/
│   ├── bancada-assistencia.webp
│   ├── favicon.svg
│   ├── facebook.webp
│   ├── instagram.webp
│   ├── linkedin.webp
│   ├── logo-wogcomputer.webp
│   ├── loja-interior.webp
│   ├── loja-moderna.webp
│   ├── loja-wogcomputer.webp
│   ├── og-wogcomputer.jpg
│   └── placeholder.txt
│
├── index.html
├── styles.css
├── script.js
└── README.md
```

### Descrição dos arquivos

| Arquivo | Função |
|---|---|
| index.html | Estrutura, conteúdo, metadados SEO e dados estruturados |
| styles.css | Estilos, identidade visual e responsividade |
| script.js | Interações e funcionalidades JavaScript |
| assets/ | Imagens, logotipo, favicon e imagem de compartilhamento social |
| robots.txt | Regras públicas de rastreamento para mecanismos de busca |
| sitemap.xml | Endereço canônico das páginas públicas indexáveis |
| README.md | Documentação técnica do projeto |

## 4. IDENTIDADE VISUAL

A identidade visual da WOG COMPUTER utiliza elementos institucionais próprios, com predominância de:

- Azul institucional.
- Azul tecnológico.
- Branco.
- Elementos gráficos de tecnologia.
- Fotografias da estrutura e dos equipamentos.

O projeto busca transmitir profissionalismo, confiança, inovação e credibilidade empresarial.

## 5. FUNCIONALIDADES DO WEBSITE

O website contempla:

- Página institucional.
- Apresentação das soluções empresariais.
- Seção sobre a empresa.
- Apresentação da estrutura física.
- Catálogo de equipamentos e soluções.
- Botões de contato e solicitação de orçamento.
- Integração com WhatsApp.
- Integração com Instagram.
- Integração com Facebook.
- Integração com LinkedIn (link informado para o feed do LinkedIn).
- Links externos para redes sociais.
- Layout responsivo para computadores e dispositivos móveis.

## 6. INTEGRAÇÃO COM REDES SOCIAIS

O site possui integração com os canais digitais da WOG COMPUTER.

### Redes integradas

- Instagram.
- Facebook.
- WhatsApp.

Os ícones WebP de Instagram, Facebook e LinkedIn são apresentados no cabeçalho no mesmo padrão visual e abrem os destinos em nova aba. O endereço LinkedIn atualmente configurado é `https://www.linkedin.com/feed/`, conforme fornecido para esta implementação; esse endereço abre o feed do LinkedIn e não identifica uma página pública institucional da WOG COMPUTER. Quando houver uma URL pública da empresa, recomenda-se substituí-lo.

A integração tem como objetivos:

- Ampliar a presença digital.
- Facilitar o acesso aos canais institucionais.
- Fortalecer o relacionamento com clientes.
- Aumentar o alcance da marca.

## 7. GOOGLE ANALYTICS 4 — MONITORAMENTO

Foi realizada a integração do website com o Google Analytics 4 (GA4).

### Identificação técnica

- Propriedade: WOG COMPUTER - Site Oficial.
- ID de mensuração: G-Y3W56JDHZ1.
- Contêiner GTM informado no histórico do projeto: GTM-5R5QJV8Z. **Atenção:** o código-fonte desta entrega contém a instalação direta do GA4 (`gtag.js`), mas não contém o snippet de instalação do contêiner GTM. Não foi feita alteração nessa integração para evitar duplicidade sem uma auditoria específica.

### Eventos identificados

| Evento | Finalidade |
|---|---|
| page_view | Visualizações de páginas |
| first_visit | Primeira visita |
| session_start | Início da sessão |
| user_engagement | Engajamento |
| scroll | Rolagem da página |
| click | Cliques |
| form_start | Início de formulário |
| quote_cta_click | Clique no orçamento |
| quote_form_whatsapp_open | Abertura do WhatsApp pelo formulário |
| service_interest_click | Interesse em serviços |
| whatsapp_click | Clique no WhatsApp |
| instagram_click | Clique no Instagram |
| facebook_click | Clique no Facebook |
| linkedin_click | Clique no LinkedIn |
| social_media_click | Clique em qualquer rede social, com parâmetro `social_network` |
| service_quote_cta_click | Clique na chamada de orçamento de um serviço |
| generate_lead | Envio do formulário para abertura do WhatsApp; inclui o serviço de interesse, sem dados pessoais |

### Conversões

O evento `whatsapp_click` permanece preservado. A versão 2.3.5 acrescenta eventos específicos para Instagram, Facebook e LinkedIn, além de `social_media_click`, `service_quote_cta_click` e `generate_lead`. Para visualizar parâmetros como `social_network` e `service_name` em relatórios personalizados, cadastre-os como dimensões personalizadas no GA4. Se desejar que `generate_lead` apareça como conversão/evento principal, habilite essa opção na interface do GA4 após confirmar os primeiros eventos.

O objetivo é acompanhar os contatos comerciais originados pelo website.

**Observação:** a configuração foi identificada e testada em tempo real. A validação contínua dos registros e relatórios de conversão permanece como atividade de acompanhamento.

## 8. SEO — OTIMIZAÇÃO PARA MECANISMOS DE BUSCA

### Implementações da versão 2.3.3

- Title otimizado com serviço e localização: WOG COMPUTER | TI, Segurança e Suporte em Vitória-ES.
- Meta description revisada para apresentar os principais serviços e a localização.
- Diretivas `index, follow` para mecanismos de busca.
- URL canônica da página inicial (`https://wogcomputer.com.br/`).
- Metadados Open Graph completos, incluindo imagem de compartilhamento 1200 × 630.
- Metadados Twitter/X Cards.
- Dados estruturados JSON-LD com `ComputerStore` e `WebSite`, utilizando informações institucionais presentes no projeto.
- Arquivo `robots.txt` liberando o rastreamento público e indicando o sitemap.
- Arquivo `sitemap.xml` com a URL canônica da página inicial.

### Escopo atual do sitemap

O website entregue é uma página institucional única, organizada em seções e âncoras (`#inicio`, `#solucoes`, `#empresa`, entre outras). Por isso, o sitemap lista somente a URL pública canônica da página inicial. As âncoras não são páginas independentes e não devem ser cadastradas como URLs distintas no sitemap.

### Palavras-chave estratégicas para o trabalho de conteúdo

- Empresa de TI em Vitória-ES.
- Infraestrutura de TI empresarial.
- Segurança da informação para empresas.
- Backup em nuvem empresarial.
- Suporte técnico empresarial.
- Contratos de serviços de TI.
- Redes e conectividade empresarial.

As palavras-chave orientam a estratégia editorial e não representam garantia de posição nos resultados de busca. O posicionamento depende também de concorrência, relevância, conteúdo, reputação, rastreamento e indexação.

### Validações externas pendentes

Após a publicação da versão 2.3.3, validar os seguintes endereços no domínio de produção:

- `https://wogcomputer.com.br/robots.txt`
- `https://wogcomputer.com.br/sitemap.xml`
- `https://wogcomputer.com.br/`

Em seguida, cadastrar/verificar o domínio no Google Search Console e enviar o sitemap. A inclusão no sitemap não garante indexação ou posicionamento.

## 9. TECNOLOGIAS E FERRAMENTAS

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura do website |
| CSS3 | Design e responsividade |
| JavaScript | Funcionalidades |
| GitHub | Controle de versão |
| Cloudflare | Infraestrutura e serviços web |
| Google Analytics 4 | Análise de acessos e eventos |
| Google Tag Manager | Gerenciamento de tags |
| Google Search Console | Monitoramento de pesquisa orgânica |
| WhatsApp | Atendimento comercial |

## 10. PUBLICAÇÃO E MANUTENÇÃO

O projeto utiliza GitHub para controle de versões e gerenciamento dos arquivos.

### Procedimento recomendado

1. Realizar alterações na ramificação de desenvolvimento.
2. Revisar os arquivos modificados.
3. Testar o website localmente.
4. Validar links, imagens e funcionalidades.
5. Verificar responsividade.
6. Validar o funcionamento das tags.
7. Revisar as alterações.
8. Publicar somente após aprovação.

### Cuidados operacionais

- Manter cópias de segurança.
- Preservar versões anteriores.
- Não alterar configurações DNS sem necessidade.
- Não publicar arquivos incompletos.
- Não expor credenciais ou informações privadas.
- Verificar o funcionamento do domínio após atualizações.

## 11. HISTÓRICO DE VERSÕES

| Versão | Descrição |
|---|---|
| 1.0 | Desenvolvimento inicial do website |
| 2.0 | Evolução da estrutura institucional |
| 2.2 | Atualização do website e inclusão das redes sociais |
| 2.3 | Evolução da documentação, monitoramento, conversões e aprimoramentos institucionais |
| 2.3.3 | SEO técnico: metadados, canonical, Open Graph, Twitter Cards, JSON-LD, robots.txt, sitemap.xml e imagem social |
| 2.3.4 | Otimização das cinco imagens principais para WebP, atualização das referências no HTML e preservação de favicon e imagem Open Graph |
| 2.3.5 | Ampliação para nove soluções, ícones WebP das redes sociais, LinkedIn, eventos de cliques sociais, CTA por serviço, evento de geração de lead e documentação atualizada |

## 12. SOLUÇÕES COMERCIAIS — VERSÃO 2.3.5

A seção Soluções apresenta nove serviços:

1. Infraestrutura de TI — inclui ambientes tecnológicos, redes, servidores, estações e Microsoft 365 quando aplicável.
2. Segurança da informação — contempla proteção de dados, dispositivos, acessos, análise de riscos e apoio à adequação à LGPD.
3. Backup em nuvem — cópia, armazenamento, recuperação de dados e continuidade.
4. Suporte e manutenção — suporte técnico e manutenção preventiva/corretiva.
5. Redes e conectividade — redes cabeadas, Wi-Fi e comunicação entre unidades.
6. Contratos de TI — serviços recorrentes com escopo e níveis de atendimento definidos.
7. Marketing Estratégico e Gestão de Presença Digital — planejamento de marketing, redes sociais, conteúdo e campanhas.
8. Sites, Domínios e Hospedagem — criação e atualização de sites, domínios, hospedagem e e-mail profissional integrado.
9. Internet, Link Dedicado, TV e Streaming — opções de conectividade e serviços associados conforme disponibilidade e cobertura.

O formulário de orçamento foi atualizado para apresentar as nove soluções e encaminhar a escolha do visitante na mensagem preparada para o WhatsApp.

## 13. RASTREAMENTO DE REDES SOCIAIS E LIMITES DAS FERRAMENTAS

Os cliques nos ícones de Instagram, Facebook e LinkedIn são enviados ao GA4 em nova aba. Os eventos específicos são `instagram_click`, `facebook_click` e `linkedin_click`, acompanhados pelo evento geral `social_media_click`.

O Google Analytics 4 é a ferramenta apropriada para analisar esses eventos de interação no site. O Google Search Console não é um sistema de analytics de cliques em botões ou links externos; ele acompanha desempenho da presença do site nos resultados da Pesquisa Google, indexação e aspectos relacionados à pesquisa.

A implementação registra o clique no link do site. Ela não comprova que o visitante concluiu login, visualizou uma publicação ou interagiu dentro da rede social.

## 14. PRÓXIMAS EVOLUÇÕES

O planejamento de evolução do website contempla:

- Aprimoramento de SEO técnico.
- Monitoramento de conversões.
- Otimização de campanhas Google Ads.
- Integração avançada com redes sociais.
- Melhorias de desempenho.
- Aprimoramento da experiência mobile.
- Ampliação das ferramentas de análise.
- Desenvolvimento de novas funcionalidades comerciais.

## 15. RESPONSABILIDADE TÉCNICA

**WAGNER GARCIA**

Gerente de Projetos de Infraestrutura de TI  
Segurança da Informação | Gestão de Tecnologia | Soluções Empresariais

**WOG COMPUTER — Comércio e Serviços de Informática**

🌐 https://wogcomputer.com.br

📧 wogcomputer@yahoo.com.br

📱 WhatsApp: +55 27 99758-9719

---

*WOG COMPUTER — Tecnologia que move negócios.*

*Documentação técnica — Versão 2.3.5 — Novembro de 2026.*


## 16. NOTAS DE IMPLEMENTAÇÃO — VERSÃO 2.3.3

- Atualização dos metadados da página inicial sem alteração do layout visual.
- Inclusão de URL canônica e diretivas de indexação.
- Inclusão de Open Graph e Twitter/X Cards.
- Criação da imagem social `assets/og-wogcomputer.jpg` (1200 × 630).
- Inclusão de dados estruturados JSON-LD para o negócio e o website.
- Criação de `robots.txt` e `sitemap.xml`.
- Atualização dos parâmetros de cache dos arquivos CSS e JavaScript para `2.3.3`.
- Preservação do GA4 e dos eventos JavaScript existentes.
- Não foram adicionados serviços pagos, scripts de anúncios ou exigências de cartão.
- Não foram criadas páginas internas novas; o website permanece institucional de página única.

### Observação sobre rastreamento

A versão entregue preserva a implementação GA4 encontrada no ZIP. O ID de contêiner GTM descrito em versões anteriores da documentação não aparece instalado no `index.html` fornecido. Recomenda-se auditar GA4/GTM no Tag Assistant antes de adicionar outro snippet, para evitar disparos duplicados.

### Testes locais executados

Os testes locais desta entrega verificam a sintaxe estrutural dos arquivos, a leitura do XML do sitemap, a existência dos arquivos de SEO e a resolução de referências locais. A publicação em Cloudflare Pages e a resposta HTTP real do domínio dependem do deploy e devem ser validadas após a atualização.


## 16. NOTAS DE IMPLEMENTAÇÃO — VERSÃO 2.3.5

- Nove soluções comerciais apresentadas na seção Soluções.
- O formulário contempla as nove soluções e mantém as opções de equipamentos e outra necessidade.
- Os CTAs dos cartões selecionam automaticamente o serviço correspondente no formulário.
- O formulário mantém a preparação da mensagem e abertura do WhatsApp em nova aba.
- Instagram, Facebook e LinkedIn usam ícones WebP com dimensões visuais equivalentes.
- O clique em cada rede gera evento específico e evento geral no GA4.
- O evento `generate_lead` é enviado no envio do formulário, sem transmitir nome, empresa ou mensagem livre ao GA4.
- A logo original da WOG COMPUTER e os recursos visuais existentes foram preservados.
- A URL do LinkedIn configurada é o feed geral fornecido pelo responsável; substituir quando a URL pública institucional da empresa estiver disponível.

### Limites de validação
A validação estrutural e de sintaxe foi realizada localmente. A coleta efetiva dos eventos, a publicação, a resposta HTTP, o comportamento visual em dispositivos reais e a indexação devem ser confirmados após o deploy.
