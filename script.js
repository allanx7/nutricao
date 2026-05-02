/* =========================================================
   Basic settings
   ========================================================= */

// Update this number with the real WhatsApp business number (country code + DDD + number).
const WHATSAPP_NUMBER = "5511999999999";

/* =========================================================
   WhatsApp helpers
   ========================================================= */

// Creates the WhatsApp URL using encodeURIComponent as requested.
function createWhatsAppUrl(messageText) {
  const encodedMessage = encodeURIComponent(messageText);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Converts yyyy-mm-dd to dd/mm/yyyy for a friendlier message.
function formatDateToBr(dateValue) {
  if (!dateValue) return "data a combinar";

  const [year, month, day] = dateValue.split("-");
  if (!year || !month || !day) return dateValue;

  return `${day}/${month}/${year}`;
}

// Main function requested: reads form values and redirects to WhatsApp.
function sendToWhatsApp(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const data = formatDateToBr(document.getElementById("data").value);
  const mensagemExtra = document.getElementById("mensagem").value.trim();

  const mensagemBase = `Olá, meu nome é ${nome}. Gostaria de agendar uma consulta para o dia ${data}.`;
  const mensagemCompleta = mensagemExtra
    ? `${mensagemBase} Meu telefone: ${telefone}. Mensagem: ${mensagemExtra}`
    : `${mensagemBase} Meu telefone: ${telefone}.`;

  const whatsappUrl = createWhatsAppUrl(mensagemCompleta);

  // Redirects user to WhatsApp chat.
  window.location.href = whatsappUrl;
}

// Sets default text for quick WhatsApp buttons (hero + floating button).
function setupQuickWhatsAppLinks() {
  const quickMessage = "Olá, quero melhorar minha saúde e gostaria de agendar uma consulta.";
  const quickUrl = createWhatsAppUrl(quickMessage);

  document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
    link.setAttribute("href", quickUrl);
  });
}

/* =========================================================
   Fade-in on scroll
   ========================================================= */

function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");

  // If user prefers reduced motion, show everything immediately.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  // Fallback for older browsers.
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

/* =========================================================
   Startup
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setupQuickWhatsAppLinks();
  setupRevealOnScroll();

  const agendamentoForm = document.getElementById("agendamento-form");
  if (agendamentoForm) {
    agendamentoForm.addEventListener("submit", sendToWhatsApp);
  }
});


