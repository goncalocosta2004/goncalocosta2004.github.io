// Atualizar ano no footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Menu mobile
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("open");
  });

  // Fechar menu ao clicar num link
  navList.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      navList.classList.remove("open");
    }
  });
}

// Ativar link de navegação conforme secção visível
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function onScrollHighlightNav() {
  const scrollPos = window.scrollY || window.pageYOffset;

  sections.forEach((section) => {
    const offsetTop = section.offsetTop - 90;
    const offsetBottom = offsetTop + section.offsetHeight;

    if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}

window.addEventListener("scroll", onScrollHighlightNav);

// Botão "voltar ao topo"
const scrollTopBtn = document.querySelector(".scroll-top");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = "flex";
      scrollTopBtn.style.opacity = "1";
    } else {
      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.display = "none";
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Formulário de contacto com envio assíncrono para evitar redirecionamento
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formFeedback.textContent = "A enviar...";
    formFeedback.style.color = "#444";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formFeedback.textContent = "Obrigado pela sua mensagem. Entraremos em contacto brevemente.";
        formFeedback.style.color = "#2e7d32";
        contactForm.reset();
      } else {
        formFeedback.textContent = "Não foi possível enviar a mensagem. Tente novamente mais tarde.";
        formFeedback.style.color = "#b00020";
      }
    } catch (error) {
      formFeedback.textContent = "Ocorreu um erro de ligação. Verifique a sua internet e tente de novo.";
      formFeedback.style.color = "#b00020";
    }

    setTimeout(() => {
      formFeedback.textContent = "";
    }, 6000);
  });
}

// Botões de marcação dos terapeutas
const bookingButtons = document.querySelectorAll(".booking-btn");

// Mapa de terapeutas com links de marcação (configure aqui os links dos terapeutas)
const therapistBookingLinks = {
  "Elsa Costa": "https://buk.pt/ama-te-espaco-terapeutico/elsa-costa-ama-te-espaco-terapeutico",
  "Ana Ferreira": "https://buk.pt/ama-te-espaco-terapeutico/elsa-costa-ama-te-espaco-terapeutico",
  "Bruno Silva": "https://api.whatsapp.com/qr/LMOFJWEK2IWZO1?autoload=1&app_absent=0",
  "Sylvie Santos": "https://api.whatsapp.com/message/UOZGWUCW46L7D1?autoload=1&app_absent=0",
  "Cristina Parii": "https://buk.pt/ama-te-espaco-terapeutico/cristina-parii",
  "João Castro": "https://buk.pt/ama-te-espaco-terapeutico/joao-castro",
  "Patrícia Robalo": "https://api.whatsapp.com/send/?phone=966753083&text&type=phone_number&app_absent=0",
};

bookingButtons.forEach((btn) => {
  const therapist = btn.getAttribute("data-therapist");
  const bookingLink = therapistBookingLinks[therapist];

  if (bookingLink && bookingLink !== "#") {
    btn.href = bookingLink;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  } else {
    // Se não houver link configurado, redireciona para contacto
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      alert(`Para marcar uma sesão com ${therapist}, por favor contacte-nos através do formulário de contacto ou pelo telefone.`);
      document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    });
  }
});

const CONSENT_STORAGE_KEY = "amate_cookie_consent_v1";
const defaultConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: null,
};

const cookieBanner = document.getElementById("cookieBanner");
const privacyModal = document.getElementById("privacyModal");
const consentCategoryInputs = document.querySelectorAll("[data-consent-category]");
const openPrivacyButtons = document.querySelectorAll("[data-open-privacy]");
const openCookieSettingsButtons = document.querySelectorAll("[data-open-cookie-settings]");
const closePrivacyButtons = document.querySelectorAll("[data-close-privacy]");
const consentActionButtons = document.querySelectorAll("[data-consent-action]");
const saveCookieSettingsButton = document.querySelector("[data-save-cookie-settings]");

function readStoredConsent() {
  try {
    const storedValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedValue) return null;

    const parsedValue = JSON.parse(storedValue);
    return {
      ...defaultConsent,
      ...parsedValue,
      necessary: true,
    };
  } catch (error) {
    return null;
  }
}

function writeStoredConsent(consent) {
  const normalizedConsent = {
    ...defaultConsent,
    ...consent,
    necessary: true,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(normalizedConsent));
  } catch (error) {
    return normalizedConsent;
  }

  return normalizedConsent;
}

function applyConsentToInputs(consent) {
  consentCategoryInputs.forEach((input) => {
    const category = input.dataset.consentCategory;
    input.checked = Boolean(consent[category]);
  });
}

function publishConsentState(consent) {
  window.cookieConsent = {
    ...consent,
    canUse(category) {
      if (category === "necessary") return true;
      return Boolean(consent[category]);
    },
  };

  window.dispatchEvent(
    new CustomEvent("cookieconsentchange", {
      detail: consent,
    })
  );
}

function showCookieBanner(shouldShow) {
  if (!cookieBanner) return;
  cookieBanner.hidden = !shouldShow;
}

function setPrivacyModalOpen(isOpen) {
  if (!privacyModal) return;

  privacyModal.hidden = !isOpen;
  privacyModal.setAttribute("aria-hidden", String(!isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}

function saveConsent(consent) {
  const savedConsent = writeStoredConsent(consent);
  applyConsentToInputs(savedConsent);
  publishConsentState(savedConsent);
  showCookieBanner(false);
  return savedConsent;
}

function handleConsentAction(action) {
  if (action === "accept") {
    saveConsent({
      analytics: true,
      marketing: true,
    });
    setPrivacyModalOpen(false);
    return;
  }

  if (action === "reject") {
    saveConsent({
      analytics: false,
      marketing: false,
    });
    setPrivacyModalOpen(false);
  }
}

const storedConsent = readStoredConsent();
applyConsentToInputs(storedConsent || defaultConsent);
publishConsentState(storedConsent || defaultConsent);
showCookieBanner(!storedConsent);

openPrivacyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentConsent = readStoredConsent() || defaultConsent;
    applyConsentToInputs(currentConsent);
    setPrivacyModalOpen(true);
  });
});

openCookieSettingsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentConsent = readStoredConsent() || defaultConsent;
    applyConsentToInputs(currentConsent);
    setPrivacyModalOpen(true);
  });
});

closePrivacyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPrivacyModalOpen(false);
  });
});

if (privacyModal) {
  privacyModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.matches("[data-close-privacy]")) {
      setPrivacyModalOpen(false);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && privacyModal && !privacyModal.hidden) {
    setPrivacyModalOpen(false);
  }
});

consentActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleConsentAction(button.dataset.consentAction);
  });
});

if (saveCookieSettingsButton) {
  saveCookieSettingsButton.addEventListener("click", () => {
    const customConsent = {
      analytics: false,
      marketing: false,
    };

    consentCategoryInputs.forEach((input) => {
      const category = input.dataset.consentCategory;
      customConsent[category] = input.checked;
    });

    saveConsent(customConsent);
    setPrivacyModalOpen(false);
  });
}

