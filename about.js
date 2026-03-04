// Reveal observer
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.classList.contains('visible'))
      e.target.classList.add('visible');
  });
}, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Count-up
function countUp(el, target, dur = 1400) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const el = entry.target.querySelector('.count');
      const target = parseInt(entry.target.dataset.target);
      setTimeout(() => countUp(el, target), i * 120);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-cell').forEach(el => statsObs.observe(el));
