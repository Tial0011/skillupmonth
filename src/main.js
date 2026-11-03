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

const skillDialog = document.querySelector("#skill-dialog");
const skillDialogCategory = document.querySelector("#skill-dialog-category");
const skillDialogTitle = document.querySelector("#skill-dialog-title");
const skillDialogDescription = document.querySelector("#skill-dialog-description");
const skillDialogMessage = document.querySelector("#skill-dialog-message");
const skillDialogJoin = document.querySelector("#skill-dialog-join");
const skillDialogPending = document.querySelector("#skill-dialog-pending");

document.querySelector("#skills-grid")?.addEventListener("click", event => {
  const skillButton = event.target.closest(".skill-item");
  if (!skillButton) return;

  skillDialogCategory.textContent = skillButton.dataset.skillCategory;
  skillDialogTitle.textContent = skillButton.dataset.skillName;
  skillDialogDescription.textContent = skillButton.dataset.skillDescription;
  skillDialogJoin.hidden = !skillButton.dataset.whatsappUrl;
  if (skillButton.dataset.whatsappUrl) skillDialogJoin.href = skillButton.dataset.whatsappUrl;
  else skillDialogJoin.removeAttribute("href");
  skillDialogPending.hidden = Boolean(skillButton.dataset.whatsappUrl);
  skillDialogMessage.textContent = skillButton.dataset.whatsappUrl
    ? "Join the WhatsApp group to connect with others learning this skill."
    : "The WhatsApp group for this skill is being prepared. Please check back soon.";
  skillDialog.showModal();
});

skillDialog?.addEventListener("click", event => {
  if (event.target === skillDialog) skillDialog.close();
});

skillDialog?.addEventListener("cancel", event => {
  event.preventDefault();
  skillDialog.close();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && skillDialog?.open) {
    skillDialog.close();
    return;
  }
  if (event.key !== "Escape" || menuToggle?.getAttribute("aria-expanded") !== "true") return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.focus();
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

let heroScene;
let disposeMotion = () => {};
let experienceCancelled = false;

const loadExperience = async () => {
  const [motionModule, resolvedSceneModule] = await Promise.all([
    import("./experience/motion.js"),
    import("./experience/heroScene.js")
  ]);
  if (experienceCancelled) return;
  if (resolvedSceneModule) {
    heroScene = resolvedSceneModule.initHeroScene(document.querySelector("#hero-3d-scene"));
  }
  disposeMotion = motionModule.initMotion(heroScene);
};

loadExperience().catch(error => {
  console.warn("Enhanced motion could not initialize; keeping the interactive page available.", error);
});

window.addEventListener("pagehide", () => {
  experienceCancelled = true;
  disposeMotion();
  heroScene?.dispose();
}, { once: true });

document.querySelector(".app-loading")?.remove();