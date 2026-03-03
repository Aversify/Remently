(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  // ── ACTIVE STATE ──────────────────────────────────────────────────────────
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    const file = href.split('#')[0];
    const hasHash = href.includes('#');
    if (!hasHash && file === currentFile) a.classList.add('active');
  });

  // ── SMOOTH SCROLL (hash links on same page) ──────────────────────────────
  nav.querySelectorAll('a[href*="#"]').forEach(link => {
    const url = new URL(link.href, location.href);
    if (url.pathname.split('/').pop() !== currentFile) return;
    link.addEventListener('click', e => {
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
