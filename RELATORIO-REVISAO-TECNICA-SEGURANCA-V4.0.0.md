# WOG COMPUTER V4.0.0 — Relatório de revisão técnica e segurança

**Pacote:** homologação corrigida — revisão técnica adicional  
**Escopo:** painel administrativo, API, upload Cloudinary, migrações D1 e preservação do site institucional.

## Correções aplicadas

1. **Limite de imagens:** máximo de 5 imagens por produto no formulário e na API. Tipos aceitos: JPG, PNG e WebP; limite de 10 MB por arquivo.
2. **Sessão e logout:** logout exige sessão válida e expira o cookie administrativo. Cookie mantém `HttpOnly`, `Secure` e `SameSite=Strict`.
3. **Proteção de login:** criada a migração `0002_admin_login_protection.sql`, com controle de falhas por hash do IP, bloqueio após 5 tentativas na janela de 15 minutos e limpeza de registros antigos durante novas tentativas.
4. **Origem das requisições:** endpoints que alteram dados exigem cabeçalho `Origin` correspondente à origem do próprio site. Não foi habilitado CORS amplo.
5. **Cloudinary:** assinatura continua sendo gerada no backend; API Secret não é enviado ao navegador. A API valida que as URLs recebidas pertencem à conta Cloudinary configurada e que o identificador público não está vazio.
6. **Desempenho do painel:** URLs temporárias de pré-visualização de imagens são revogadas ao trocar a seleção e após o cadastro, reduzindo retenção desnecessária de recursos no navegador.
7. **Documentação:** pré-requisitos e passos de migração atualizados para incluir a proteção de login.

## Verificações executadas neste ambiente

- Sintaxe JavaScript da API validada com `node --check`.
- Sintaxe do JavaScript inline do painel validada com `node --check` após a alteração da pré-visualização.
- Migrações SQL `0001` e `0002` executadas em SQLite local de teste.
- Seed de categorias executado com sucesso: 119 registros.
- Slugs do seed verificados: todos seguem o padrão ASCII `a-z`, `0-9` e hífen.
- Arquivos institucionais e ativos visuais mantidos a partir do pacote de homologação de origem; não foram alterados `index.html`, `script.js`, `styles.css`, GA4, sitemap ou robots nesta revisão.

## Limitações e validações ainda obrigatórias

- Não foi possível testar autenticação real contra D1 remoto, porque o pacote não contém ID de banco nem credenciais — corretamente mantidos fora do ZIP.
- Não foi possível executar upload real na conta Cloudinary; é necessário validar no ambiente de homologação com o preset `wog_produtos_signed` existente.
- O controle de tentativas via D1 deve ser complementado por regra de rate limiting/WAF no Cloudflare para maior resiliência a ataques distribuídos.
- Ainda não há compensação automática para apagar imagens Cloudinary quando uma gravação no D1 falha.
- Ainda não existem edição/exclusão completa de produtos, vitrine ligada ao D1, carrinho, checkout, frete, pagamentos ou pedidos. Este pacote não deve ser usado para vendas reais.
- `wrangler.toml` mantém o placeholder do D1. Substituir apenas pelo ID do banco exclusivo de homologação antes de deploy; nunca apontar para produção.

## Procedimento de implantação seguro

1. Fazer upload desta revisão somente na branch `v4.0.0-homologacao`.
2. Aplicar as migrações D1 e o seed conforme `CONFIGURACAO-ETAPA3-V4.0.0.md`.
3. Configurar secrets no Cloudflare Pages, sem inseri-los no GitHub.
4. Validar login correto/incorreto, bloqueio após tentativas, sessão, logout, categorias e cadastro de produto com 1 e 5 imagens.
5. Testar também tentativa com 6 imagens, arquivo acima de 10 MB, tipo não permitido, SKU duplicado e origem diferente — todos devem ser recusados.
6. Confirmar que o site institucional, GA4 e navegação permanecem íntegros no Preview da branch.
7. Não fazer merge na `main` nem publicar em produção sem aprovação expressa.
