import { sponsors } from "../data/sponsors.js";
import { escapeHTML } from "../utils/helpers.js";

export function Sponsors() {
  const logos = sponsors.map((sponsor, index) => `
    <div class="sponsor-slot" aria-label="${escapeHTML(sponsor.name)}">
      ${sponsor.logo
        ? `<img src="${escapeHTML(sponsor.logo)}" alt="${escapeHTML(sponsor.name)}" loading="lazy">`
        : `<span class="sponsor-placeholder-mark">${String(index + 1).padStart(2, "0")}</span><span>${escapeHTML(sponsor.name)}</span>`}
      ${sponsor.tier ? `<small>${escapeHTML(sponsor.tier)}</small>` : ""}
    </div>`).join("");

  return `
    <section class="section sponsors-section" id="sponsors" aria-labelledby="sponsors-title">
      <div class="container">
        <div class="section-index"><span>04</span><i></i> THE PEOPLE BEHIND THE POSSIBILITY</div>
        <div class="sponsors-heading">
          <p class="eyebrow">IN GOOD COMPANY</p>
          <h2 id="sponsors-title">POWERED BY PARTNERS<br><span>WHO BELIEVE IN POSSIBILITIES.</span></h2>
          <p>We celebrate the organisations and partners supporting a culture of learning, creativity and growth.</p>
        </div>
        <div class="sponsor-display" aria-label="Sponsor logo carousel">
          <div class="display-topline"><span>OUR PARTNERS</span><span>UMSA · SKILL-UP MONTH 2026</span></div>
          <div class="sponsor-carousel">
            <button class="sponsor-arrow sponsor-previous" type="button" aria-label="Scroll sponsors left">←</button>
            <div class="sponsor-track" id="sponsor-track" tabindex="0">${logos}</div>
            <button class="sponsor-arrow sponsor-next" type="button" aria-label="Scroll sponsors right">→</button>
          </div>
          <div class="display-bottomline"><span>PARTNERSHIP / COMMUNITY / POSSIBILITY</span><span>LOGO SHOWCASE</span></div>
        </div>
      </div>
    </section>`;
}