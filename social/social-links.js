/* B58B — verified official accounts only. Safe, bilingual, accessible footer. */
const DOMAINS = Object.freeze({
  instagram: ['instagram.com'], facebook: ['facebook.com'],
  youtube: ['youtube.com','youtu.be'], linkedin: ['linkedin.com'],
  tiktok: ['tiktok.com'], whatsapp: ['wa.me']
});
export function verifiedSocialAccounts(config) {
  if (!Array.isArray(config?.networks)) return [];
  const used = new Set();
  return config.networks.filter(item => {
    if (!item || used.has(item.id) || item.verified !== true || !DOMAINS[item.id]) return false;
    if (typeof item.url !== 'string') return false;
    try {
      const u = new URL(item.url);
      if (u.protocol !== 'https:' || u.username || u.password || u.port) return false;
      const host = u.hostname.toLowerCase().replace(/^www\./, '');
      if (!DOMAINS[item.id].includes(host)) return false;
      if (u.pathname === '/' || u.pathname === '') return false;
      used.add(item.id);
      return true;
    } catch { return false; }
  }).sort((a,b) => (a.priority ?? 99) - (b.priority ?? 99));
}
export function renderSocialLinks(container, config, locale = 'es') {
  if (!container) return 0;
  container.replaceChildren();
  const active = verifiedSocialAccounts(config);
  if (!active.length) { container.hidden = true; return 0; }
  container.hidden = false;
  const title = document.createElement('span');
  title.className = 'pa-social-title';
  title.textContent = locale === 'en' ? 'Follow us' : 'Síguenos';
  container.append(title);
  for (const item of active) {
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'pa-social-link pa-social-' + item.id;
    link.setAttribute('aria-label', `${locale === 'en' ? 'Visit our' : 'Visitar nuestro perfil de'} ${item.label}`);
    // Text fallback works until approved official logos are supplied.
    const label = document.createElement('span');
    label.className = 'pa-social-label';
    label.textContent = item.label;
    link.append(label);
    container.append(link);
  }
  return active.length;
}
