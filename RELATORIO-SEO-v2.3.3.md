# WOG COMPUTER — SEO e otimização orgânica
## Relatório técnico de implementação — versão 2.3.3

**Projeto:** Site Oficial WOG COMPUTER  
**Versão de origem:** 2.3.2  
**Versão preparada:** 2.3.3  
**Domínio canônico:** https://wogcomputer.com.br/  
**Data:** 18/11/2026

## 1. Objetivo

Preparar a página institucional existente para rastreamento e compreensão por mecanismos de busca, preservando a arquitetura estática, a identidade visual e as funcionalidades existentes.

## 2. Alterações realizadas

### `index.html`
- Title revisado com marca, serviços e localização.
- Meta description revisada.
- Diretivas `robots` e `googlebot` com `index, follow`.
- Canonical para `https://wogcomputer.com.br/`.
- Metadados Open Graph, incluindo URL, título, descrição, imagem e dimensões.
- Metadados Twitter/X Cards.
- Dados estruturados JSON-LD com `ComputerStore` e `WebSite`.
- Cache-busting atualizado para CSS e JavaScript com identificador `2.3.3`.
- Implementação existente do GA4 preservada.

### `robots.txt`
- Permite rastreamento das páginas públicas.
- Informa a localização do sitemap.

### `sitemap.xml`
- Lista a URL canônica da página inicial.
- O site entregue é uma página única com seções internas; as âncoras não foram listadas como páginas separadas.

### `assets/og-wogcomputer.jpg`
- Imagem de compartilhamento social derivada da fotografia existente do site.
- Dimensões: 1200 × 630 pixels.
- Formato JPEG otimizado.

### `README.md`
- Atualizado para a versão 2.3.3.
- Documentadas as implementações, o escopo do sitemap e as validações pendentes.

## 3. Preservação

- Não houve reformulação do layout.
- `styles.css` foi preservado.
- `script.js` foi preservado.
- Links, formulário, WhatsApp e eventos existentes não foram reescritos.
- Nenhum serviço pago, campanha publicitária ou cadastro financeiro foi adicionado.

## 4. Testes locais realizados

| Teste | Resultado |
|---|---|
| Leitura/parse do sitemap XML | Aprovado |
| Existência de robots.txt | Aprovado |
| Canonical na página inicial | Aprovado |
| JSON-LD parseável | Aprovado |
| Quantidade de H1 | 1 |
| Referências locais a arquivos | Sem arquivos ausentes |
| Âncoras internas | Sem destinos ausentes |
| Sintaxe JavaScript (`node --check`) | Aprovado |

**Limitação:** os testes foram realizados nos arquivos locais. Eles não comprovam a resposta HTTP após publicação, rastreamento do Google, indexação, rich results, Core Web Vitals ou posicionamento orgânico.

## 5. Procedimento de publicação recomendado

1. Mantenha o backup v2.3.2 intacto.
2. Extraia o ZIP v2.3.3 em uma cópia de trabalho.
3. Revise os arquivos e publique na branch de desenvolvimento, se disponível.
4. Confira o preview do Cloudflare Pages.
5. Teste a página, menu, formulário, WhatsApp, imagens e responsividade.
6. Após aprovação, faça merge/publicação na branch de produção.
7. Confirme que estes endereços retornam conteúdo próprio, e não a página inicial:
   - `https://wogcomputer.com.br/robots.txt`
   - `https://wogcomputer.com.br/sitemap.xml`
8. No Google Search Console, valide a propriedade do domínio e envie `sitemap.xml`.
9. Use a inspeção de URL para solicitar rastreamento da página inicial.

## 6. Observação sobre GA4 e GTM

O ZIP de origem contém a instalação direta do Google Analytics 4 (`gtag.js`) com o ID `G-Y3W56JDHZ1`. A documentação de origem também menciona o contêiner `GTM-5R5QJV8Z`, mas o snippet de instalação do contêiner não foi localizado no `index.html` entregue. A implementação de analytics foi preservada, sem adicionar um segundo mecanismo de tags. Recomenda-se uma auditoria separada no Tag Assistant antes de qualquer mudança.

## 7. Próximas atividades orgânicas

- Verificar domínio no Google Search Console.
- Enviar o sitemap.
- Inspecionar a URL canônica e acompanhar cobertura/indexação.
- Revisar páginas e conteúdos para intenção de busca empresarial.
- Criar páginas individuais de serviços apenas quando houver conteúdo real e útil suficiente para cada serviço.
- Avaliar o Perfil da Empresa no Google, se elegível e de acordo com as diretrizes.

**Importante:** SEO técnico facilita rastreamento e interpretação, mas não garante indexação, primeira página ou primeira posição.
