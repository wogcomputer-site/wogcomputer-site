-- WOG COMPUTER V5.0.0
-- Expansao da taxonomia comercial e navegacao da loja
-- Aplicar SOMENTE depois de 0001_v5_core.sql e do seed atual de categorias.
-- Script idempotente: INSERT OR IGNORE; nao altera produtos, precos ou estoque.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories
(id,parent_id,name,slug,description,sort_order,is_active)
VALUES
('SDC',NULL,'Servidores e Data Center','servidores-data-center','Servidores, armazenamento corporativo, racks e componentes para Data Center.',23,1),
('SEG',NULL,'Segurança eletrônica','seguranca-eletronica','Soluções de CFTV, monitoramento, controle de acesso, alarmes e sensores.',24,1),
('AUT',NULL,'Automação empresarial','automacao-empresarial','Equipamentos e acessórios para automação comercial e empresarial.',25,1),
('TEL',NULL,'Telefonia e comunicação','telefonia-comunicacao','Telefonia IP, PABX, videoconferência e comunicação corporativa.',26,1),
('SGE',NULL,'Serviços gerenciados','servicos-gerenciados','Contratos recorrentes, monitoramento e administração contínua de ambientes de TI.',27,1);

-- Servidores e Data Center
INSERT OR IGNORE INTO categories (id,parent_id,name,slug,description,sort_order,is_active) VALUES
('SDC-01','SDC','Servidores físicos','servidores-fisicos','Servidores físicos para ambientes corporativos.',1,1),
('SDC-02','SDC','Servidores em rack','servidores-em-rack','Servidores para instalação em rack.',2,1),
('SDC-03','SDC','Servidores torre','servidores-torre','Servidores em formato torre.',3,1),
('SDC-04','SDC','Storage e NAS','storage-nas','Armazenamento centralizado e compartilhado.',4,1),
('SDC-05','SDC','Racks e gabinetes','racks-gabinetes','Racks, gabinetes e organização de Data Center.',5,1),
('SDC-06','SDC','Acessórios para servidores','acessorios-servidores','Acessórios e periféricos para servidores.',6,1),
('SDC-07','SDC','Componentes para servidores','componentes-servidores','Componentes e peças para servidores.',7,1);

-- Segurança eletrônica
INSERT OR IGNORE INTO categories (id,parent_id,name,slug,description,sort_order,is_active) VALUES
('SEG-01','SEG','Câmeras IP','cameras-ip','Câmeras de rede para monitoramento.',1,1),
('SEG-02','SEG','DVR e NVR','dvr-nvr','Gravadores digitais e de rede.',2,1),
('SEG-03','SEG','Sistemas de CFTV','sistemas-cftv','Soluções completas de circuito fechado de televisão.',3,1),
('SEG-04','SEG','Controle de acesso','controle-acesso','Equipamentos e sistemas de controle de acesso.',4,1),
('SEG-05','SEG','Alarmes e sensores','alarmes-sensores','Alarmes, sensores e dispositivos de detecção.',5,1),
('SEG-06','SEG','Acessórios de monitoramento','acessorios-monitoramento','Acessórios para sistemas de monitoramento.',6,1);

-- Automação empresarial
INSERT OR IGNORE INTO categories (id,parent_id,name,slug,description,sort_order,is_active) VALUES
('AUT-01','AUT','Leitores de código de barras','leitores-codigo-barras','Leitores para identificação e captura de códigos.',1,1),
('AUT-02','AUT','Impressoras térmicas','impressoras-termicas','Impressoras térmicas para operações comerciais.',2,1),
('AUT-03','AUT','Coletores de dados','coletores-dados','Coletores móveis para operações e inventário.',3,1),
('AUT-04','AUT','Terminais de consulta','terminais-consulta','Terminais de autoatendimento e consulta.',4,1),
('AUT-05','AUT','Equipamentos para PDV','equipamentos-pdv','Equipamentos para ponto de venda.',5,1),
('AUT-06','AUT','Acessórios de automação','acessorios-automacao','Acessórios para automação comercial.',6,1);

-- Telefonia e comunicação
INSERT OR IGNORE INTO categories (id,parent_id,name,slug,description,sort_order,is_active) VALUES
('TEL-01','TEL','Telefones IP','telefones-ip','Terminais de telefonia sobre IP.',1,1),
('TEL-02','TEL','Centrais PABX','centrais-pabx','Centrais telefônicas e soluções PABX.',2,1),
('TEL-03','TEL','Telefonia corporativa','telefonia-corporativa','Soluções de telefonia para empresas.',3,1),
('TEL-04','TEL','Videoconferência','videoconferencia','Equipamentos para reuniões e colaboração por vídeo.',4,1),
('TEL-05','TEL','Equipamentos de comunicação','equipamentos-comunicacao','Equipamentos para comunicação corporativa.',5,1),
('TEL-06','TEL','Acessórios de telefonia','acessorios-telefonia','Acessórios e componentes para telefonia.',6,1);

