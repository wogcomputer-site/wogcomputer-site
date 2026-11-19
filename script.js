// ==========================================
// WOG COMPUTER - MONITORAMENTO GA4
// Versão 2.3.5
// ==========================================

// MENU RESPONSIVO
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ANO AUTOMÁTICO
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// FUNÇÃO DE MONITORAMENTO GA4
function trackGA4(eventName, parameters = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
}

// RASTREAMENTO DE CLIQUES
document.addEventListener("click", event => {
  const element = event.target.closest("a");
  if (!element) return;

  const linkText = element.innerText.trim().slice(0, 100);

  // 1. CLIQUES NO WHATSAPP
  if (element.href.includes("wa.me/")) {
    let location = "other";

    if (element.classList.contains("whatsapp-float")) {
      location = "floating_button";
    } else if (element.closest(".hero-actions")) {
      location = "hero";
    } else if (element.closest(".contact-items")) {
      location = "contact_section";
    } else if (element.closest(".equipment")) {
      location = "equipment_section";
    }

    trackGA4("whatsapp_click", {
      link_location: location,
      link_text: linkText
    });
  }

  // 2. INTERESSE EM SERVIÇOS
  const serviceCard = element.closest(".service-card");
  if (serviceCard) {
    const serviceName =
      serviceCard.dataset.serviceName ||
      serviceCard.querySelector("h3")?.textContent.trim() ||
      "Não identificado";

    trackGA4("service_interest_click", {
      service_name: serviceName,
      link_text: linkText
    });

    // Registra também a intenção de solicitar orçamento daquele serviço.
    if (element.matches("[data-service-cta]")) {
      const interestField = document.getElementById("interest");
      if (interestField) {
        interestField.value = serviceName;
      }

      trackGA4("service_quote_cta_click", {
        service_name: serviceName,
        link_text: linkText
      });
    }
  }

  // 3. CLIQUES EM SOLICITAR ORÇAMENTO
  if (element.getAttribute("href") === "#contato") {
    trackGA4("quote_cta_click", {
      button_text: linkText
    });
  }

  // 4. CLIQUES NAS REDES SOCIAIS
  const socialNetwork = element.dataset.socialNetwork;
  if (socialNetwork) {
    const socialEventNames = {
      instagram: "instagram_click",
      facebook: "facebook_click",
      linkedin: "linkedin_click"
    };

    const socialParameters = {
      social_network: socialNetwork,
      link_url: element.href,
      link_location: "header"
    };

    trackGA4("social_media_click", socialParameters);
    trackGA4(socialEventNames[socialNetwork], socialParameters);
  }
});

// 5. FORMULÁRIO DE ORÇAMENTO -> WHATSAPP
const form = document.getElementById("quote-form");

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const interest = String(data.get("interest") || "");

    // Não enviar nome, telefone, empresa ou mensagem pessoal ao GA4.
    trackGA4("quote_form_whatsapp_open", {
      form_id: "quote-form",
      interest
    });

    // Evento recomendado do GA4 para sinalizar geração de lead.
    trackGA4("generate_lead", {
      currency: "BRL",
      form_id: "quote-form",
      interest
    });

    const message = [
      "Olá! Gostaria de falar com a WOG COMPUTER.",
      `Nome: ${String(data.get("name") || "").trim()}`,
      data.get("company") ? `Empresa: ${String(data.get("company")).trim()}` : "",
      `Assunto: ${interest}`,
      data.get("message") ? `Mensagem: ${String(data.get("message")).trim()}` : ""
    ].filter(Boolean).join("\n");

    const whatsappUrl =
      "https://wa.me/5527997589719?text=" + encodeURIComponent(message);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
