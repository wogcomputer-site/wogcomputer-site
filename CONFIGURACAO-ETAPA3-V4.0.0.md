# WOG COMPUTER V4.0.0 — Etapa 3: Painel e integração Cloudinary

## O que foi implementado no pacote de homologação
- Painel em `/admin/`, com login por senha guardada em segredo do Cloudflare.
- Sessão assinada com HMAC, cookie `HttpOnly`, `Secure` e `SameSite=Strict`, validade de 8 horas.
- Limite de tentativas de login: até 5 falhas por janela de 15 minutos por IP (hash do IP armazenado no D1); falhas antigas são limpas periodicamente durante novas tentativas.
- Verificação de origem (`Origin`) para requisições que alteram dados; logout exige sessão válida.
- Validação no servidor para URLs e identificadores de imagens da conta Cloudinary configurada.
- API em Cloudflare Pages Functions (`/api/*`).
- Consulta de categorias/subcategorias no D1.
- Formulário para nome, SKU, categoria, subcategoria, marca, modelo, custo, preço, estoque, status e descrições.
- Seleção de no máximo 5 imagens JPG, PNG ou WebP, máximo de 10 MB por arquivo; a interface e a API aplicam o mesmo limite.
- Assinatura de upload gerada no backend; o navegador envia o arquivo diretamente ao Cloudinary sem receber o API Secret.
- Gravação de produto, variante/SKU e referências das imagens no D1.
- Lista administrativa de produtos cadastrados.
- Seed com as categorias e subcategorias já definidas no catálogo da homologação.

## Limites desta etapa
- Ainda não há edição, exclusão, duplicação, gestão avançada de estoque, pedidos, carrinho ou checkout.
- Os produtos cadastrados não são automaticamente publicados no catálogo público. A opção `Ativo` registra o status no banco, mas a vitrine continuará em modo demonstrativo até a próxima etapa de integração e validação.
- A exclusão de imagens no Cloudinary não está automatizada. As referências `public_id` ficam gravadas para permitir gestão posterior.
- O upload ocorre no Cloudinary antes da gravação no D1; se o cadastro no banco falhar, pode ser necessário remover manualmente o arquivo órfão. Uma rotina de compensação será adicionada em etapa posterior.
- O login usa uma senha administrativa única configurada como segredo. A aplicação inclui bloqueio por IP via D1; recomenda-se complementar com regra de rate limiting no Cloudflare antes de uso público.

## Pré-requisitos de implantação
1. Criar um banco D1 exclusivo de homologação.
2. Aplicar as migrações `database/migrations/0001_v4_admin.sql` e `database/migrations/0002_admin_login_protection.sql` (o comando de migrations do Wrangler aplica as migrações pendentes em ordem).
3. Aplicar `database/seed-categories-v4.sql`.
4. Configurar binding D1 com o nome `DB` no projeto Pages.
5. Configurar secrets `ADMIN_PASSWORD`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
6. Configurar o preset Cloudinary `wog_produtos_signed` como Signed. A integração inclui esse preset no upload assinado.
7. Publicar somente a branch de homologação e validar `/admin/` e upload de ponta a ponta.

## Segurança
- Nunca salvar `.dev.vars`, API Secret ou senha no Git.
- Nunca colocar API Secret em HTML/JS público.
- O endpoint de assinatura exige sessão administrativa.
- O banco e os segredos devem ser exclusivos da homologação até aprovação expressa para produção.

## Configuração no Cloudflare (homologação)

1. No Cloudflare, crie um banco **D1** chamado `wogcomputer-loja-homologacao`.
2. Copie o UUID do banco e substitua `PREENCHER_COM_O_ID_DO_D1` em `wrangler.toml`.
3. No projeto Pages ligado à branch de homologação, configure o binding D1 com variável `DB` apontando para esse banco. Não reutilize banco de produção.
4. Aplique a migração e o seed no banco de homologação. Com Wrangler autenticado e o projeto configurado:
   - `npx wrangler d1 migrations apply wogcomputer-loja-homologacao --remote` (aplica 0001 e 0002 em ordem)
   - `npx wrangler d1 execute wogcomputer-loja-homologacao --remote --file=database/seed-categories-v4.sql`
5. Cadastre os secrets no projeto Pages (não em arquivos versionados): `ADMIN_PASSWORD`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`.
   - `npx wrangler pages secret put ADMIN_PASSWORD --project-name NOME-DO-PROJETO`
   - Repita o comando para cada secret, informando o valor no prompt seguro.
6. Confirme que o preset `wog_produtos_signed` está como **Signed** no Cloudinary.
7. Faça o deploy somente da branch de homologação. Abra `/admin/`, autentique e cadastre um produto de teste com status `Rascunho` e uma imagem não comercial.
8. Confira o registro no D1 e o arquivo no Cloudinary. Só depois teste um segundo cadastro com várias imagens.

**Importante:** o arquivo `wrangler.toml` contém um identificador de D1 propositalmente pendente. A implantação não estará funcional até criar o D1, preencher o ID, configurar o binding e cadastrar os secrets. Não envie API Secret ou senha por mensagem, captura de tela, GitHub ou arquivo público.


## Pendências de segurança e validação antes de uso
- A proteção de login depende da migração `0002_admin_login_protection.sql`; confirme que ela foi aplicada no D1 de homologação.
- A verificação de origem exige que o navegador acesse a API pelo mesmo domínio do painel; não habilite CORS amplo.
- Revisar e testar uma política CSP compatível com os recursos externos efetivamente usados antes de disponibilizar o painel externamente.
- Validar integralmente a assinatura e o comportamento de pastas do preset `wog_produtos_signed` no Cloudinary real.
- Definir compensação/limpeza de imagens Cloudinary quando o registro no D1 falhar, para evitar arquivos órfãos.
- Executar testes de integração no ambiente de homologação após configurar D1 e secrets. O código não foi validado contra uma conta Cloudinary/D1 real nesta entrega.
