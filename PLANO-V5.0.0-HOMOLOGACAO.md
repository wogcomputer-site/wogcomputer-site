# WOG COMPUTER V5.0.0 — Plano e primeira preparação de homologação

## Decisões aprovadas
- Criar banco Cloudflare D1 novo e exclusivo da V5.0.0; não reutilizar nem apagar o banco anterior.
- Importar os 119 produtos demonstrativos como rascunhos para revisão individual.
- Manter a estrutura, identidade e paleta institucional do site atual. O CSS institucional (`/styles.css`) não foi redesenhado.
- A loja recebe uma linguagem visual própria inspirada no varejo digital Magalu: azul vivo, amarelo de destaque, busca central, navegação por categorias e cards comerciais. Não é cópia de marca ou interface proprietária.
- Manter Cloudinary como serviço de imagens; as credenciais continuam somente em secrets do Cloudflare/local.
- Trabalhar em homologação e nunca apontar esta configuração para produção.

## O que esta preparação já faz
1. Congela uma cópia de referência dos principais arquivos V4 em `_archive_v4/`.
2. Cria `loja/loja-v5.css` separado do CSS institucional.
3. Atualiza a vitrine demonstrativa para a nova direção visual, sem habilitar compras.
4. Cria a migração `database/migrations-v5/0001_v5_core.sql` com base comercial e fundação RBAC.
5. Cria `database/seeds/0002_import_119_products_as_drafts.sql`, com 22 categorias, 97 subcategorias e 119 produtos.
6. Todos os produtos entram como `rascunho`, sem indexação, sem estoque e com preço operacional zerado. Valores fictícios originais permanecem no campo `import_reference_json`, apenas para consulta administrativa.
7. Configura o nome do novo D1 como `wogcomputer-v5-homologacao`, aguardando o ID real gerado no Cloudflare.
8. Mantém Cloudinary como destino de imagens e mantém o segredo da API fora do repositório.

## Atenção: não está pronto para produção
Esta entrega é a primeira preparação técnica. Ainda não implementa autenticação multiusuário funcional, painel CRUD completo, checkout, integração de pagamentos, cálculo de frete, pedidos ou notificações. A migração define a estrutura-base; o backend atual V4 ainda usa senha única e não deve ser considerado o backend V5.

## Próximas tarefas técnicas
- Criar o banco D1 novo no Cloudflare e preencher o ID somente nesta branch.
- Aplicar a migração base e validar com `wrangler d1 migrations apply`.
- Executar a importação de catálogo em transação e validar contagens.
- Implementar bootstrap seguro do primeiro superadministrador, autenticação por usuário, hash de senha, sessão revogável e RBAC.
- Implementar API de produtos com listar, visualizar, criar, editar, arquivar e auditoria.
- Ligar upload assinado ao Cloudinary e editar as imagens dos 119 rascunhos.
- Só depois desenvolver pedidos, pagamento e frete.

## Verificações esperadas após seed
- Categorias principais: 22
- Subcategorias: 97
- Produtos: 119
- Variantes: 119
- Produtos publicados/indexáveis: 0
- Preços operacionais maiores que zero: 0
- Estoque inicial: 0
