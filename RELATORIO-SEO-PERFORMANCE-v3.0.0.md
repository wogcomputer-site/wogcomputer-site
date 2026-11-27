# WOG COMPUTER — Relatório SEO e desempenho
## Auditoria e melhorias preparadas — v3.0.0

## 1. Situação de referência

As capturas de PageSpeed fornecidas pelo responsável pelo projeto registram, para celular: desempenho 90, acessibilidade 96, práticas recomendadas 100 e SEO 100. As capturas desktop mostram auditorias de caminho crítico e LCP, mas não exibem a pontuação geral do desktop.

## 2. Achados prioritários

| Achado | Evidência na captura | Tratamento na v3.0.0 |
|---|---|---|
| Imagem LCP sem prioridade alta | Auditoria diz que `fetchpriority=high` precisa ser aplicado | Corrigido com preload e `fetchpriority=high` na imagem hero |
| Fontes externas no caminho crítico | Google Fonts com tempos aproximados de 596–713 ms | Removido `@import`; fontes do sistema passam a ser usadas |
| Script de e-mail do Cloudflare | `email-decode.min.js` ~844 ms | Requer decisão no painel Cloudflare |
| RUM do Cloudflare | `/cdn-cgi/rum` no caminho crítico | Requer revisão da configuração Cloudflare |
| CSS e JavaScript no caminho crítico | CSS ~578 ms e JS ~779 ms na captura | Recursos locais pequenos; cache-busting atualizado. Reavaliar após publicação |

## 3. SEO técnico preservado

- Title e meta description.
- Canonical para a página inicial.
- Robots `index, follow`.
- Open Graph e Twitter Cards.
- JSON-LD com `ComputerStore` e `WebSite`.
- `robots.txt` e `sitemap.xml`.
- Conteúdo em português do Brasil e seções internas com âncoras.

## 4. Recomendações para ganhar visibilidade orgânica

1. Manter o Google Business Profile completo, caso a empresa seja elegível: categoria correta, telefone, endereço, horário real, serviços e fotos próprias.
2. Criar páginas específicas de serviços somente com conteúdo original e substancial (Infraestrutura de TI em Vitória, Segurança da Informação, Backup em Nuvem, Suporte de TI etc.). Não criar páginas repetitivas apenas para palavras-chave.
3. Publicar estudos de caso autorizados, com problema, solução, escopo e resultados comprováveis.
4. Incluir prova de confiança: dados empresariais, área atendida, processo de atendimento, depoimentos reais e políticas de privacidade.
5. Acompanhar consultas, impressões, cliques, CTR e posição no Search Console por pelo menos ciclos mensais; revisar títulos e conteúdo com base nos dados.
6. Usar GA4 para medir cliques e intenção de contato; diferenciar abertura do WhatsApp de lead efetivamente recebido.

## 5. Limites

Pontuações de laboratório variam conforme dispositivo, rede, cache e execução. Uma nota alta não garante primeira página. A posição orgânica depende de relevância, concorrência, localização, conteúdo, autoridade, experiência e dados acumulados ao longo do tempo. Não há garantia de posição ou prazo de indexação.

## 6. Validação após publicação

- Rodar PageSpeed Insights novamente em celular e desktop.
- Conferir LCP, INP, CLS e oportunidades de carregamento.
- Verificar se `/robots.txt` e `/sitemap.xml` retornam 200 e conteúdo correto.
- Inspecionar a URL no Search Console e verificar a canonical selecionada pelo Google.
- Validar eventos no GA4 DebugView/Tempo real.
