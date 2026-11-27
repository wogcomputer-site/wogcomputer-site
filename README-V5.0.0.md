# WOG COMPUTER V5.0.0 — Homologação

A base institucional permanece a referência visual e funcional do projeto. A loja tem folha de estilo própria em `loja/loja-v5.css`; não alterar `styles.css` para personalizar a vitrine.

## Banco novo
1. Criar `wogcomputer-v5-homologacao` em Cloudflare D1.
2. Inserir o ID gerado em `wrangler.toml` nesta branch.
3. Aplicar `database/migrations-v5/0001_v5_core.sql`.
4. Aplicar `database/seeds/0002_import_119_products_as_drafts.sql` uma única vez.
5. Validar as contagens descritas em `PLANO-V5.0.0-HOMOLOGACAO.md`.

## Cloudinary
Manter `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` como secrets do ambiente Cloudflare. A API Secret nunca deve estar no navegador, no GitHub ou em arquivos versionados. O upload deve continuar assinado no backend.

## Segurança de publicação
Esta branch é exclusivamente de homologação. Não configurar domínio de produção, não substituir `main` e não ativar vendas reais.
