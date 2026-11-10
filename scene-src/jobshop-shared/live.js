// A oficina ao vivo, para o site do OStrack. Toca o roteiro do filme em loop (o mesmo state(t)) e cada estação
// é uma etapa da O.S.: passar o mouse realça, clicar aproxima a câmera e abre o painel da etapa (O.S. em andamento,
// responsável, tempo na etapa contra o prazo e a ficha da O.S.). Parada, a página se apresenta sozinha com um
// cursor; qualquer clique, toque, roda ou tecla devolve o controle, e 25 s de silêncio retomam o passeio.
//
// URL:     ?static (sem animação)  |  ?notour (sem passeio automático)  |  ?station=usinagem (abre já focada)
// Do site: iframe.contentWindow.postMessage({jobshop: 'focus', station: 'teste'}, '*')  |  {jobshop: 'overview'}
//          a página avisa {jobshop: 'ready'} e {jobshop: 'select', station}
import {ROOM_BOX, STATIONS, toRef} from './layout.js';
import {fmtMin, liveLine, ORDERS, STAGE_INDEX, STAGES} from './data.js';
import {LOOP, state} from './sim.js';
import {BG, createStage} from './stage.js';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const spring = (w, x = 0) => {
  const s = {x, v: 0, to: x, w};
  s.step = (dt) => {
    s.v += (s.w * s.w * (s.to - s.x) - 2 * s.w * s.v) * dt;
    s.x += s.v * dt;
    return s.x;
  };
  s.set = (v) => {
    s.x = s.to = v;
    s.v = 0;
  };
  return s;
};
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const BY_ID = Object.fromEntries(STATIONS.map((s) => [s.id, s]));
// quem trabalha em cada estação (fica em cor junto com ela quando está lá)
const CREW = {recebimento: 'w1', desmontagem: 'w2', usinagem: 'w3', montagem: 'w5', teste: 'w4', expedicao: 'driver'};
const crewAt = (id, s) => {
  if (!id) return [];
  const out = [CREW[id]];
  // quem está andando conta para a estação onde está no momento
  const near = (w, st) => {
    const [x0, x1, z0, z1] = BY_ID[st].box;
    return w.x > x0 - 0.6 && w.x < x1 + 0.6 && w.z > z0 - 0.6 && w.z < z1 + 0.6;
  };
  for (const k of ['w1', 'w4']) if (k !== CREW[id] && near(s.workers[k], id)) out.push(k);
  if (CREW[id] === 'w1' && !near(s.workers.w1, id)) out.shift();
  if (CREW[id] === 'w4' && !near(s.workers.w4, id)) out.shift();
  return out;
};

