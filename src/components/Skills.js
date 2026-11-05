import { skills } from "../data/skills.js";
import { escapeHTML } from "../utils/helpers.js";

export function Skills() {
  const skillItems = skills.filter(skill => skill.type !== "event");
  const eventItems = skills.filter(skill => skill.type === "event");
  const items = skillItems.map((skill, index) => `
    <button class="skill-item" id="skill-${escapeHTML(skill.id)}" type="button" data-category="${escapeHTML(skill.category)}" data-skill-name="${escapeHTML(skill.name)}" data-skill-category="${escapeHTML(skill.category)}" data-skill-description="${escapeHTML(skill.visual)}" data-whatsapp-url="${escapeHTML(skill.whatsappUrl || "")}" aria-label="View ${escapeHTML(skill.name)} WhatsApp group information" data-reveal>
      <div class="skill-topline"><span>${String(index + 1).padStart(2, "0")}</span><span>${escapeHTML(skill.category)}</span></div>
      <div class="skill-art" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span><i></i><b></b></div>
      <h3>${escapeHTML(skill.name)}</h3>
      <p>${escapeHTML(skill.visual)}</p>
      <span class="skill-arrow" aria-hidden="true">↗</span>
    </button>`).join("");

  return `
    <section class="section skills-section" id="skills" aria-labelledby="skills-title">
      <div class="container">
        <div class="section-heading">
          <div class="section-index"><span>02</span><i></i> FIND YOUR NEXT SKILL</div>
          <p class="eyebrow">YOUR NEXT POSSIBILITY</p>
          <h2 id="skills-title">${skillItems.length} SKILLS.<br><span>${eventItems.length} EVENT${eventItems.length === 1 ? "" : "S"}.</span></h2>
          <p class="section-intro">Discover a skill. Unlock a new possibility. Explore the programme experiences lined up for November.</p>
        </div>
        <div class="skills-grid" id="skills-grid">${items}</div>
        ${eventItems.map((event, index) => `
          <div class="featured-event" data-reveal>
            <span class="featured-event-index">FEATURED EVENT <i></i> ${String(index + 1).padStart(2, "0")}</span>
            <span class="featured-event-copy">
              <span class="eyebrow">NOT A SKILL — A SPECIAL EVENT</span>
              <strong>${escapeHTML(event.name)}</strong>
              <span>${escapeHTML(event.visual)}</span>
            </span>
          </div>`).join("")}
        <p class="skills-footnote">Explore the programme calendar for the scheduled dates and sessions.</p>
      </div>
      <dialog class="skill-dialog" id="skill-dialog" aria-labelledby="skill-dialog-title" aria-describedby="skill-dialog-message">
        <form method="dialog" class="skill-dialog-form">
          <button class="skill-dialog-close" type="submit" aria-label="Close skill details">×</button>
        </form>
        <p class="eyebrow skill-dialog-category" id="skill-dialog-category"></p>
        <p class="skill-dialog-index">YOUR NEXT POSSIBILITY</p>
        <h2 id="skill-dialog-title"></h2>
        <p class="skill-dialog-description" id="skill-dialog-description"></p>
        <p class="skill-dialog-message" id="skill-dialog-message" role="status"></p>
        <a class="button button-primary skill-dialog-join" id="skill-dialog-join" target="_blank" rel="noopener noreferrer" hidden>Join the WhatsApp group <span aria-hidden="true">↗</span></a>
        <span class="skill-dialog-pending" id="skill-dialog-pending">Group link coming soon</span>
      </dialog>
    </section>`;
}