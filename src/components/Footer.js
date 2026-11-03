import { siteConfig } from "../config/siteConfig.js";
import { escapeHTML } from "../utils/helpers.js";

const socialIcons = {
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="icon-dot" cx="17.7" cy="6.8" r="1"/></svg>',
  snapchat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2c-2.7 0-4.4 2-4.4 4.8 0 1.1.1 2.2-.1 3.1-.2 1-1.3 1.6-2.6 1.9-.5.1-.7.4-.5.8.2.4 1.1.7 2 .8.5.1.8.2 1 .6.2.4-.1.9-.8 1.2-.4.2-.8.3-1.2.4-.5.2-.4.7.2.9.5.2 1.3.2 1.9.6.4.3.6.8 1.1 1.1.7.5 1.8.1 2.4.5.4.2.5.8 1 .8s.6-.6 1-.8c.6-.4 1.7 0 2.4-.5.5-.3.7-.8 1.1-1.1.6-.4 1.4-.4 1.9-.6.6-.2.7-.7.2-.9-.4-.1-.8-.2-1.2-.4-.7-.3-1-.8-.8-1.2.2-.4.5-.5 1-.6.9-.1 1.8-.4 2-.8.2-.4 0-.7-.5-.8-1.3-.3-2.4-.9-2.6-1.9-.2-.9-.1-2-.1-3.1 0-2.8-1.7-4.8-4.4-4.8Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3h3.1c.2 2 1.4 3.6 3.7 4v3.2a9.1 9.1 0 0 1-3.7-1.1v6.2a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.4a2.8 2.8 0 1 0 1.8 2.6V3Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.1a3 3 0 0 0-2.1-2.2C19 4.4 12 4.4 12 4.4s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.2c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.2 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.7 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h4.8l11.2 18h-4.8L4 3Zm.4 18 6.8-8.1m2-2.4L19.6 3M8.8 3l11.2 18" /></svg>'
};

export function Footer() {
  const socials = Object.entries(siteConfig.socialLinks).filter(([, url]) => url);
  const socialLabels = {
    instagram: "@unimed_mbbs",
    snapchat: "@unimedmbbs",
    tiktok: "@officialunimedmbbs",
    youtube: "UNIMED MBBS",
    x: "@unimedmbbs"
  };
  return `
    <footer class="site-footer">
      <div class="container footer-community" aria-label="UMSA, UNIMED, and The Legacy Administration logos">
        <span>OUR COMMUNITY</span>
        <div class="footer-community-logos">
          <img src="/logos/umsa.png" alt="UMSA">
          <img src="/logos/unimed.png" alt="UNIMED">
          <img src="/logos/tla.png" alt="The Legacy Administration (TLA)">
        </div>
      </div>
      <div class="container footer-main">
        <a class="brand footer-brand" href="#home">
          <span class="brand-copy"><strong>UMSA</strong><small>SKILL-UP MONTH</small></span>
        </a>
        <p class="footer-tagline">LEARN A SKILL.<br>BUILD A FUTURE.</p>
        <div class="footer-nav"><span>EXPLORE</span><a href="#about">About</a><a href="#skills">Skills</a><a href="#programme">Programme</a><a href="#sponsors">Sponsors</a></div>
        <div class="footer-social"><span>FOLLOW UMSA</span>${socials.map(([name, url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${name}: ${socialLabels[name] || name}">${socialIcons[name] || ""}<span>${escapeHTML(socialLabels[name] || name)}</span></a>`).join("")}</div>
      </div>
      <div class="container footer-bottom"><span>© ${siteConfig.year} UMSA SKILL-UP MONTH</span><span>LEARN · CREATE · GROW</span><a href="#top">BACK TO TOP ↑</a></div>
    </footer>`;
}