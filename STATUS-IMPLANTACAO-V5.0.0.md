# WOG COMPUTER V5.0.0 — Relatório de revisão e pendências de ativação

## Escopo desta revisão

Esta revisão corrige a ligação da vitrine ao D1, elimina o catálogo JSON demonstrativo da loja ativa, disponibiliza rotas públicas de leitura do catálogo e corrige o fluxo inicial de autenticação administrativa. O pacote permanece em homologação.

## Alterações realizadas

- A loja ativa deixou de carregar `loja/catalogo-demo.json`.
- A vitrine consulta `/api/store/categories` e `/api/store/products`, com dados do D1.
- A API pública expõe somente produtos com status `ativo` ou `indisponivel`; rascunhos, inativos e arquivados não são exibidos.
- A disponibilidade é calculada pelo estoque físico menos o reservado. Estoque zero mantém o produto publicado e visível, mas indisponível.
- Adicionada consulta pública individual por slug em `/api/store/products/{slug}`.
- Corrigida a autenticação do painel para enviar e-mail e senha.
- Adicionado fluxo de configuração da primeira conta administrativa, protegido por `ADMIN_BOOTSTRAP_TOKEN`.
- Corrigida conversão do preço digitado em reais para centavos na API administrativa.
- Uploads de imagens Cloudinary agora são gravados em `product_images` após validação de URL HTTPS em `res.cloudinary.com`.
- Removido o JSON demonstrativo da pasta ativa; a cópia histórica V4 foi mantida no arquivo legado.
- Adicionadas proteções `.gitignore` para segredos e cache local Wrangler.
- Removido `.wrangler/cache/wrangler-account.json`, que não deve ser versionado/distribuído.
- Incluídas as cinco categorias principais adicionais e suas subcategorias através do SQL idempotente de expansão.

## Validação executada localmente

Sequência executada em SQLite limpo:

1. `database/migrations-v5/0001_v5_core.sql`
2. `database/migrations-v5/0002_stock_availability.sql`
3. `database/seeds/0002_import_119_products.sql`
4. `database/seeds/WOG_V5.0.0_EXPANSAO_CATEGORIAS_E_NAVEGACAO.sql`

Resultado:
- 27 categorias principais.
- 145 subcategorias.
- 119 produtos.
- 119 variantes.
- 119 imagens vinculadas.
- 119 produtos com status `indisponivel`.
- 119 variantes com estoque inicial zero e compra sob encomenda desativada.
- Preços originais preservados na importação.
- Sintaxe JavaScript validada com `node --check` para a API, script do painel e script da loja.
- ZIP original íntegro; novo pacote gerado após as alterações.

## Pendências obrigatórias antes de vendas reais

**Este pacote ainda não está pronto para receber pedidos e pagamentos reais.** A base recebida não continha implementação funcional dos seguintes fluxos; eles não foram simulados nem declarados concluídos:

1. Carrinho persistente e checkout completo.
2. Criação de pedidos e reserva/baixa de estoque com proteção contra concorrência.
3. Integração de gateway de pagamento Pix e cartão, criação de cobranças, confirmação e estorno.
4. Webhook de pagamento com validação criptográfica, idempotência e reconciliação.
5. Cotação real de frete por CEP, regras de retirada, geração de etiqueta e rastreamento.
6. Fluxo completo de conta do cliente, endereço, recuperação de acesso e LGPD.
7. Notificações transacionais por e-mail e WhatsApp.
8. Testes ponta a ponta com contas e credenciais reais em sandbox do gateway e do serviço de frete.
9. Testes de segurança, acessibilidade, carga, observabilidade e revisão final de SEO/indexação.

Não habilite compra nem configure domínio de produção até concluir essas etapas e aprovar os testes.

## Configuração inicial do administrador

No ambiente Cloudflare Pages de homologação, cadastrar o secret `ADMIN_BOOTSTRAP_TOKEN` com um valor aleatório forte. Abrir `/admin/`, preencher o token, nome, e-mail e senha com pelo menos 12 caracteres. O endpoint de bootstrap só cria a primeira conta quando ainda não existe administrador; depois disso, o bootstrap fica bloqueado.

## Secrets previstos

- `ADMIN_BOOTSTRAP_TOKEN` — criação inicial da conta.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — upload de imagens.
- Credenciais e segredo de webhook do gateway — somente depois de escolher e implementar o provedor.
- Credenciais do serviço de frete — somente depois de escolher e implementar o provedor.

Não inserir segredos no Git, no HTML, em JSON público ou em arquivos versionados.

## Observações sobre o catálogo

O seed mantém os 119 registros originais e suas categorias de origem. Produtos inicialmente indisponíveis continuam aparecendo na vitrine. O cadastro administrativo começa com o estado `Publicado · Indisponível`; ao receber estoque, a disponibilidade é recalculada automaticamente pelo banco.

A cópia em `_archive_v4` é apenas histórico e não é usada pela loja V5 ativa.


## Revisão complementar — Checkout e integrações (27/11/2026)

- Catálogo público servido pelo D1 em `/api/store/categories` e `/api/store/products`.
- Rotas públicas reposicionadas fora do bloco de logout administrativo.
- Carrinho local e tela `/loja/checkout/` adicionados.
- Checkout cria pedido e reserva estoque no D1, consultando preço/estoque no servidor.
- Integração Checkout Pro Mercado Pago por preferência, com retorno e webhook HMAC validado e consulta server-to-server do pagamento.
- Integração de cotação Melhor Envio implementada; exige token, CEP de origem e dimensões/peso cadastrados para cada variante.
- Retirada na loja mantida como opção.
- Painel passou a solicitar peso e dimensões logísticas no cadastro de produtos.
- Página de retorno `/loja/obrigado/` criada.
- Configuração de secrets documentada em `CONFIGURACAO-GATEWAYS-V5.md`.

**Limites para ativação:** credenciais de teste/produção, webhook cadastrado no painel Mercado Pago, token e CEP Melhor Envio, dimensões reais dos produtos, teste real de cotação e pagamento, emissão/compra de etiquetas e rastreamento ainda precisam ser configurados e validados. O Melhor Envio nesta entrega realiza cotação; não implementa compra automática de etiqueta nem rastreamento. Notificações por e-mail/WhatsApp e painel operacional completo de pedidos também não estão concluídos. Não liberar produção até concluir esses itens.
