# WOG COMPUTER — versão 2
Site institucional estático com fotos enviadas pelo cliente, logo (recortada para remover contatos antigos impressos na imagem), endereço, mapa e WhatsApp atualizado.

## Dados usados
- WhatsApp: +55 27 99758-9719
- E-mail: wogcomputer@yahoo.com.br
- Endereço: Rua Jânio Quadros, 246, Jucutuquara, Vitória-ES, CEP 29040-675
- Domínio pretendido: wogcomputer.com.br (não conectado)

## Publicar temporariamente no Cloudflare Pages sem alterar DNS
1. Descompacte este pacote.
2. Crie um repositório GitHub chamado `wogcomputer-site-v2` e envie todos os arquivos/pastas para a raiz.
3. No Cloudflare Dashboard, abra Workers & Pages > Create application > Pages > Connect to Git.
4. Autorize o GitHub e escolha o repositório.
5. Configure Framework preset: None; Build command: vazio; Build output directory: `/` ou `.` conforme o painel.
6. Publique e use o endereço temporário `*.pages.dev` para revisar.
7. Não adicione `wogcomputer.com.br` nem altere nameservers/DNS da Locaweb nesta fase.

## Revisões antes da publicação definitiva
- Confirmar se endereço e telefone estão corretos.
- Confirmar que as imagens representam a loja/estrutura e podem ser usadas publicamente.
- Conferir o pin do mapa: o mapa é uma busca pelo endereço digitado e pode precisar de confirmação da localização exata.
- Revisar textos e serviços efetivamente oferecidos.
- Criar política de privacidade se forem adicionados formulários que armazenem dados.
- Revisar metadados e SEO após definir o domínio final.

O formulário apenas prepara uma mensagem no WhatsApp; não armazena nem transmite dados a um banco de dados.
