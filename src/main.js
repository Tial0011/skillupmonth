import "./styles/variables.css";
import "./styles/reset.css";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/about.css";
import "./styles/skills.css";
import "./styles/programme.css";
import "./styles/sponsors.css";
import "./styles/footer.css";
import "./styles/responsive.css";

import { Navbar } from "./components/Navbar.js";
import { Hero } from "./components/Hero.js";
import { About } from "./components/About.js";
import { Skills } from "./components/Skills.js";
import { Programme } from "./components/Programme.js";
import { Sponsors } from "./components/Sponsors.js";
import { CallToAction } from "./components/CallToAction.js";
import { Footer } from "./components/Footer.js";

const app = document.querySelector("#app");

app.innerHTML = `
  ${Navbar()}
  <main>
    ${Hero()}
    ${About()}
    ${Skills()}
    ${Programme()}
    ${Sponsors()}
    ${CallToAction()}
  </main>
  ${Footer()}
`;

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  menu.classList.toggle("is-open", !isOpen);
});

menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelectorAll(".weekend-heading").forEach(button => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const content = button.nextElementSibling;
    button.setAttribute("aria-expanded", String(!expanded));
    content.hidden = expanded;
    button.querySelector(".weekend-toggle").textContent = expanded ? "+" : "−";
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
}

const sponsorTrack = document.querySelector("#sponsor-track");
document.querySelectorAll(".sponsor-arrow").forEach(button => {
  button.addEventListener("click", () => {
    const direction = button.classList.contains("sponsor-next") ? 1 : -1;
    sponsorTrack.scrollBy({ left: direction * sponsorTrack.clientWidth * 0.78, behavior: "smooth" });
  });
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section-index, .hero-copy, .about-content, .section-heading, .sponsors-heading, .cta-inner, .skill-item").forEach((element, index) => {
    element.setAttribute("data-reveal", "");
    if (element.classList.contains("skill-item")) element.style.transitionDelay = `${(index % 4) * 55}ms`;
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach(element => element.classList.add("is-visible"));
}

document.querySelector(".app-loading")?.remove();