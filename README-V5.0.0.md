# WOG COMPUTER V5.0.0 — Loja e painel (homologação)

Este pacote é uma revisão técnica de homologação. Não publicar em produção nem habilitar vendas reais antes de concluir as integrações e testes descritos em `STATUS-IMPLANTACAO-V5.0.0.md`.

## Estrutura principal

- `loja/` — vitrine pública consultando o catálogo do D1 pela API.
- `admin/` — painel administrativo e criação inicial do administrador.
- `functions/api/[[path]].js` — API Pages Functions.
- `database/migrations-v5/` — estrutura D1 e disponibilidade por estoque.
- `database/seeds/` — importação dos 119 produtos e expansão da taxonomia.
- `_archive_v4/` — cópia histórica da versão anterior, não utilizada pela loja V5.

## Banco D1

O `wrangler.toml` aponta para o D1 de homologação configurado nesta cópia. Antes de executar comandos, confirme no painel Cloudflare que o nome e o ID correspondem exclusivamente ao banco V5 de homologação.

Aplicar nesta ordem, em banco novo e vazio:

1. `database/migrations-v5/0001_v5_core.sql`
2. `database/migrations-v5/0002_stock_availability.sql`
3. `database/seeds/0002_import_119_products.sql` (uma única vez)
4. `database/seeds/WOG_V5.0.0_EXPANSAO_CATEGORIAS_E_NAVEGACAO.sql`

Não reaplicar o seed de 119 produtos em banco já populado. Faça backup antes de qualquer migração.

## Secrets de homologação

Cadastrar no Cloudflare Pages > Settings > Variables and Secrets, no ambiente Preview:

- `ADMIN_BOOTSTRAP_TOKEN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Nunca colocar os valores em arquivos versionados. `.dev.vars.example` é somente modelo.

## Primeiro acesso administrativo

1. Cadastrar `ADMIN_BOOTSTRAP_TOKEN` como secret forte no ambiente Preview.
2. Abrir `/admin/`.
3. Informar o token, nome, e-mail e senha com pelo menos 12 caracteres.
4. Após criar a conta, entrar com e-mail e senha.
5. O bootstrap só funciona enquanto não houver usuário administrativo cadastrado.

## Catálogo

A vitrine usa `/api/store/categories` e `/api/store/products`. Produtos publicados com estoque zero permanecem visíveis e recebem estado indisponível. Rascunhos, inativos e arquivados não aparecem.

## Importante: pagamentos e entregas

O checkout, gateway Pix/cartão, webhooks, cotação de frete, pedidos, notificações e rastreamento ainda precisam ser implementados e testados com os provedores escolhidos. O botão de compra permanece desabilitado para impedir pedidos sem processamento real.

Consulte `STATUS-IMPLANTACAO-V5.0.0.md` antes de avançar.
