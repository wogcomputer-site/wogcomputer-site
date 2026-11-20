# Checklist de implantação — WOG COMPUTER v3.0.0

## Antes da publicação
- [ ] Manter ZIP/branch de segurança da v2.3.5 sem alterações.
- [ ] Conferir que a publicação será feita primeiro em preview/homologação.
- [ ] Confirmar que `CNAME` contém `wogcomputer.com.br`.

## Testes funcionais
- [ ] Abrir a página inicial em desktop e celular.
- [ ] Testar menu móvel, fechar menu ao selecionar link e navegação por âncoras.
- [ ] Conferir as nove soluções e todos os textos.
- [ ] Clicar nos CTAs de serviço e confirmar a seleção correta no formulário.
- [ ] Enviar formulário de teste: confirmar que o WhatsApp abre com a mensagem correta e revisar antes de enviar.
- [ ] Testar os botões de WhatsApp do cabeçalho/hero, contato, equipamentos e flutuante.
- [ ] Testar Instagram, Facebook e LinkedIn.
- [ ] Conferir logo, favicon, galeria e imagem OG.
- [ ] Conferir mapa, endereço, e-mail e telefone.

## Analytics e Google
- [ ] No GA4 DebugView/Tempo real, validar `page_view`, `whatsapp_click`, `service_interest_click`, `quote_cta_click`, `quote_form_whatsapp_open`, eventos sociais e `generate_lead`.
- [ ] Confirmar se `generate_lead` deve ser marcado como evento principal depois de observar o recebimento real.
- [ ] Não enviar nome, empresa, telefone ou texto livre do formulário como parâmetros GA4.
- [ ] No Search Console, conferir propriedade de domínio, inspeção da URL e sitemap enviado.

## SEO e desempenho
- [ ] Conferir `https://wogcomputer.com.br/robots.txt`.
- [ ] Conferir `https://wogcomputer.com.br/sitemap.xml`.
- [ ] Rodar PageSpeed Insights para celular e desktop.
- [ ] Comparar pontuação, LCP, INP, CLS e solicitações bloqueadoras com a captura de referência.
- [ ] No Cloudflare, avaliar Email Address Obfuscation e Browser Insights/RUM antes de alterar.
- [ ] Conferir cache, Brotli e comportamento do preview/produção.

## Liberação
- [ ] Registrar commit como `WOG COMPUTER v3.0.0 — imagens otimizadas e desempenho`.
- [ ] Promover para `main` somente após aprovação dos testes.
- [ ] Guardar o ZIP final e relatórios junto ao histórico de versões.
