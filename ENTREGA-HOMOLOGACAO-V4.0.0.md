# WOG COMPUTER — V4.0.0 | Pacote consolidado de homologação

## Objetivo
Este pacote consolida o site institucional V3.0.0, o catálogo demonstrativo da loja e a primeira versão do painel administrativo com integração de assinatura de upload Cloudinary, para continuidade dos testes na branch `v4.0.0-homologacao`.

## Ajustes incluídos nesta consolidação
- Limite de **5 imagens por produto** aplicado no formulário administrativo e validado também pela API.
- Correção do endpoint de logout para enviar o cookie de expiração no argumento correto da resposta HTTP.
- Preservação dos arquivos institucionais, identidade visual, GA4, assets, domínio e relatórios anteriores.
- Documentação reunida para configuração local e preparação do ambiente Cloudflare.

## Estado real desta versão
**Esta entrega é um pacote de homologação técnica em desenvolvimento; não é uma loja pronta para receber pedidos reais.**

Ainda não estão implementados/validados como fluxo comercial:
- publicação automática dos produtos do D1 na vitrine pública;
- edição, exclusão, arquivamento e gestão completa de produtos;
- carrinho e checkout transacional;
- integração de pagamento Pix/cartão e confirmação por webhook;
- cálculo real de frete por CEP e rastreamento;
- geração e gestão de pedidos;
- notificações transacionais por e-mail e WhatsApp;
- política operacional de estoque, devolução e expedição.

Os produtos e preços presentes em `loja/catalogo-demo.json` são demonstrativos, indisponíveis e não devem ser tratados como oferta comercial real.

## Configuração obrigatória antes de executar
1. Criar o banco Cloudflare D1 de homologação.
2. Aplicar as migrações SQL na ordem documentada e conferir a compatibilidade entre schema, migration e seed.
3. Substituir o placeholder `PREENCHER_COM_O_ID_DO_D1` no `wrangler.toml` pelo ID real do banco de homologação.
4. Configurar os segredos no ambiente Cloudflare: `ADMIN_PASSWORD`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`.
5. Nunca incluir `.dev.vars` com segredos no Git ou no ZIP compartilhado.
6. Confirmar o preset assinado `wog_produtos_signed` e a pasta base `WOG-COMPUTER/PRODUTOS` no Cloudinary.

## Testes mínimos de homologação
- login válido e inválido;
- sessão, expiração e logout;
- bloqueio de acesso às rotas administrativas sem sessão;
- listagem de categorias;
- upload com 1 e 5 imagens;
- rejeição de 6 imagens pela interface e pela API;
- rejeição de arquivos não permitidos e imagens acima de 10 MB;
- criação de produto com SKU válido e rejeição de SKU duplicado;
- falha controlada quando D1 ou Cloudinary não estiver configurado;
- conferir logs do Pages Functions e consistência dos registros no D1.

## Segurança e produção
Não publicar este pacote em `main` nem apontar para produção. Usar exclusivamente a branch e o projeto Cloudflare de homologação. Revisar rate limiting, proteção contra tentativas repetidas de login, validação de origem/CSRF, política CSP, validação de uploads e limpeza de imagens órfãs antes de qualquer exposição pública do painel.

## Próxima etapa
Concluir auditoria e testes do painel; depois implementar a publicação real do catálogo e os módulos de carrinho, checkout, pagamentos, frete e pedidos. Só então avaliar a liberação comercial.
