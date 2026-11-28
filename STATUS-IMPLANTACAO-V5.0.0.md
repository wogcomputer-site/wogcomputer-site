# WOG COMPUTER V5.0.0 — status da revisão

**Estado: pacote corrigido para nova homologação em Preview. Não aprovado para produção.**

## Correções aplicadas no ZIP

- Preservado o site institucional e seu GA4 existente `G-Y3W56JDHZ1`.
- Corrigido `robots.txt`: a loja pública `/loja/` agora pode ser rastreada; `/admin/`, `/api/`, checkout e retorno continuam bloqueados.
- Corrigido `sitemap.xml`: inclui página institucional e página principal da loja.
- Checkout apresenta somente Pix e cartão de crédito/débito.
- API aceita somente `pix` e `credit_card`; qualquer outro valor recebido é normalizado para Pix, sem criar pagamento por boleto.
- Removida a migração que ampliava o banco para aceitar boleto.
- `wrangler.toml` limita o binding D1 ao ambiente `preview`.
- Removidos arquivos V4, protótipos e metadados Git antigos do pacote limpo; histórico continua no Git remoto.

## Estado do banco

O esquema V5 base restringe `payments.method` a `pix` e `credit_card`. Em teste local, migrations e seeds executaram em SQLite limpo, resultando em 119 produtos, 172 categorias e 119 variantes; `PRAGMA foreign_key_check` não apontou violações. O fluxo SQL de bootstrap foi simulado com as tabelas locais e inseriu 1 usuário Master e 24 permissões.

O D1 Preview real não foi alterado por esta revisão. Não reaplicar migrations ou seeds no banco já populado.

## Configurações institucionais preservadas

- GA4: `G-Y3W56JDHZ1`.
- Metadados, canonical e dados estruturados da página institucional.
- `robots.txt` e `sitemap.xml` revisados para não bloquear a loja.
- O Search Console e sua verificação DNS são externos ao ZIP; manter o registro TXT já configurado. O ZIP não contém nem substitui essa verificação.

## Pendências que dependem do ambiente externo

- Confirmar no Cloudflare que a branch de homologação é Preview e que o D1/secrets de produção não foram compartilhados.
- Testar o deploy e os endpoints `/api/admin/status`, bootstrap, login, logout e sessão.
- Investigar o HTTP 500 anterior nos Logs do Cloudflare. O código não permite determinar a exceção histórica sem o log do ambiente.
- Testar Pix, cartões de crédito/débito e bandeiras habilitadas na conta Mercado Pago com credenciais de teste e webhook.
- Testar Melhor Envio com token, CEP de origem e dimensões/peso reais.
- Concluir homologação operacional de pedidos, clientes, financeiro, gestão de usuários/perfis, edição integral de produtos, notificações, estornos e reversão de estoque.

**Importante:** esta entrega corrige inconsistências encontradas no projeto; não cria as telas/rotinas ainda ausentes. Não declarar a loja pronta para venda até as pendências acima serem aprovadas.
