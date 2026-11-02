import { skills } from "../data/skills.js";
import { escapeHTML } from "../utils/helpers.js";

export function Skills() {
  const items = skills.map((skill, index) => `
    <article class="skill-item" id="skill-${escapeHTML(skill.id)}">
      <div class="skill-topline"><span>${String(index + 1).padStart(2, "0")}</span><span>${escapeHTML(skill.category)}</span></div>
      <div class="skill-art" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span><i></i></div>
      <h3>${escapeHTML(skill.name)}</h3>
      <p>${escapeHTML(skill.visual)}</p>
      <span class="skill-arrow" aria-hidden="true">↗</span>
    </article>`).join("");

  return `
    <section class="section skills-section" id="skills" aria-labelledby="skills-title">
      <div class="container">
        <div class="section-heading">
          <div class="section-index"><span>02</span><i></i> FIND YOUR NEXT SKILL</div>
          <p class="eyebrow">YOUR NEXT POSSIBILITY</p>
          <h2 id="skills-title">22 WAYS TO<br><span>LEVEL UP.</span></h2>
          <p class="section-intro">Discover a skill. Unlock a new possibility. Explore the programme experiences lined up for November.</p>
        </div>
        <div class="skills-grid">${items}</div>
        <p class="skills-footnote">Explore the programme calendar for the scheduled dates and sessions.</p>
      </div>
    </section>`;
}