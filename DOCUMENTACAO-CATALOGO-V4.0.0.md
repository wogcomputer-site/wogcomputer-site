# WOG COMPUTER V4.0.0 — Catálogo demonstrativo / Etapa 2

## Escopo implementado
- 22 categorias e 97 subcategorias hierárquicas.
- 119 cadastros demonstrativos: um produto de referência por categoria e um exemplo por subcategoria.
- 22 imagens originais geradas para o catálogo; os produtos de subcategorias reutilizam a imagem representativa da categoria correspondente.
- SKU sugerido no padrão `WOG-<CATEGORIA>-<SEQUENCIAL>`, por exemplo `WOG-COM-0001`, `WOG-NOTE-0002`, `WOG-ARM-0007`.
- Todos os produtos estão `indisponivel`, com estoque zero, sem venda, sem compra e sem indexação.
- Preços são fictícios/ilustrativos para demonstrar preenchimento e formatação. Não são cotação, preço real, disponibilidade ou oferta.
- Página pública de catálogo em `/loja/` com pesquisa, filtro por categoria e subcategoria.
- Protótipo visual de administração em `prototipos/painel-catalogo-demo.html`.
- Modelo inicial de banco relacional SQLite/Cloudflare D1 em `database/schema-v4.0.0.sql`.

## Categorias e subcategorias

### Computadores (`COM`)
Desktops, PCs montados e All-in-One
- PC Gamer
- PC Escritório
- PC Workstation
- PC doméstico
- All-in-One
- Mini PCs

### Notebooks (`NOTE`)
Notebooks, ultrabooks e Chromebooks
- Notebooks tradicionais
- Ultrabooks
- Chromebooks
- Notebooks Gamer
- Notebooks corporativos

### Processadores (`PROC`)
Processadores Intel, AMD e compatíveis
- Intel Core
- AMD Ryzen
- Processadores para servidor

### Placas-mãe (`PLM`)
Placas ATX, Micro ATX e Mini ITX
- ATX
- Micro ATX
- Mini ITX
- Placas para Intel
- Placas para AMD

### Placas de vídeo (`GPU`)
GPUs e placas gráficas
- GeForce
- Radeon
- Placas profissionais
- Placas de entrada

### Memórias RAM (`RAM`)
Memórias DDR3, DDR4, DDR5 e notebook
- DDR3 desktop
- DDR4 desktop
- DDR5 desktop
- Memória para notebook

### Armazenamento (`ARM`)
SSD, NVMe, HD e unidades removíveis
- SSD SATA
- SSD NVMe M.2
- HD interno
- HD externo
- Pen drives
- Cartões de memória

### Fontes de alimentação (`FNT`)
Fontes ATX e acessórios de energia
- Fontes ATX
- Fontes modulares
- Fontes SFX
- Cabos de energia

### Gabinetes (`GAB`)
Cases, chassis e acessórios
- Mid Tower
- Full Tower
- Mini Tower
- Gabinetes compactos

### Refrigeração (`REF`)
Coolers, water coolers e ventoinhas
- Cooler para CPU
- Water Cooler
- Fans
- Pasta térmica

### Monitores (`MON`)
Monitores, telas e acessórios
- Monitores Full HD
- Monitores QHD/4K
- Monitores Gamer
- Suportes e braços

### Periféricos (`PER`)
Mouse, teclado, headset e webcam
- Teclados
- Mouses
- Headsets
- Webcams
- Controles

### Impressoras e scanners (`IMP`)
Impressoras, multifuncionais e scanners
- Jato de tinta
- Laser
- Multifuncionais
- Scanners

### Toners e suprimentos (`TON`)
Tintas, cartuchos, toners e papel
- Toners
- Cartuchos
- Refis de tinta
- Papéis

### Redes (`RED`)
Roteadores, switches e access points
- Roteadores
- Switches
- Access points
- Adaptadores de rede
- Equipamentos corporativos

### Cabos e conectividade (`CAB`)
HDMI, USB, rede e adaptadores
- Cabos HDMI
- Cabos USB
- Cabos de rede
- Adaptadores
- Hubs e docks

### Energia e proteção (`ENE`)
Nobreaks, estabilizadores e filtros
- Nobreaks
- Estabilizadores
- Filtros de linha
- Protetores

### Áudio e vídeo (`AUD`)
Caixas de som, microfones e webcams
- Caixas de som
- Microfones
- Webcams
- Captura de vídeo

### Gamer (`GAM`)
Cadeiras, acessórios e controles
- Cadeiras Gamer
- Controles
- Acessórios Gamer
- Mousepads

### Ferramentas e manutenção (`FER`)
Ferramentas, limpeza e reparo
- Kits de ferramentas
- Limpeza técnica
- Acessórios de bancada
- Organização

### Software e licenças (`SOF`)
Sistemas, aplicativos e licenças
- Sistemas operacionais
- Antivírus
- Produtividade
- Licenças empresariais

### Serviços de informática (`SER`)
Manutenção, instalação, suporte e consultoria
- Manutenção de computadores
- Instalação e configuração
- Suporte técnico
- Consultoria de TI
- Infraestrutura e redes

## Codificação de produtos (SKU)
Formato proposto: `WOG-<SIGLA DA CATEGORIA>-<NÚMERO SEQUENCIAL>`.
- `WOG`: identifica a WOG COMPUTER.
- Sigla: código fixo de 3 a 4 letras da categoria.
- Sequencial: quatro dígitos, único e não reutilizável.
- Variações devem ter SKU próprio, mantendo o produto-pai como agrupador.
- Não incluir preço, estoque, cor ou status no SKU, pois esses dados podem mudar.

## Campos de cadastro previstos
Dados gerais, preço, estoque e movimentações, galeria de imagens, ficha técnica dinâmica por categoria, variações/SKUs, dimensões e peso, garantia, SEO e status. Os campos estão exemplificados no arquivo `loja/catalogo-demo.json` e o modelo relacional está em `database/schema-v4.0.0.sql`.

## Importante — o que ainda não é funcional
Este pacote contém um catálogo demonstrativo estático. O painel é somente um protótipo visual, sem autenticação ou gravação. Não existe backend, banco D1 conectado, checkout, gateway Pix/cartão, frete ou gestão real de pedidos. Não usar dados reais nem publicar o protótipo como painel operacional. A próxima fase deve implementar autenticação, API, persistência, validação de preço/estoque no servidor e permissões administrativas.

## Regras comerciais já aprovadas
- Checkout futuro: Pix e cartão somente.
- Boleto não integra o checkout da loja.
- Retirada: Rua Jânio Quadros, 246 — Jucutuquara, Vitória/ES — CEP 29040-675.
- Todos os itens desta demonstração permanecem indisponíveis.
