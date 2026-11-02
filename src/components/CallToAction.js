import { siteConfig } from "../config/siteConfig.js";

export function CallToAction() {
  const href = siteConfig.registrationUrl || "#programme";
  const label = siteConfig.registrationUrl ? "Join the experience" : "Explore the programme";
  return `
    <section class="section cta-section" id="join" aria-labelledby="cta-title">
      <div class="container cta-inner">
        <p class="eyebrow">YOUR NEXT CHAPTER</p>
        <h2 id="cta-title">YOUR NEXT SKILL<br>COULD CHANGE <span>EVERYTHING.</span></h2>
        <p>Don't just watch opportunities happen. Be part of the experience.</p>
        <a class="button button-light" href="${href}">${label} <span aria-hidden="true">↗</span></a>
        ${!siteConfig.registrationUrl ? '<small class="config-note">Official participation link will be added when available.</small>' : ""}
      </div>
    </section>`;
}