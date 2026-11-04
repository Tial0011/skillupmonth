import { siteConfig } from "../config/siteConfig.js";
import { skills } from "../data/skills.js";

export function Hero() {
  const skillNames = skills.filter(skill => skill.type !== "event").map(skill => skill.name).join(", ");

  return `
    <section class="hero section" id="home" aria-labelledby="hero-title">
      <div class="hero-grid container">
        <div class="hero-copy">
          <p class="eyebrow"><span class="eyebrow-dot"></span>${siteConfig.organisation}</p>
          <p class="hero-kicker">PRESENTS · ${siteConfig.dateLabel.toUpperCase()}</p>
          <h1 id="hero-title">SKILL-UP<br><span>MONTH</span><sup>’26</sup></h1>
          <p class="hero-tagline">${siteConfig.tagline}</p>
          <p class="hero-description">A month of creativity, innovation, practical learning and opportunities to develop skills that matter.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="#skills">Explore the skills <span aria-hidden="true">↘</span></a>
            <a class="button button-secondary" href="#programme">Explore the programme <span aria-hidden="true">↘</span></a>
          </div>
        </div>
        <div class="hero-visual" id="hero-3d-scene" aria-label="Interactive globe with map regions for all programme skills: ${skillNames}. Drag to rotate; click a skill to view details.">
          <div class="hero-visual-label">THE NEXT CHAPTER STARTS HERE</div>
          <div class="visual-placeholder">
            <span class="visual-orbit orbit-one"></span>
            <span class="visual-orbit orbit-two"></span>
            <span class="visual-core" aria-hidden="true">S<span>+</span></span>
            <span class="visual-caption">LEARN · CREATE · GROW</span>
          </div>
          <span class="hero-drag-hint" aria-hidden="true">DRAG TO ROTATE · TAP A SKILL</span>
          <span class="hero-index">01 / 08</span>
        </div>
      </div>
      <a class="scroll-cue" href="#about"><span class="scroll-line"></span> SCROLL TO EXPLORE</a>
    </section>`;
}