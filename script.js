// Interações da landing page do Studio Belleza

// ---------------------------------------------------------------------------
// 1. Menu do celular (botão "hambúrguer")
// ---------------------------------------------------------------------------
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");

function fecharMenu() {
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const aberto = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  // Fecha o menu depois de escolher uma seção
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  // Fecha o menu com a tecla Esc
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharMenu();
  });
}

// ---------------------------------------------------------------------------
// 2. Destaca no menu a seção que está aparecendo na tela
//    (a linha dourada embaixo do link acompanha a rolagem)
// ---------------------------------------------------------------------------
const linksDoMenu = document.querySelectorAll('.nav__link[href^="#"]');
const secoes = [...linksDoMenu]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function marcarLinkAtivo(id) {
  linksDoMenu.forEach((link) => {
    const ativo = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", ativo);
    if (ativo) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// Quando o link é clicado, ele fica marcado enquanto a rolagem suave acontece
// (assim "Depoimentos" continua marcado mesmo se a página chegar ao fim).
let ignorarRolagemAte = 0;

linksDoMenu.forEach((link) => {
  link.addEventListener("click", () => {
    marcarLinkAtivo(link.getAttribute("href").slice(1));
    ignorarRolagemAte = Date.now() + 1000;
  });
});

function atualizarLinkAtivo() {
  if (Date.now() < ignorarRolagemAte) return;

  const alturaDoCabecalho = document.querySelector(".header").offsetHeight;
  const linhaDeLeitura = alturaDoCabecalho + window.innerHeight * 0.3;
  let atual = secoes[0];

  secoes.forEach((secao) => {
    if (secao.getBoundingClientRect().top <= linhaDeLeitura) atual = secao;
  });

  // No fim da página, o rodapé (Contato) passa a ser o ativo
  const chegouNoFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (chegouNoFim) atual = secoes[secoes.length - 1];

  marcarLinkAtivo(atual.id);
}

if (secoes.length) {
  window.addEventListener("scroll", atualizarLinkAtivo, { passive: true });
  window.addEventListener("resize", atualizarLinkAtivo);
  atualizarLinkAtivo();
}