export async function runLive() {
  const q = new URLSearchParams(location.search);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || q.has('static');
  const tourOn = !q.has('notour');
  document.documentElement.style.setProperty('--bg', BG);

  const app = document.getElementById('app');
  const canvas = document.createElement('canvas');
  canvas.id = 'gl';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Oficina de manutenção em pixel art: cada estação é uma etapa da ordem de serviço');
  app.appendChild(canvas);

  // ---------------------------------------------------------------- interface
  const ui = el('div', 'ui');
  app.appendChild(ui);
  const badge = el('div', 'badge', '<span class="dot"></span>Dados de exemplo');
  const hint = el('div', 'hint', 'Clique numa estação para ver a etapa da O.S.');
  const tag = el('div', 'tag');
  const panel = el('aside', 'panel');
  panel.setAttribute('aria-live', 'polite');
  const cursor = el('div', 'cursor');
  cursor.innerHTML = '<svg viewBox="0 0 16 20" width="22" height="28"><path d="M1 1 L1 16 L5 12 L8 19 L11 18 L8 11 L14 11 Z" fill="#fff" stroke="#0e1018" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  ui.append(badge, hint, tag, panel, cursor);
  // botões das etapas (acessível por teclado e no celular)
  const rail = el('nav', 'rail');
  rail.setAttribute('aria-label', 'Etapas da O.S.');
  for (const s of STATIONS) {
    const b = el('button', 'step', `<b>${String(s.n).padStart(2, '0')}</b><span>${s.name}</span>`);
    b.setAttribute('aria-label', s.name);
    b.dataset.id = s.id;
    b.addEventListener('click', () => {
      userInput();
      select(s.id);
    });
    rail.appendChild(b);
  }
  ui.appendChild(rail);

  const st = createStage({canvas});
  const size = () => [app.clientWidth || innerWidth, app.clientHeight || innerHeight];
  let tier = matchMedia('(pointer: coarse)').matches ? 1 : 0;
  const PR = [2, 1.5, 1];
  const fit = () => {
    const [w, h] = size();
    st.resize(w, h, Math.min(devicePixelRatio || 1, PR[tier]));
  };
  fit();
  addEventListener('resize', fit);

  // ---------------------------------------------------------------- câmera
  const mobile = () => size()[0] < 720;
  const overview = () => {
    const [w, h] = size();
    const bw = ROOM_BOX.x1 - ROOM_BOX.x0;
    const bh = ROOM_BOX.y1 - ROOM_BOX.y0;
    const top = 56;
    const bottom = mobile() ? 64 : 56;
    const k = Math.min(w / bw, (h - top - bottom) / bh) * 0.98;
    return {cx: (ROOM_BOX.x0 + ROOM_BOX.x1) / 2, cy: (ROOM_BOX.y0 + ROOM_BOX.y1) / 2 - (top - bottom) / 2 / k, k};
  };
  const stationShot = (id) => {
    const [w, h] = size();
    const o = overview();
    const [rx, ry] = toRef(BY_ID[id].focus);
    const k = clamp(o.k * 1.55, o.k, 2.8);
    // o painel ocupa a direita (ou embaixo, no celular): desloca o centro para a estação ficar no espaço livre
    const pw = mobile() ? 0 : Math.min(380, w * 0.42);
    const ph = mobile() ? Math.min(h * 0.46, 360) : 0;
    return {cx: rx + pw / 2 / k, cy: ry + ph / 2 / k, k};
  };
  const o0 = overview();
  const cam = {cx: spring(5, o0.cx), cy: spring(5, o0.cy), k: spring(5, o0.k)};
  let camTarget = null;

  // ---------------------------------------------------------------- estado da interação
  let clock = 0;
  let selected = null;
  let hover = null;
  let hiK = spring(14);
  let dim = spring(8);
  let lastInput = -1e9;
  let tour = tourOn && !still ? {t: 0, i: -1} : null;
  const cur = {x: spring(9), y: spring(9), show: spring(10)};

  const toScreen = (p) => {
    const [w, h] = size();
    const [rx, ry] = toRef(p);
    return [(rx - cam.cx.x) * cam.k.x + w / 2, (ry - cam.cy.x) * cam.k.x + h / 2];
  };

  const orderRow = (o, i) => {
    const pct = clamp(o.inStage / o.limit, 0, 1.25);
    const late = o.inStage > o.limit;
    return `<button class="os${late ? ' late' : ''}" data-i="${i}">
      <span class="os-n">${o.os}</span><span class="os-eq">${o.equip}</span>
      <span class="os-who">${o.who}</span>
      <span class="bar"><i style="width:${Math.min(100, pct * 100).toFixed(0)}%"></i></span>
      <span class="os-t">${fmtMin(o.inStage)} de ${fmtMin(o.limit)}${late ? ' · atrasada' : ''}</span>
    </button>`;
  };
  const ficha = (id, o) => {
    const at = STAGE_INDEX[id];
    const steps = STAGES.map((n, i) => `<li class="${i < at ? 'done' : i === at ? 'now' : ''}"><i></i><span>${n}</span></li>`).join('');
    return `<div class="ficha">
      <button class="back" aria-label="Voltar para a etapa">&larr; ${BY_ID[id].name}</button>
      <div class="f-head"><b>${o.os}</b><span>${o.equip}</span><small>${o.client}</small></div>
      <ol class="trilho">${steps}</ol>
      <dl>
        <div><dt>Responsável</dt><dd>${o.who}</dd></div>
        <div><dt>Na etapa</dt><dd>${fmtMin(o.inStage)} de ${fmtMin(o.limit)}</dd></div>
        <div><dt>Entrega</dt><dd>${o.due}</dd></div>
      </dl>
    </div>`;
  };
  let liveEl = null;
  const renderPanel = (id) => {
    if (!id) {
      panel.classList.remove('open');
      liveEl = null;
      return;
    }
    const s = BY_ID[id];
    const list = ORDERS[id];
    panel.innerHTML = `
      <button class="close" aria-label="Fechar">&times;</button>
      <div class="p-step">Etapa ${String(s.n).padStart(2, '0')} de 06</div>
      <h2>${s.name}</h2>
      <p class="live"><span class="pulse"></span><span class="live-t"></span></p>
      <div class="p-sub">${list.length} O.S. nesta etapa</div>
      <div class="list">${list.map(orderRow).join('')}</div>
      <p class="foot">Toque numa O.S. para abrir a ficha.</p>`;
    liveEl = panel.querySelector('.live-t');
    panel.querySelector('.close').addEventListener('click', () => {
      userInput();
      select(null);
    });
    panel.querySelectorAll('.os').forEach((b) =>
      b.addEventListener('click', () => {
        userInput();
        openFicha(id, +b.dataset.i);
      }),
    );
    panel.classList.add('open');
  };
  const openFicha = (id, i) => {
    panel.innerHTML = ficha(id, ORDERS[id][i]);
    liveEl = null;
    panel.querySelector('.back').addEventListener('click', () => {
      userInput();
      renderPanel(id);
    });
  };
  const select = (id) => {
    selected = id;
    renderPanel(id);
    camTarget = id ? stationShot(id) : null;
    dim.to = id ? 0.8 : 0;
    rail.querySelectorAll('.step').forEach((b) => b.classList.toggle('on', b.dataset.id === id));
    hint.classList.toggle('gone', !!id);
    if (parent !== window) parent.postMessage({jobshop: 'select', station: id}, '*');
  };

  // ---------------------------------------------------------------- entrada
  const userInput = () => {
    lastInput = performance.now() / 1000;
    if (tour) tour = null;
    cur.show.to = 0;
  };
  const stationAtPoint = (x, y) => {
    const id = st.stationAt(st.pick(x, y));
    if (id) return id;
    // no chão: dentro da faixa amarela da estação
    for (const s of STATIONS) {
      const [x0, x1, z0, z1] = s.box;
      const poly = [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]].map(toScreen);
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) return s.id;
    }
    // em cima de um operador ou perto da estação: a estação mais próxima, até ~1,6 m
    let best = null;
    let bd = 1.6 * 88 * cam.k.x;
    for (const s of STATIONS) {
      const [sx, sy] = toScreen(s.focus);
      const d = Math.hypot(sx - x, sy - y);
      if (d < bd) {
        bd = d;
        best = s.id;
      }
    }
    return best;
  };
  let downAt = null;
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.pointerType === 'mouse' && (Math.abs(e.movementX) + Math.abs(e.movementY) > 0)) userInput();
    hover = stationAtPoint(e.clientX - r.left, e.clientY - r.top);
    canvas.style.cursor = hover ? 'pointer' : 'default';
  });
  canvas.addEventListener('pointerleave', () => (hover = null));
  canvas.addEventListener('pointerdown', (e) => (downAt = [e.clientX, e.clientY]));
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8) return;
    userInput();
    const r = canvas.getBoundingClientRect();
    const id = stationAtPoint(e.clientX - r.left, e.clientY - r.top);
    select(id && id !== selected ? id : null);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      userInput();
      select(null);
    }
  });
  addEventListener('wheel', userInput, {passive: true});
  addEventListener('message', (e) => {
    const d = e.data;
    if (!d || (d.jobshop !== 'focus' && d.jobshop !== 'overview')) return;
    userInput();
    if (d.jobshop === 'focus' && BY_ID[d.station]) select(d.station);
    if (d.jobshop === 'overview') select(null);
  });
  addEventListener('resize', () => {
    if (selected) camTarget = stationShot(selected);
  });

  // ---------------------------------------------------------------- passeio automático
  // Por estação: o cursor vai até ela (1,1 s), passa o mouse (0,5 s), clica e mostra o painel (4,6 s).
  const STEP = 6.2;
  const tourStep = (dt) => {
    if (!tour) {
      if (tourOn && !still && performance.now() / 1000 - lastInput > 25) tour = {t: 0, i: -1};
      return;
    }
    tour.t += dt;
    const [w, h] = size();
    const n = STATIONS.length;
    const idx = Math.floor(tour.t / STEP);
    const local = tour.t - idx * STEP;
    if (idx >= n) {
      // volta ao todo e recomeça
      if (selected) select(null);
      cur.show.to = 0;
      if (tour.t > n * STEP + 3.5) tour = {t: 0, i: -1};
      return;
    }
    const s = STATIONS[idx];
    if (tour.i !== idx) {
      tour.i = idx;
      if (selected) select(null);
    }
    const [sx, sy] = toScreen(s.focus);
    cur.show.to = 1;
    if (cur.x.x === 0 && cur.y.x === 0) {
      cur.x.set(w * 0.5);
      cur.y.set(h + 30);
    }
    if (local < 1.6) {
      cur.x.to = sx;
      cur.y.to = sy;
      hover = local > 1.1 ? s.id : null;
    } else if (selected !== s.id) {
      cursor.classList.add('click');
      setTimeout(() => cursor.classList.remove('click'), 160);
      select(s.id);
    } else {
      // o cursor acompanha a estação enquanto a câmera chega e depois passeia pela lista
      const rows = panel.querySelectorAll('.os');
      if (local > 3.4 && rows.length && !mobile()) {
        const rr = rows[0].getBoundingClientRect();
        const ar = app.getBoundingClientRect();
        cur.x.to = rr.left - ar.left + rr.width * 0.6;
        cur.y.to = rr.top - ar.top + rr.height * 0.5;
      } else {
        cur.x.to = sx;
        cur.y.to = sy;
      }
      hover = null;
    }
  };

  // ---------------------------------------------------------------- laço
  let onScreen = true;
  new IntersectionObserver((es) => (onScreen = es[0].isIntersecting)).observe(canvas);
  st.frame(state(0), {cx: cam.cx.x, cy: cam.cy.x, k: cam.k.x});
  await st.warm();
  if (parent !== window) parent.postMessage({jobshop: 'ready'}, location.origin);
  if (q.get('station') && BY_ID[q.get('station')]) {
    tour = null;
    select(q.get('station'));
  }

  let prev = performance.now();
  let slow = 0;
  let n = 0;
  const tagPos = {x: 0, y: 0};
  const loop = (now) => {
    requestAnimationFrame(loop);
    const dtRaw = (now - prev) / 1000;
    prev = now;
    if (!onScreen || document.hidden) return;
    const dt = Math.min(dtRaw, 1 / 30);
    if (!still) clock = (clock + dt) % LOOP;
    tourStep(dt);
    const target = camTarget ?? overview();
    if (selected) camTarget = stationShot(selected);
    cam.cx.to = target.cx;
    cam.cy.to = target.cy;
    cam.k.to = target.k;
    cam.cx.step(dt);
    cam.cy.step(dt);
    cam.k.step(dt);
    hiK.to = hover && hover !== selected ? 1 : 0;
    hiK.step(dt);
    dim.step(dt);
    const s = state(clock);
    st.frame(s, {cx: cam.cx.x, cy: cam.cy.x, k: cam.k.x}, {hi: hover ?? (hiK.x > 0.01 ? tag.dataset.id : null), hiK: hiK.x, focus: selected, dim: dim.x, crew: crewAt(selected, s)});
    // etiqueta da estação sob o mouse
    if (hover && hover !== selected) {
      const sd = BY_ID[hover];
      const [x, y] = toScreen([sd.focus[0], sd.focus[1] + 1.4, sd.focus[2]]);
      tag.dataset.id = hover;
      tag.innerHTML = `<b>${String(sd.n).padStart(2, '0')}</b> ${sd.name}`;
      tagPos.x = x;
      tagPos.y = y;
      tag.classList.add('on');
    } else tag.classList.remove('on');
    tag.style.transform = `translate(${tagPos.x}px, ${tagPos.y}px) translate(-50%, -100%)`;
    // linha ao vivo do painel
    if (liveEl && selected) liveEl.textContent = liveLine(selected, s);
    // cursor do passeio
    cur.x.step(dt);
    cur.y.step(dt);
    cur.show.step(dt);
    cursor.style.opacity = clamp(cur.show.x, 0, 1).toFixed(3);
    cursor.style.transform = `translate(${cur.x.x}px, ${cur.y.x}px)`;
    // qualidade: baixa a resolução se a GPU não acompanhar
    n++;
    if (dtRaw > 1 / 40) slow++;
    if (n >= 120) {
      if (slow > 40 && tier < PR.length - 1) {
        tier++;
        fit();
      }
      n = 0;
      slow = 0;
    }
    if (!window.SIM_SHOWN) {
      window.SIM_SHOWN = true;
      dispatchEvent(new Event('simframe'));
      if (parent !== window) parent.postMessage({jobshop: 'ready'}, '*');
    }
  };
  requestAnimationFrame(loop);
  window.STAGE = st;
  window.JOBSHOP = {select, screenOf: (id) => toScreen(BY_ID[id].focus), get time() {return clock;}};
}
