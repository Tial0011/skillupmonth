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
  menu.classList.toggle("is-open", !isOpen);
});

menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
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

document.querySelector(".app-loading")?.remove();