/* B73: official social links only; no inactive buttons or invented accounts. */
(async () => {
  const root = document.getElementById('b59-items');
  if (!root) return;
  const scriptURL = document.currentScript.src;
  const heading = root.previousElementSibling?.classList.contains('b60-social-label')
    ? root.previousElementSibling : null;
  const names = Object.freeze({facebook:'Facebook',instagram:'Instagram',youtube:'YouTube',linkedin:'LinkedIn',tiktok:'TikTok',whatsapp:'WhatsApp Business'});
  let active = [], failed = false, renderedLocale = null;
  function render() {
    const en = document.documentElement.lang === 'en';
    const locale = en ? 'en' : 'es';
    // The global translator rewrites lang after DOM changes; avoid a render loop.
    if (renderedLocale === locale) return;
    renderedLocale = locale;
    root.replaceChildren();
    root.setAttribute('aria-label', en ? 'PLUTÓN ACADEMIC social media' : 'Redes sociales de PLUTÓN ACADEMIC');
    if (heading) {
      const es = active.length ? 'Síguenos en redes sociales' : 'Redes sociales';
      const english = active.length ? 'Follow us on social media' : 'Social media';
      heading.setAttribute('data-b53-es', es);
      heading.setAttribute('data-b53-en', english);
      heading.textContent = en ? english : es;
    }
    if (!active.length) {
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.textContent = failed
        ? (en ? 'Social media could not be loaded. Please try again later.' : 'No se pudieron cargar las redes sociales. Inténtalo de nuevo más tarde.')
        : (en ? 'Official accounts have not been linked yet.' : 'Las cuentas oficiales todavía no están vinculadas.');
      root.append(status);
      return;
    }
    for (const account of active) {
      const link = document.createElement('a');
      link.className = 'b65-social-icon';
      link.textContent = names[account.id];
      link.href = account.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.minHeight = '44px';
      link.style.boxSizing = 'border-box';
      link.setAttribute('aria-label', `${en ? 'Visit our profile on' : 'Visitar nuestro perfil de'} ${names[account.id]}${en ? ' (opens a new tab)' : ' (abre una pestaña nueva)'}`);
      root.append(link);
    }
  }
  try {
    const {verifiedSocialAccounts} = await import(new URL('social/social-links.js', scriptURL).href);
    const response = await fetch(new URL('social/social-links.json', scriptURL), {cache:'no-store'});
    if (!response.ok) throw new Error('Social configuration unavailable');
    const config = await response.json();
    if (!Array.isArray(config?.networks)) throw new Error('Invalid social configuration');
    active = verifiedSocialAccounts(config);
  } catch { failed = true; }
  render();
  new MutationObserver(render).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
})();