-- Serviços gerenciados
INSERT OR IGNORE INTO categories (id,parent_id,name,slug,description,sort_order,is_active) VALUES
('SGE-01','SGE','Suporte técnico recorrente','suporte-tecnico-recorrente','Atendimento técnico contínuo por contrato.',1,1),
('SGE-02','SGE','Monitoramento de infraestrutura','monitoramento-infraestrutura','Monitoramento contínuo de servidores, redes e ativos.',2,1),
('SGE-03','SGE','Gestão de backup','gestao-backup','Administração e acompanhamento de rotinas de backup.',3,1),
('SGE-04','SGE','Gestão de segurança da informação','gestao-seguranca-informacao','Gestão contínua de controles e segurança da informação.',4,1),
('SGE-05','SGE','Administração de servidores','administracao-servidores','Administração recorrente de servidores e serviços.',5,1),
('SGE-06','SGE','Gestão de ambientes em nuvem','gestao-ambientes-nuvem','Administração contínua de ambientes em nuvem.',6,1),
('SGE-07','SGE','Gestão de ativos de TI','gestao-ativos-ti','Inventário, acompanhamento e gestão de ativos de TI.',7,1),
('SGE-08','SGE','Contratos de infraestrutura e suporte','contratos-infraestrutura-suporte','Contratos recorrentes de infraestrutura e suporte.',8,1);

-- Ampliação de Serviços de informática: preserva as cinco subcategorias atuais.
INSERT OR IGNORE INTO categories (id,parent_id,name,slug,description,sort_order,is_active) VALUES
('SER-06','SER','Infraestrutura de TI corporativa','ser-infraestrutura-ti-corporativa','Projetos e implantação de infraestrutura corporativa.',6,1),
('SER-07','SER','Servidores e Active Directory','ser-servidores-active-directory','Windows Server, domínio, Active Directory e políticas.',7,1),
('SER-08','SER','Segurança da informação','ser-seguranca-informacao','Projetos de proteção, políticas e controles de segurança.',8,1),
('SER-09','SER','Firewall, VPN e proteção de redes','ser-firewall-vpn-protecao-redes','Implantação e configuração de segurança de perímetro e acesso remoto.',9,1),
('SER-10','SER','Backup local e em nuvem','ser-backup-local-nuvem','Implantação e configuração de soluções de backup.',10,1),
('SER-11','SER','Cloud Computing','ser-cloud-computing','Implantação e configuração de ambientes em nuvem.',11,1),
('SER-12','SER','Microsoft 365','ser-microsoft-365','Implantação, configuração e administração do Microsoft 365.',12,1),
('SER-13','SER','Virtualização','ser-virtualizacao','Implantação e configuração de VMware, Hyper-V e virtualização.',13,1),
('SER-14','SER','Monitoramento de infraestrutura','ser-monitoramento-infraestrutura','Implantação de monitoramento de servidores e ativos.',14,1),
('SER-15','SER','Cabeamento estruturado','ser-cabeamento-estruturado','Projetos e implantação de cabeamento estruturado.',15,1),
('SER-16','SER','Redes corporativas','ser-redes-corporativas','Implantação e configuração de redes corporativas.',16,1),
('SER-17','SER','Gestão de TI e contratos','ser-gestao-ti-contratos','Projetos de gestão de TI e estruturação de contratos.',17,1),
('SER-18','SER','Implantação de sistemas','ser-implantacao-sistemas','Instalação e configuração de sistemas e soluções.',18,1),
('SER-19','SER','Sites e presença digital','ser-sites-presenca-digital','Criação, implantação e manutenção de sites.',19,1),
('SER-20','SER','CFTV e monitoramento eletrônico','ser-cftv-monitoramento-eletronico','Implantação e configuração de CFTV e monitoramento eletrônico.',20,1);

-- Navegação visual da loja. Os três grupos são agrupamentos de interface,
-- não categorias artificiais no catálogo.
INSERT OR REPLACE INTO store_settings (key,value_json,updated_at)
VALUES (
  'store_navigation_groups',
  '{
    "title":"LOJA WOG COMPUTER",
    "groups":[
      {
        "name":"Hardware e equipamentos",
        "description":"Computadores, notebooks, processadores, placas, memórias, armazenamento, monitores e periféricos.",
        "category_slugs":["computadores","notebooks","processadores","placas-m-e","placas-de-v-deo","mem-rias-ram","armazenamento","fontes-de-alimenta-o","gabinetes","refrigera-o","monitores","perif-ricos","impressoras-e-scanners","toners-e-suprimentos","udio-e-v-deo","gamer","ferramentas-e-manuten-o"]
      },
      {
        "name":"Infraestrutura e tecnologia",
        "description":"Redes, servidores, Data Center, segurança eletrônica, automação e telefonia.",
        "category_slugs":["redes","cabos-e-conectividade","energia-e-prote-o","servidores-data-center","seguranca-eletronica","automacao-empresarial","telefonia-comunicacao"]
      },
      {
        "name":"Serviços e soluções",
        "description":"Serviços de informática, serviços gerenciados, software e licenças.",
        "category_slugs":["servi-os-de-inform-tica","servicos-gerenciados","software-e-licen-as"]
      }
    ]
  }',
  CURRENT_TIMESTAMP
);
