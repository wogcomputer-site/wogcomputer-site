# WOG COMPUTER V5.0.0 — relatório de revisão técnica

**Data:** 28/11/2026  
**Fonte:** arquivo `wogcomputer-site-v5.0.0-homologacao.zip` enviado nesta conversa.  
**Escopo:** revisão estática de arquivos, configuração Cloudflare, institucional/SEO, API, autenticação, D1, checkout e documentação.

## 1. Resultado executivo

O pacote tem uma base V5 consistente para homologação, mas não está pronto para produção. Foram encontradas inconsistências relevantes que poderiam bloquear a indexação da loja e oferecer boleto apesar da decisão comercial atual.

## 2. Correções feitas

1. **SEO:** `robots.txt` bloqueava toda a pasta `/loja/`, impedindo rastreamento da loja pública. Agora permite `/loja/` e mantém bloqueados painel, API, checkout e retorno.
2. **Sitemap:** continha somente a página inicial. Agora inclui a página institucional e a página principal da loja.
3. **Pagamento:** o checkout apresentava Pix, cartão de crédito e boleto. O boleto foi removido da interface, a API foi limitada a Pix e cartão e a migração que ampliava o CHECK SQL para boleto foi removida.
4. **D1/ambientes:** o binding do D1 foi colocado no ambiente `preview` do `wrangler.toml`, sem binding de produção neste arquivo. A configuração real deve ser confirmada no painel Cloudflare Pages.
5. **Limpeza:** removidos do ZIP de implantação o diretório `.git`, o arquivo histórico `_archive_v4`, protótipos demonstrativos e arquivos SQL/documentação V4 obsoletos. O histórico Git remoto não é apagado por esta limpeza do ZIP.

## 3. Institucional e descoberta no Google

- O GA4 `G-Y3W56JDHZ1` permanece no `index.html` institucional e não foi substituído.
- Metadados, canonical, dados estruturados, CSS, JavaScript, conteúdo e imagens institucionais foram preservados.
- A loja principal mantém canonical e meta robots `index,follow`.
- `robots.txt` agora permite rastreamento da loja e exclui áreas privadas/transacionais.
- `sitemap.xml` agora lista a home e a loja.

A verificação do Google Search Console por DNS/conta é externa ao ZIP. Não é possível confirmar seu estado apenas pelos arquivos. Manter o registro TXT de verificação já configurado no DNS e conferir a propriedade/sitemap no Search Console após o deploy.

## 4. Autenticação e Superadministrador

A V5 usa contas individuais, hash PBKDF2-SHA-256, sessões persistidas e revogáveis no D1, papéis/permissões e logs de auditoria. O bootstrap cria a primeira conta com e-mail informado no formulário e token `ADMIN_BOOTSTRAP_TOKEN`.

Foi feita simulação local das instruções SQL de bootstrap sobre o esquema V5: criação de 1 usuário e associação de 24 permissões concluídas. Isso não equivale a teste no Cloudflare.

O HTTP 500 observado anteriormente não pode ser atribuído com certeza somente pelo ZIP. É necessário consultar os Logs do Pages Function após o deploy Preview. Não enviar token, senha ou secrets pelo chat.

## 5. D1 e isolamento da main

O `wrangler.toml` aponta para o D1 `wogcomputer-v5-homologacao`, ID `363c0948-8132-4b75-922c-ae8cd9980610`, no ambiente `preview`. O ambiente de produção não recebe binding D1 por este arquivo.

O isolamento definitivo depende de confirmar no painel Cloudflare que:
- a branch `wog-v5.0.0-homologacao` publica como Preview;
- o D1 e os secrets de homologação estão configurados somente em Preview;
- a `main` e o ambiente Production continuam ligados às configurações atuais do site V4;
- o domínio `wogcomputer.com.br` não foi associado ao deploy Preview.

Não executar migrations iniciais ou seeds novamente no banco Preview já populado. O estado reportado pelo usuário é 119 produtos e 172 categorias.

## 6. Loja e pagamentos

O esquema SQL V5 base já limita `payments.method` a `pix` e `credit_card`. A interface e API agora refletem essa regra. A opção cartão usa o Checkout Pro; o provedor pode oferecer crédito/débito e bandeiras que estejam habilitadas na conta Mercado Pago. A disponibilidade de todas as bandeiras não pode ser garantida por código isoladamente e deve ser testada com a conta real/sandbox.

O webhook mantém validação HMAC. O frete Melhor Envio depende de token, CEP de origem e peso/dimensões reais. A retirada está prevista.

## 7. Testes executados nesta revisão

- Leitura e inventário do ZIP: 214 entradas totais antes da limpeza.
- Execução local em SQLite das migrations V5 0001/0002 e dos seeds: 119 produtos, 172 categorias e 119 variantes.
- `PRAGMA foreign_key_check`: sem violações.
- Simulação SQL do bootstrap: 1 usuário e 24 permissões associadas.
- Inspeção dos pontos de entrada e das referências a métodos de pagamento.
- Conferência de presença do GA4 institucional.

Estes são testes locais/estáticos. Não foram executados testes reais de deploy, domínio, secrets, D1 Cloudflare, Mercado Pago ou Melhor Envio.

## 8. Limitações e pendências

O painel ainda não oferece a interface completa de gestão de pedidos, clientes, financeiro, usuários/perfis e edição integral de produtos. A emissão de etiquetas/rastreamento Melhor Envio, notificações transacionais, estornos/chargebacks e reversão de estoque também precisam de fluxos específicos e homologação.

A revisão não acrescentou esses módulos, conforme solicitado. A loja não deve ser considerada pronta para operação comercial até a homologação externa e a conclusão dos fluxos operacionais pendentes.

## 9. Publicação segura

Enviar o conteúdo do ZIP para a raiz da branch `wog-v5.0.0-homologacao`. Não fazer merge na `main`, não substituir o site de produção e não configurar credenciais reais no Preview. Depois do deploy, testar primeiro status, bootstrap, login e logs; em seguida, catálogo, estoque, frete, Pix, cartão e webhooks.
