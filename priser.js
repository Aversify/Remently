const SCOPES = {
  hjemmeside: [
    { name: 'Landing Page',    desc: '1–3 sider, CTA, standard sektioner, mobiloptimeret',                min: 6000,   max: 12000  },
    { name: 'Virksomhedssite', desc: '5–10 sider, custom design, kontaktformular, basis SEO',             min: 18000,  max: 35000  },
    { name: 'Stor Platform',   desc: '10+ sider, kompleks struktur, integrationer, skalerbar opsætning',  min: 45000,  max: 80000  },
  ],
  webshop: [
    { name: 'Starter',    desc: 'Op til 50 produkter, theme-tilpasning, betaling/fragt, basis opsætning', min: 15000,  max: 28000  },
    { name: 'Vækst',      desc: '50–500 produkter, avanceret filtrering, CRO-fokus, apps/integrationer',  min: 35000,  max: 60000  },
    { name: 'Enterprise', desc: '500+ produkter, custom checkout, ERP/PIM-integration',                   min: 75000,  max: 120000 },
  ],
  app: [
    { name: 'MVP',               desc: 'Kernekoncept, én platform (iOS eller Android), basis backend',    min: 45000,  max: 75000  },
    { name: 'Fuld App',          desc: 'Komplet feature-set, begge platforme',                            min: 80000,  max: 140000 },
    { name: 'Kompleks Platform', desc: 'Skalerbar arkitektur, API-lag, dashboard, avanceret backend',     min: 150000, max: 250000 },
  ],
};

let state = { type: null, scopeMin: null, scopeMax: null, scopeName: null, addons: [], akut: false };

function fmt(n) { return n.toLocaleString('da-DK') + ' kr.'; }

function reveal(id) {
  const el = document.getElementById(id);
  el.classList.add('visible');
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
}

function selectType(el) {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.type = el.dataset.type;
  state.scopeMin = null; state.scopeMax = null; state.scopeName = null;
  state.addons = []; state.akut = false;
  document.querySelectorAll('.addon-row').forEach(r => r.classList.remove('selected'));

  // Reset downstream
  document.getElementById('block2').classList.remove('visible');
  document.getElementById('block3').classList.remove('visible');
  document.getElementById('blockResult').classList.remove('visible');

  // Render scopes (without prices)
  const grid = document.getElementById('scopeGrid');
  grid.innerHTML = '';
  SCOPES[state.type].forEach(s => {
    const div = document.createElement('div');
    div.className = 'scope-option';
    div.innerHTML = `
      <div class="scope-radio"><div class="scope-radio-dot"></div></div>
      <div>
        <div class="scope-name">${s.name}</div>
        <div class="scope-desc">${s.desc}</div>
      </div>`;
    div.onclick = () => selectScope(div, s);
    grid.appendChild(div);
  });

  setTimeout(() => reveal('block2'), 80);
}

function selectScope(el, scope) {
  document.querySelectorAll('.scope-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.scopeMin = scope.min;
  state.scopeMax = scope.max;
  state.scopeName = scope.name;

  document.getElementById('block3').classList.remove('visible');
  document.getElementById('blockResult').classList.remove('visible');
  setTimeout(() => reveal('block3'), 80);
}

function toggleAddon(el) {
  const price = el.dataset.price;
  el.classList.toggle('selected');
  if (price === 'akut') {
    state.akut = el.classList.contains('selected');
  } else {
    const val = parseInt(price);
    const name = el.querySelector('.addon-name').textContent;
    if (el.classList.contains('selected')) {
      state.addons.push({ name, price: val });
    } else {
      state.addons = state.addons.filter(a => a.name !== name);
    }
  }
}

function showResult() {
  if (!state.scopeMin) return;

  const addonSum = state.addons.reduce((s, a) => s + a.price, 0);
  let minTotal = state.scopeMin + addonSum;
  let maxTotal = state.scopeMax + addonSum;
  if (state.akut) { minTotal = Math.round(minTotal * 1.25); maxTotal = Math.round(maxTotal * 1.25); }

  document.getElementById('resultPrice').innerHTML = `Fra <em>${fmt(minTotal)}</em>`;

  let lines = `<div class="result-line"><span class="result-line-label">${state.scopeName}</span><span class="result-line-val">${fmt(state.scopeMin)} – ${fmt(state.scopeMax)}</span></div>`;
  state.addons.forEach(a => {
    lines += `<div class="result-line"><span class="result-line-label">${a.name}</span><span class="result-line-val accent">+${fmt(a.price)}</span></div>`;
  });
  if (state.akut) {
    lines += `<div class="result-line"><span class="result-line-label">Akut levering</span><span class="result-line-val accent">+25%</span></div>`;
  }
  document.getElementById('resultBreakdown').innerHTML = lines;
  document.getElementById('resultTotal').textContent = `${fmt(minTotal)} – ${fmt(maxTotal)}`;

  reveal('blockResult');
}

function restart() {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.addon-row').forEach(r => r.classList.remove('selected'));
  state = { type: null, scopeMin: null, scopeMax: null, scopeName: null, addons: [], akut: false };
  ['block2', 'block3', 'blockResult'].forEach(id => document.getElementById(id).classList.remove('visible'));
  document.getElementById('block1').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
