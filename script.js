// ==========================================
// WOG COMPUTER - MONITORAMENTO GA4
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
      link_text: element.innerText.trim().slice(0, 100)
    });
  }

  // 2. INTERESSE EM SERVIÇOS
  const serviceCard = element.closest(".service-card");

  if (serviceCard) {
    const serviceName =
      serviceCard.querySelector("h3")?.textContent.trim() || "Não identificado";

    trackGA4("service_interest_click", {
      service_name: serviceName
    });
  }

  // 3. CLIQUES EM SOLICITAR ORÇAMENTO
  if (element.getAttribute("href") === "#contato") {
    trackGA4("quote_cta_click", {
      button_text: element.innerText.trim().slice(0, 100)
    });
  }
});

// 4. FORMULÁRIO DE ORÇAMENTO
const form = document.getElementById("quote-form");

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);

    const interest = String(data.get("interest") || "");

    // Não enviar nome, telefone, empresa ou mensagem pessoal ao GA4.
    trackGA4("quote_form_whatsapp_open", {
      form_id: "quote-form",
      interest: interest
    });

    const message = [
      "Olá! Gostaria de falar com a WOG COMPUTER.",
      `Nome: ${String(data.get("name") || "").trim()}`,
      data.get("company") ? `Empresa: ${data.get("company")}` : "",
      `Assunto: ${interest}`,
      data.get("message") ? `Mensagem: ${data.get("message")}` : ""
    ].filter(Boolean).join("\n");

    window.open(
      "https://wa.me/5527997589719?text=" +
      encodeURIComponent(message),
      "_blank",
      "noopener"
    );
  });
}
