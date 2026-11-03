import { programme, programmeNote } from "../data/programme.js";
import { escapeHTML } from "../utils/helpers.js";

export function Programme() {
  const weekends = programme.map((week, index) => `
    <article class="weekend-panel">
      <button class="weekend-heading" type="button" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="${escapeHTML(week.id)}-content">
        <span class="weekend-number">0${index + 1}</span>
        <span class="weekend-title"><strong>${escapeHTML(week.title)}</strong><small>${escapeHTML(week.dates)} · NOVEMBER 2026</small></span>
        <span class="weekend-toggle" aria-hidden="true">${index === 0 ? "−" : "+"}</span>
      </button>
      <div class="weekend-content" id="${escapeHTML(week.id)}-content" ${index === 0 ? "" : "hidden"}>
        ${week.days.map(day => `
          <div class="programme-day">
            <div class="day-label"><strong>${escapeHTML(day.day)}</strong>${day.period ? `<span>${escapeHTML(day.period)}</span>` : ""}</div>
            <div class="day-sessions">
              ${day.sessions.map(session => `<div class="session-item${session.note === "Concurrent" ? " is-concurrent" : ""}"><span>${escapeHTML(session.name)}</span>${session.note ? `<small>${escapeHTML(session.note)}</small>` : ""}</div>`).join("")}
            </div>
          </div>`).join("")}
      </div>
    </article>`).join("");

  return `
    <section class="section programme-section" id="programme" aria-labelledby="programme-title">
      <div class="container">
        <div class="section-heading programme-heading">
          <div class="section-index"><span>03</span><i></i> THE LINE-UP</div>
          <p class="eyebrow">MARK YOUR CALENDAR</p>
          <h2 id="programme-title">FOUR WEEKENDS.<br><span>ENDLESS POSSIBILITIES.</span></h2>
          <p class="section-intro">Your journey through Skill-Up Month starts here. Explore the programme by weekend.</p>
        </div>
        <div class="programme-list">${weekends}</div>
        <p class="programme-note"><strong>PLEASE NOTE</strong>${escapeHTML(programmeNote)}</p>
      </div>
    </section>`;
}