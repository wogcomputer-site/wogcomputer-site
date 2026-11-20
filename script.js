// ======================================================
// WOG COMPUTER - INTELIGÊNCIA COMERCIAL E MONITORAMENTO
// Versão 3.0.0 - Homologação
// Google Analytics 4
// ======================================================


// ======================================================
// 1. CONFIGURAÇÕES GERAIS
// ======================================================

const WOG_CONFIG = {
  whatsappNumber: "5527997589719",
  measurementId: "G-Y3W56JDHZ1",
  sectionThreshold: 0.40,
  trackSectionsOnce: true
};


// ======================================================
// 2. MENU RESPONSIVO
// ======================================================

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Fechar menu" : "Abrir menu"
    );
  });

  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });

  });
}


// ======================================================
// 3. ANO AUTOMÁTICO
// ======================================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


// ======================================================
// 4. IDENTIFICAÇÃO DAS SEÇÕES DO SITE
// ======================================================

const sectionNames = {
  inicio: "Página inicial",
  empresa: "A empresa",
  solucoes: "Soluções",
  estrutura: "Nossa estrutura",
  equipamentos: "Equipamentos",
  contato: "Contato e orçamento"
};

const sections = Array.from(
  document.querySelectorAll("main > section")
);

function getSectionName(section) {

  if (section.id && sectionNames[section.id]) {
    return sectionNames[section.id];
  }

  if (section.classList.contains("process")) {
    return "Como podemos ajudar";
  }

  if (section.classList.contains("map-section")) {
    return "Localização";
  }

  return section.id || "Seção não identificada";
}


// ======================================================
// 5. IDENTIFICAÇÃO DA ORIGEM DO VISITANTE
// ======================================================

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
];

function getAttribution() {

  const params = new URLSearchParams(window.location.search);
  const attribution = {};

  attributionKeys.forEach(key => {

    const value = params.get(key);

    if (value) {
      attribution[key] = value.slice(0, 200);
    }

  });

  // Preserva a origem da campanha durante a sessão.
  try {

    const stored = sessionStorage.getItem(
      "wog_ga4_attribution"
    );

    if (Object.keys(attribution).length > 0) {

      sessionStorage.setItem(
        "wog_ga4_attribution",
        JSON.stringify(attribution)
      );

    } else if (stored) {

      return JSON.parse(stored);

    }

  } catch (error) {
    // O monitoramento continua mesmo sem sessionStorage.
  }

  return attribution;
}

const visitorAttribution = getAttribution();


// ======================================================
// 6. FUNÇÃO CENTRAL DE ENVIO AO GOOGLE ANALYTICS
// ======================================================

function trackGA4(eventName, parameters = {}) {

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    ...parameters,
    ...visitorAttribution
  });

}


// ======================================================
// 7. MONITORAMENTO DE VISUALIZAÇÃO DAS SEÇÕES
// ======================================================

if ("IntersectionObserver" in window) {

  const observedSections = new Set();

  const sectionObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const section = entry.target;

        if (
          WOG_CONFIG.trackSectionsOnce &&
          observedSections.has(section.id || section.className)
        ) {
          return;
        }

        const sectionKey =
          section.id || section.className;

        observedSections.add(sectionKey);

        trackGA4("section_view", {
          section_id: section.id || sectionKey,
          section_name: getSectionName(section),
          section_position: sections.indexOf(section) + 1
        });

      });

    },
    {
      threshold: WOG_CONFIG.sectionThreshold
    }
  );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

}


// ======================================================
// 8. FUNÇÕES AUXILIARES DE RASTREAMENTO
// ======================================================

function getLinkText(element) {

  return (
    element.innerText ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    "Link sem identificação"
  ).trim().slice(0, 100);

}


function getServiceName(element) {

  const card = element.closest(".service-card");

  if (!card) return "";

  return (
    card.dataset.serviceName ||
    card.querySelector("h3")?.textContent.trim() ||
    "Não identificado"
  );

}


function getLinkLocation(element) {

  if (element.classList.contains("whatsapp-float")) {
    return "floating_button";
  }

  if (element.closest(".hero-actions")) {
    return "hero";
  }

  if (element.closest(".contact-items")) {
    return "contact_section";
  }

  if (element.closest(".equipment")) {
    return "equipment_section";
  }

  if (element.closest(".service-card")) {
    return "service_section";
  }

  if (element.closest(".nav")) {
    return "header";
  }

  if (element.closest(".footer")) {
    return "footer";
  }

  return "other";
}


// ======================================================
// 9. MONITORAMENTO DE CLIQUES NO SITE
// ======================================================

