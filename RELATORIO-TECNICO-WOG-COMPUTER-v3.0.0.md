# WOG COMPUTER — Relatório técnico de atualização
## Versão 3.0.0 — imagens otimizadas e desempenho

**Projeto:** site institucional WOG COMPUTER  
**Versão-base:** 2.3.5  
**Versão preparada:** 3.0.0  
**Domínio:** https://wogcomputer.com.br/  
**Data de preparação:** 19/11/2026  

## 1. Escopo

A atualização foi realizada sobre o ZIP `WOG_COMPUTER_v2.3.5_ENTREGA(1).zip`, mantendo a versão 2.3.5 como base. O pacote RAR `WOG-COMPUTER-assets-otimizados.rar` forneceu seis imagens. A atualização não substitui a arquitetura nem recria o site.

## 2. Inventário e substituição de imagens

Foram substituídos, mantendo nome e caminho: `bancada-assistencia.webp`, `logo-wogcomputer.webp`, `loja-interior.webp`, `loja-moderna.webp`, `loja-wogcomputer.webp` e `og-wogcomputer.jpg`. Os arquivos sociais `instagram.webp`, `facebook.webp`, `linkedin.webp` e `favicon.svg` foram mantidos. `placeholder.txt` foi removido após busca de referências no código.

| Arquivo | Antes | Depois | Economia aproximada |
|---|---:|---:|---:|
| Logo | 143.528 B | 67.566 B | 52,9% |
| Loja interior | 147.512 B | 74.602 B | 49,4% |
| Loja moderna | 157.890 B | 76.678 B | 51,4% |
| Loja WOG | 155.066 B | 71.260 B | 54,0% |
| Bancada | 103.608 B | 74.430 B | 28,2% |
| OG | 200.872 B | 185.702 B | 7,6% |

**Economia total nos seis arquivos:** aproximadamente 358.238 bytes (cerca de 350 KiB), comparando os tamanhos dos arquivos no ZIP-base e no RAR recebido. Os números representam bytes transferidos a menos antes de compressão HTTP e não são uma medição de PageSpeed.

## 3. Correções aplicadas

### 3.1. Imagem LCP
- Preload da imagem `assets/loja-wogcomputer.webp`.
- `fetchpriority="high"` na imagem principal.
- Mantida sem lazy loading por estar na primeira dobra.

### 3.2. Imagens secundárias
- Lazy loading e decoding assíncrono nas imagens abaixo da primeira dobra.
- Atributos width/height explícitos para reservar espaço de renderização.
- Reutilização do mesmo arquivo de bancada em dois pontos, evitando manter cópia duplicada do mesmo conteúdo.

### 3.3. Fontes e CSS
- Removido `@import` externo do Google Fonts.
- Substituídas as famílias DM Sans/Manrope por pilha de fontes do sistema.
- Preservadas regras de layout, breakpoints e cores.

### 3.4. Versionamento
- Atualizados os parâmetros de cache de CSS e JavaScript para `3.0.0`.
- Adicionado `CNAME` com `wogcomputer.com.br`.

## 4. Funcionalidades preservadas no código

- Menu responsivo e navegação por âncoras.
- Nove cartões de serviços.
- Formulário de orçamento e abertura do WhatsApp com mensagem preenchida.
- WhatsApp flutuante e CTAs comerciais.
- Ícones e links Instagram, Facebook e LinkedIn. O LinkedIn aponta para o perfil informado no histórico de commits: `https://www.linkedin.com/in/wagner-garcia-25b400128/`.
- GA4 `G-Y3W56JDHZ1` e os eventos definidos no `script.js`.
- Metadados, canonical, JSON-LD, robots e sitemap.

O evento `generate_lead` é disparado quando o visitante submete o formulário e o site prepara a abertura do WhatsApp. Isso mede intenção/abertura do fluxo, não confirma envio da mensagem nem venda concluída.

## 5. Auditoria PageSpeed baseada nas capturas fornecidas

| Indicador mobile | Resultado registrado na captura |
|---|---:|
| Desempenho | 90 |
| Acessibilidade | 96 |
| Práticas recomendadas | 100 |
| SEO | 100 |

A auditoria desktop visível indicou: imagem LCP sem `fetchpriority=high`; latência máxima do caminho crítico 2.027 ms; `email-decode.min.js` do Cloudflare ~844 ms; `script.js` ~779 ms; recurso do CSS ~578 ms; fontes Google ~596–713 ms; `/cdn-cgi/rum` ~2.027 ms. A pontuação desktop não foi mostrada. Esses tempos são os exibidos na captura e podem variar entre execuções.

## 6. Pontos que dependem do painel Cloudflare

1. Revisar **Email Address Obfuscation** (obfuscação de e-mail), pois o PageSpeed identifica `email-decode.min.js`. Desativar somente se a proteção contra coleta automatizada de e-mails não for necessária e após avaliar o impacto.
2. Revisar **Browser Insights / Web Analytics RUM** se o recurso `/cdn-cgi/rum` estiver ativo e for dispensável. Não desativar sem confirmar que não é utilizado para monitoramento.
3. Confirmar se **Rocket Loader** está desativado ou se não está alterando a ordem de scripts; não alterar sem teste.
4. Confirmar cache e compressão Brotli no domínio.

Essas configurações não podem ser modificadas pelo HTML/CSS/JS entregue.

## 7. Validação técnica realizada no pacote

- Referências locais de imagem e favicon verificadas contra os arquivos existentes.
- Arquivos de assets listados e comparados por tamanho.
- Sintaxe JavaScript validada com `node --check`.
- Sitemap XML validado.
- JSON-LD extraído e validado como JSON.
- Presença de canonical, title, description, robots e IDs GA4 conferida.
- Ausência de referências ao `placeholder.txt` confirmada.

Não foi possível executar uma auditoria PageSpeed pós-implantação nem validar visualmente a versão publicada, porque ela ainda não foi implantada. Não se declara que a conta GA4, Search Console ou o WhatsApp foram testados em produção.

## 8. Riscos e observações

- A remoção das fontes remotas altera discretamente a tipografia entre dispositivos, em favor de menor dependência externa.
- A imagem de compartilhamento OG continua em JPEG 1200 × 630, conforme o padrão de metadados atual.
- O LinkedIn utilizado é o perfil pessoal informado no histórico do repositório e foi incluído no `sameAs`, acompanhando o commit de inclusão do LinkedIn apresentado pelo responsável. Para uma página empresarial oficial, substitua-o quando ela existir.
- A propriedade e as configurações externas do Google permanecem intactas; o pacote não inclui credenciais, arquivos de verificação privados ou acesso a contas.

## 9. Recomendação de implantação

Usar branch de homologação/preview, testar todas as interações e só depois fazer merge na branch `main`. O procedimento completo está em `CHECKLIST-IMPLANTACAO-v3.0.0.md`.
