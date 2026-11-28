# WOG COMPUTER V5 — Configuração dos gateways

## Segredos obrigatórios (Cloudflare Pages > Settings > Variables and Secrets)

Cadastrar como **Secrets**, nunca como texto no código:
- `ADMIN_BOOTSTRAP_TOKEN`: token aleatório forte para criar o primeiro administrador; remover após o bootstrap.
- `MP_ACCESS_TOKEN`: token de acesso da aplicação Mercado Pago.
- `MP_WEBHOOK_SECRET`: chave secreta de assinatura dos Webhooks do Mercado Pago.
- `MELHORENVIO_TOKEN`: token OAuth da conta Melhor Envio.
- `MELHORENVIO_FROM_POSTAL_CODE`: CEP de origem da expedição WOG COMPUTER (somente CEP, 8 dígitos).

Opcional:
- `MELHORENVIO_API_URL`: endpoint de cotação. Produção padrão `https://melhorenvio.com.br/api/v2/me/shipment/calculate`; sandbox `https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: para upload de imagens no painel.

## Mercado Pago
1. Criar aplicação Mercado Pago e obter Access Token de TESTE.
2. Cadastrar `MP_ACCESS_TOKEN` de teste no ambiente Preview.
3. Em Webhooks, configurar URL `https://<URL-PREVIEW>/api/payments/mercadopago/webhook`, evento de pagamentos e copiar a assinatura secreta para `MP_WEBHOOK_SECRET`.
4. Testar Pix e cartão em sandbox. A API cria Checkout Pro Preferences e redireciona o cliente ao ambiente do Mercado Pago.
5. Somente depois de aprovar os testes, substituir pelas credenciais de produção no ambiente de produção e cadastrar o webhook de produção.

## Melhor Envio
1. Criar/autorizar integração na conta Melhor Envio.
2. Obter token OAuth para ambiente de teste/homologação e configurar `MELHORENVIO_TOKEN`.
3. Configurar `MELHORENVIO_FROM_POSTAL_CODE` com o CEP real de expedição.
4. Testar cotação com CEPs válidos e conferir peso/dimensões cadastrados nas variantes. Sem peso/dimensões, o sistema usa valores provisórios de 1 kg e 20×10×30 cm; atualizar cada produto antes de cobrar frete real.
5. Contratação de etiquetas, postagem, rastreio e confirmação de entrega ainda exigem ativação e testes adicionais no fluxo operacional Melhor Envio.

## Administrador inicial
1. Aplicar as migrações D1 `0001_v5_core.sql` e `0002_stock_availability.sql`, depois o seed `database/seeds/0002_import_119_products.sql` uma única vez.
2. Definir `ADMIN_BOOTSTRAP_TOKEN` como Secret.
3. Acessar `/admin/`, criar a primeira conta com o token e senha forte.
4. Remover `ADMIN_BOOTSTRAP_TOKEN` dos secrets após o primeiro administrador ser criado.

## Limites desta entrega
- O Checkout Pro inicia o pagamento e o webhook valida a assinatura HMAC antes de consultar o pagamento diretamente na API Mercado Pago.
- A loja não deve ser liberada em produção até os testes de pagamento, estoque concorrente, frete, dados fiscais, privacidade e notificações serem aprovados.
- O cálculo Melhor Envio depende de token, CEP de origem e dimensões/peso reais dos produtos.
- A compra só é habilitada para variantes com estoque disponível; estoque zero permanece visível e indisponível.