document.addEventListener("click", event => {

  const target = event.target;

  if (!(target instanceof Element)) return;

  const element = target.closest("a");

  if (!element) return;

  const linkText = getLinkText(element);
  const linkLocation = getLinkLocation(element);
  const serviceName = getServiceName(element);
  const href = element.getAttribute("href") || "";


  // ----------------------------------------------------
  // 9.1 WHATSAPP
  // ----------------------------------------------------

  const isWhatsApp =
    /wa\.me\/|api\.whatsapp\.com\/|whatsapp\.com\/send/i
      .test(element.href);

  if (isWhatsApp) {

    trackGA4("whatsapp_click", {
      link_location: linkLocation,
      link_text: linkText,
      service_name: serviceName || undefined
    });

  }


  // ----------------------------------------------------
  // 9.2 INTERESSE EM SERVIÇOS
  // ----------------------------------------------------

  if (serviceName) {

    trackGA4("service_interest_click", {
      service_name: serviceName,
      link_text: linkText,
      link_location: linkLocation
    });


    // Clique específico para solicitar avaliação/orçamento.

    if (element.hasAttribute("data-service-cta")) {

      const interestField =
        document.getElementById("interest");

      if (interestField) {
        interestField.value = serviceName;
      }

      trackGA4("service_quote_cta_click", {
        service_name: serviceName,
        link_text: linkText
      });

    }

  }


  // ----------------------------------------------------
  // 9.3 BOTÕES DE SOLICITAÇÃO DE ORÇAMENTO
  // ----------------------------------------------------

  if (href.split("?")[0] === "#contato") {

    trackGA4("quote_cta_click", {
      button_text: linkText,
      link_location: linkLocation,
      service_name: serviceName || undefined
    });

  }


  // ----------------------------------------------------
  // 9.4 NAVEGAÇÃO INTERNA DO MENU
  // ----------------------------------------------------

  if (
    element.closest(".nav") &&
    href.startsWith("#")
  ) {

    trackGA4("navigation_click", {
      navigation_item: linkText,
      destination_section: href.substring(1)
    });

  }


  // ----------------------------------------------------
  // 9.5 REDES SOCIAIS
  // ----------------------------------------------------

  const socialNetwork =
    element.dataset.socialNetwork;

  if (socialNetwork) {

    trackGA4("social_media_click", {
      social_network: socialNetwork,
      link_location: linkLocation,
      link_text: linkText
    });

  }


  // ----------------------------------------------------
  // 9.6 CLIQUES EM E-MAIL
  // ----------------------------------------------------

  if (href.toLowerCase().startsWith("mailto:")) {

    trackGA4("email_click", {
      link_location: linkLocation,
      link_text: linkText
    });

  }


  // ----------------------------------------------------
  // 9.7 DIRECIONAMENTO PARA GOOGLE MAPS
  // ----------------------------------------------------

  if (
    /google\.[^/]+\/maps|maps\.google\./i.test(element.href)
  ) {

    trackGA4("map_directions_click", {
      link_location: linkLocation,
      link_text: linkText
    });

  }

});


// ======================================================
// 10. MONITORAMENTO DO FORMULÁRIO DE ORÇAMENTO
// ======================================================

const form = document.getElementById("quote-form");

if (form) {

  // Identifica o início da interação com o formulário.

  let formStarted = false;

  form.addEventListener("focusin", () => {

    if (formStarted) return;

    formStarted = true;

    trackGA4("quote_form_start", {
      form_id: "quote-form"
    });

  });


  // Processamento do formulário.

  form.addEventListener("submit", event => {

    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const interest = String(
      data.get("interest") || ""
    ).trim();

    const name = String(
      data.get("name") || ""
    ).trim();

    const company = String(
      data.get("company") || ""
    ).trim();

    const messageText = String(
      data.get("message") || ""
    ).trim();


    // IMPORTANTE:
    // Dados pessoais não são enviados ao GA4.
    // Nome, empresa, telefone e mensagem permanecem
    // somente no WhatsApp, fora dos parâmetros analíticos.


    // Evento de formulário encaminhado ao WhatsApp.

    trackGA4("quote_form_whatsapp_open", {
      form_id: "quote-form",
      service_name: interest,
      lead_channel: "whatsapp"
    });


    // Montagem da mensagem comercial.

    const message = [
      "Olá! Gostaria de falar com a WOG COMPUTER.",
      `Nome: ${name}`,
      company ? `Empresa: ${company}` : "",
      `Assunto: ${interest}`,
      messageText ? `Mensagem: ${messageText}` : ""
    ].filter(Boolean).join("\n");


    const whatsappUrl =
      "https://wa.me/" +
      WOG_CONFIG.whatsappNumber +
      "?text=" +
      encodeURIComponent(message);


    // Abre o WhatsApp em nova aba.

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

  });

}


// ======================================================
// 11. REGISTRO DE INTERESSE EM EQUIPAMENTOS
// ======================================================

// A seção de equipamentos possui um botão direto
// para o WhatsApp. O evento whatsapp_click já registra
// essa interação e identifica sua localização.


// ======================================================
// 12. CONCLUSÃO DA INICIALIZAÇÃO
// ======================================================

console.info(
  "WOG COMPUTER v3.0.0: monitoramento comercial inicializado."
);

console.info(
  "Seções monitoradas:",
  sections.length
);

console.info(
  "GA4:",
  WOG_CONFIG.measurementId
);
