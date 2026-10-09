import type { ResumeData } from '../store/portfolioStore';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character] || character));

const safeUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
};

const link = (label: string, url?: string) =>
  url && safeUrl(url) ? `<a href="${escapeHtml(safeUrl(url))}">${label}</a>` : '';

export function createPortfolioHtml(data: ResumeData): string {
  const sections = data.sections.map((section) => `
    <section><h2>${escapeHtml(section.title)}</h2>
    ${section.entries.map((entry) => `<p>${escapeHtml(entry)}</p>`).join('')}</section>`).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(data.fullName)} | Portfolio</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#111;color:#f5f5f5;font:16px/1.6 Arial,sans-serif}
main{max-width:1000px;margin:auto;padding:32px 20px}.hero{padding:80px 48px 56px;background:linear-gradient(135deg,#b20710,#221f1f);border-radius:18px}
h1{font-size:clamp(2.5rem,7vw,5rem);margin:0 0 8px}h2{font-size:2rem;margin-top:48px;border-bottom:1px solid #444;padding-bottom:10px}
.muted,span{color:#bdbdbd}.links a,a{color:#e50914;text-decoration:none;margin-right:18px}.timeline-item{border-left:4px solid #e50914;padding:0 0 18px 20px;margin:24px 0}.timeline-item h3,.card h3{margin:0;font-size:1.25rem}.timeline-item span{display:block}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.card{background:#242424;border:1px solid #444;border-radius:12px;padding:22px}.skills span{display:inline-block;background:#242424;border-radius:999px;padding:7px 14px;margin:5px}
@media(max-width:600px){.hero{padding:44px 24px}}
</style></head><body><main>
<header class="hero"><h1>${escapeHtml(data.fullName)}</h1><p>${escapeHtml(data.headline)}</p>
<p class="muted">${escapeHtml(data.email)}${data.phone ? ` · ${escapeHtml(data.phone)}` : ''}</p>
<p class="links">${link('GitHub', data.socialLinks.github)}${link('LinkedIn', data.socialLinks.linkedin)}${link('Website', data.socialLinks.portfolio)}</p></header>
<section><h2>About</h2><p>${escapeHtml(data.summary)}</p></section>
${sections}
</main></body></html>`;
}

export function downloadPortfolioHtml(data: ResumeData) {
  const blob = new Blob([createPortfolioHtml(data)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'portfolio'}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}
