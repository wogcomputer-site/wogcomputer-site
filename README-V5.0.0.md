# WOG COMPUTER V5.0.0 — homologação

Este pacote contém o site institucional preservado e a loja V5 para implantação em **Preview/homologação**. Não publicar em produção nem mesclar na `main` antes da aprovação dos testes.

## Estrutura

- `index.html`, `styles.css`, `script.js`, `assets/`: site institucional.
- `loja/`: vitrine, carrinho, checkout e retorno.
- `admin/`: bootstrap e painel administrativo.
- `functions/api/[[path]].js`: API Cloudflare Pages Functions.
- `database/migrations-v5/`: esquema/migrações D1 V5.
- `database/seeds/`: importação de produtos e categorias.

## Preservação institucional e SEO

O GA4 existente (`G-Y3W56JDHZ1`) foi mantido no site institucional. Os arquivos de metadados, canonical, dados estruturados, `robots.txt` e `sitemap.xml` foram preservados/ajustados. A loja pública `/loja/` está liberada para rastreamento; checkout, retorno, API e painel permanecem fora do índice.

A verificação do Google Search Console por DNS/conta é configuração externa ao ZIP. Não alterar nem remover o registro TXT de verificação existente no DNS da Locaweb/Cloudflare.

## Ambiente Cloudflare e banco

O `wrangler.toml` associa o D1 `wogcomputer-v5-homologacao` somente ao ambiente `preview`, usando o ID `363c0948-8132-4b75-922c-ae8cd9980610`. Não há binding D1 de produção neste arquivo. Confirme no painel Cloudflare Pages que a branch `wog-v5.0.0-homologacao` está configurada como Preview e que o ambiente Production/`main` mantém suas configurações anteriores.

O D1 Preview já foi informado como contendo 119 produtos e 172 categorias. **Não reaplique migrations iniciais nem seeds nesse banco.** Faça backup e confira `d1 migrations list` antes de qualquer migração.

Para banco V5 novo e vazio, a ordem é:
1. `database/migrations-v5/0001_v5_core.sql`
2. `database/migrations-v5/0002_stock_availability.sql`
3. `database/seeds/0002_import_119_products.sql` (uma única vez)
4. `database/seeds/WOG_V5.0.0_EXPANSAO_CATEGORIAS_E_NAVEGACAO.sql` (uma única vez)

A estrutura base de pagamentos já aceita somente `pix` e `credit_card`. Não existe migração adicional para boleto.

## Secrets — somente Preview

Cadastrar em Cloudflare Pages > Settings > Variables and Secrets, no ambiente Preview:
- `ADMIN_BOOTSTRAP_TOKEN`
- `MP_ACCESS_TOKEN` (credencial de teste)
- `MP_WEBHOOK_SECRET`
- `MELHORENVIO_TOKEN`
- `MELHORENVIO_FROM_POSTAL_CODE`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (se o upload de imagens for utilizado)

Nunca inserir secrets no Git, ZIP, prints ou chat. O arquivo `.dev.vars.example` contém apenas nomes e valores vazios/de exemplo.

## Superadministrador

1. Configurar `ADMIN_BOOTSTRAP_TOKEN` como Secret no Preview.
2. Abrir `/admin/` no endereço de Preview.
3. Informar token, nome, e-mail `comercial@wogcomputer.com.br` e senha forte com no mínimo 12 caracteres.
4. Entrar com e-mail e senha.
5. Após confirmar o login, remover `ADMIN_BOOTSTRAP_TOKEN` dos Secrets do Preview.

O ZIP não cria o usuário por conta própria: o bootstrap precisa ser executado contra o D1 Preview conectado ao deploy.

## Loja e pagamento

- Formas de pagamento: **Pix e cartão de crédito/débito**.
- Boleto e outras modalidades não são oferecidos nem aceitos pela API.
- O cartão usa o Checkout Pro do Mercado Pago; bandeiras e modalidades efetivas dependem das bandeiras habilitadas na conta Mercado Pago e devem ser testadas no sandbox.
- O webhook exige validação de assinatura HMAC.
- Frete Melhor Envio depende de token, CEP de origem e peso/dimensões reais por variante.
- Retirada na loja está disponível.
- Estoque é validado novamente no servidor; produtos sem estoque permanecem visíveis e indisponíveis para compra.

## Limites conhecidos — não considerar produção pronta

A revisão do ZIP não consegue validar credenciais externas, domínio, DNS, bindings ativos, conta Mercado Pago, conta Melhor Envio ou comportamento do deploy real. Ainda exigem homologação:
- bootstrap e login no Preview, com consulta aos Logs do Cloudflare se houver HTTP 500;
- Pix, cartão de crédito e débito, todas as bandeiras habilitadas na conta, webhook aprovado/recusado/cancelado;
- cotação de frete com dimensões/peso e CEP reais;
- confirmação do isolamento de D1 e secrets entre Preview e Production;
- telas/fluxos de gestão de pedidos, clientes, financeiro, usuários/perfis e edição completa de produtos, além de notificações;
- dados fiscais, privacidade/LGPD, estornos/chargebacks e reversão de estoque.

A revisão corrige o que está presente no código; não cria módulos de gestão que ainda não existem.

## Publicação

Enviar o conteúdo desta pasta para a raiz da branch `wog-v5.0.0-homologacao`. Não substituir a `main`, não associar o domínio de produção ao Preview e não usar credenciais reais de produção durante os testes.
