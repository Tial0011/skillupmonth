import { siteConfig } from "../config/siteConfig.js";
import { escapeHTML } from "../utils/helpers.js";

export function Navbar() {
  return `
    <header class="site-header" id="top">
      <nav class="nav-shell container" aria-label="Main navigation">
        <a class="brand" href="#home" aria-label="UMSA Skill-Up Month home">
          <span class="brand-mark">U</span>
          <span class="brand-copy"><strong>UMSA</strong><small>SKILL-UP MONTH</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu">
          <span></span><span></span><span></span><span class="sr-only">Toggle navigation</span>
        </button>
        <div class="nav-links" id="primary-menu">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#programme">Programme</a>
          <a href="#sponsors">Sponsors</a>
          <a class="nav-cta" href="#join">Join the experience <span aria-hidden="true">↗</span></a>
        </div>
      </nav>
    </header>`;
}