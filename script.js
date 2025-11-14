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

// Formulário de contacto (simulação)
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Aqui poderás integrar com email, backend, etc.
    formFeedback.textContent = "Obrigado pela sua mensagem. Entraremos em contacto brevemente.";
    formFeedback.style.color = "#2e7d32";

    contactForm.reset();

    setTimeout(() => {
      formFeedback.textContent = "";
    }, 6000);
  });
}
