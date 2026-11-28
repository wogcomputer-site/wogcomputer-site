# WOG COMPUTER V5 — configuração de gateways

## Métodos de pagamento permitidos

A loja aceita exclusivamente:
- Pix
- Cartão de crédito
- Cartão de débito

Boleto, transferência bancária e outros métodos não devem ser oferecidos. O checkout solicita Pix ou cartão; para cartão, o Mercado Pago apresenta as opções de crédito/débito e bandeiras habilitadas na conta. A disponibilidade de cada bandeira precisa ser confirmada no sandbox e na conta comercial.

## Secrets do ambiente Preview

Cadastrar como Secrets em Cloudflare Pages > Settings > Variables and Secrets:
- `ADMIN_BOOTSTRAP_TOKEN`
- `MP_ACCESS_TOKEN` (token de teste)
- `MP_WEBHOOK_SECRET`
- `MELHORENVIO_TOKEN`
- `MELHORENVIO_FROM_POSTAL_CODE`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (se usar upload no painel)

Nunca inserir valores reais no repositório ou enviar pelo chat.

## Mercado Pago

1. Configurar credenciais de teste no Preview.
2. Registrar o webhook `https://<URL-PREVIEW>/api/payments/mercadopago/webhook` para eventos de pagamento.
3. Configurar o segredo de assinatura em `MP_WEBHOOK_SECRET`.
4. Testar Pix e cartão (crédito e débito), incluindo aprovado, recusado, cancelado e notificações repetidas.
5. Somente após aprovação, configurar credenciais e webhook de produção no ambiente Production, sem compartilhar secrets entre ambientes.

A implementação usa Checkout Pro. O conjunto de bandeiras depende da habilitação/contrato da conta Mercado Pago; não se deve prometer bandeiras que não estejam disponíveis na conta.

## Melhor Envio

1. Autorizar integração e configurar token de homologação.
2. Configurar `MELHORENVIO_FROM_POSTAL_CODE` com o CEP real de expedição.
3. Completar peso e dimensões reais em todas as variantes que serão enviadas.
4. Testar cotação com CEPs válidos.
5. A emissão de etiquetas, postagem e rastreamento ainda precisam de fluxo operacional e testes adicionais.

## Superadministrador

Configurar `ADMIN_BOOTSTRAP_TOKEN` no Preview, abrir `/admin/`, criar a conta `comercial@wogcomputer.com.br` com senha forte (mínimo 12 caracteres) e remover o Secret após confirmar o login.

## Banco D1

O `wrangler.toml` liga o banco `wogcomputer-v5-homologacao` apenas ao ambiente `preview`. O banco já existente contém 119 produtos e 172 categorias, segundo a conferência feita pelo usuário. Não reaplicar migrations iniciais nem seeds. Fazer backup e conferir o histórico antes de qualquer alteração.
