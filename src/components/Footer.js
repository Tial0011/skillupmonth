import { siteConfig } from "../config/siteConfig.js";

export function Footer() {
  const socials = Object.entries(siteConfig.socialLinks).filter(([, url]) => url);
  return `
    <footer class="site-footer">
      <div class="container footer-main">
        <a class="brand footer-brand" href="#home">
          <span class="brand-mark">U</span>
          <span class="brand-copy"><strong>UMSA</strong><small>SKILL-UP MONTH</small></span>
        </a>
        <p class="footer-tagline">LEARN A SKILL.<br>BUILD A FUTURE.</p>
        <div class="footer-nav"><span>EXPLORE</span><a href="#about">About</a><a href="#skills">Skills</a><a href="#programme">Programme</a><a href="#sponsors">Sponsors</a></div>
        <div class="footer-social"><span>CONNECT</span>${socials.length ? socials.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`).join("") : '<small>Official social links coming soon.</small>'}</div>
      </div>
      <div class="container footer-bottom"><span>© ${siteConfig.year} UMSA SKILL-UP MONTH</span><span>LEARN · CREATE · GROW</span><a href="#top">BACK TO TOP ↑</a></div>
    </footer>`;
}