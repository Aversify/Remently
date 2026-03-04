function setAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
}

function render(slug) {
  const p = PROJECTS[slug];

  if (!p) {
    document.querySelectorAll('section, footer').forEach(el => el.style.display = 'none');
    document.getElementById('notFound').style.display = 'flex';
    document.title = '404 – Remently';
    document.body.classList.add('loaded');
    return;
  }

  // Accent + bg colors
  setAccent(p.accent);
  document.documentElement.style.setProperty('--hero-bg', p.heroBg);

  // Page title
  document.title = `${p.name.replace(/<[^>]+>/g, '')} Case Study – Remently`;

  // Hero
  document.getElementById('heroYear').textContent = p.year;
  document.getElementById('heroTitle').innerHTML = p.name;
  document.getElementById('heroTagline').textContent = p.tagline;
  document.getElementById('heroImg').src = p.img;
  document.getElementById('heroImg').alt = p.name.replace(/<[^>]+>/g, '');
  document.getElementById('fullImg').src = p.img;
  document.getElementById('fullImg').alt = p.name.replace(/<[^>]+>/g, '') + ' screenshot';

  // Tags
  document.getElementById('heroTags').innerHTML = p.tags
    .map(t => `<span class="ctag${t.accent ? ' accent' : ''}">${t.label}</span>`).join('');
  document.getElementById('heroTech').innerHTML = p.tech
    .map(t => `<span class="ctag">${t}</span>`).join('');

  // Overview
  document.getElementById('ovChallenge').textContent = p.challenge;
  document.getElementById('ovSolution').textContent = p.solution;
  document.getElementById('ovOutcome').textContent = p.outcome;

  // Stats
  document.getElementById('statsGrid').innerHTML = p.stats.map(s => `
    <div class="stat-col" data-target="${s.val}">
      <div class="stat-val"><span class="num">0</span><span class="unit">${s.unit}</span></div>
      <div class="stat-lbl">${s.label}</div>
    </div>`).join('');

  // Results
  document.getElementById('resBrief').textContent = p.brief;
  const checkSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  document.getElementById('resultsList').innerHTML = p.results.map(r => `
    <div class="result-row">
      <div class="res-check">${checkSvg}</div>
      <p class="res-text">${r}</p>
    </div>`).join('');

  // Next project
  const nextSlug = p.next;
  const nextP = PROJECTS[nextSlug];
  document.getElementById('nextCard').href = `case.html?project=${nextSlug}`;
  document.getElementById('nextImg').src = nextP.img;
  document.getElementById('nextImg').alt = NEXT_NAMES[nextSlug];
  document.getElementById('nextName').textContent = NEXT_NAMES[nextSlug];

  document.body.classList.add('loaded');
}

// Count-up animation
function animateCount(el, target, duration = 1400) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Observers
function initObservers() {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible'))
        entry.target.classList.add('visible');
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const numEl = entry.target.querySelector('.num');
        const target = parseInt(entry.target.dataset.target);
        setTimeout(() => animateCount(numEl, target), i * 100);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-col').forEach(el => statsObs.observe(el));
}

// Boot
const slug = new URLSearchParams(window.location.search).get('project') || '';
render(slug.toLowerCase());
initObservers();
