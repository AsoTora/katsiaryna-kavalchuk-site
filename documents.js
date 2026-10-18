(() => {
  const assets = JSON.parse(document.getElementById('document-assets').textContent);
  const preview = document.getElementById('document-hover-preview');
  const image = preview.querySelector('img');
  const title = preview.querySelector('p');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let activeButton = null;
  function hidePreview() {
    preview.hidden = true;
    activeButton?.setAttribute('aria-expanded', 'false');
    activeButton = null;
  }
  function showPreview(row, allowTouch = false) {
    if (!allowTouch && !hover.matches) return;
    hidePreview();
    activeButton = row.querySelector('[data-document-open]');
    image.src = assets[row.dataset.documentHover][0];
    image.alt = activeButton.textContent.trim();
    title.textContent = activeButton.textContent.trim();
    activeButton.setAttribute('aria-expanded', 'true');
    preview.hidden = false;
    const rect = row.getBoundingClientRect();
    const box = preview.getBoundingClientRect();
    const left = Math.max(12, Math.min(rect.right - box.width, innerWidth - box.width - 12));
    let top = rect.top - box.height - 12;
    if (top < 12) top = rect.bottom + 12;
    top = Math.max(12, Math.min(top, innerHeight - box.height - 12));
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
  }
  // Warm preview images shortly before the education section is reached so the first hover is instant.
  const rows = document.querySelectorAll('[data-document-hover]');
  const warm = () => Object.values(assets).flat().forEach(src => { const img = new Image(); img.decoding = 'async'; img.src = src; });
  if (rows.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { warm(); observer.disconnect(); }
    }, { rootMargin: '800px' });
    observer.observe(rows[0]);
  }
  document.querySelectorAll('[data-document-hover]').forEach(row => {
    const button = row.querySelector('[data-document-open]');
    row.addEventListener('pointerenter', () => showPreview(row));
    row.addEventListener('pointerleave', () => { if (hover.matches) hidePreview(); });
    button.addEventListener('focus', () => showPreview(row));
    button.addEventListener('blur', hidePreview);
    button.addEventListener('click', () => {
      if (!hover.matches && activeButton === button) hidePreview();
      else showPreview(row, true);
    });
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('[data-document-open]')) hidePreview();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hidePreview(); });
  window.addEventListener('scroll', hidePreview, { passive: true });
  window.addEventListener('resize', hidePreview, { passive: true });
  new MutationObserver(hidePreview).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
