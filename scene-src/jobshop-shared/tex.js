// Texturas desenhadas em canvas (nada de arquivo externo). Filtro NEAREST: o pixel da arte manda.
import * as THREE from 'three';

let seed = 1234567;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const canvasTex = (w, h, draw, {repeat, smooth} = {}) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = smooth ? THREE.LinearFilter : THREE.NearestFilter;
  t.minFilter = smooth ? THREE.LinearMipmapLinearFilter : THREE.NearestFilter;
  t.generateMipmaps = !!smooth;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.userData.canvas = c;
  return t;
};

// Piso: placas grandes com junta, manchas e algumas trincas. 1 px = 2 cm, cobre a sala inteira.
export const floorTex = (lx, lz, rects = [], lines = [], mw = 0.08, arrows = null) =>
  canvasTex(Math.round(lx * 30), Math.round(lz * 30), (g, w, h) => {
    seed = 99;
    g.fillStyle = '#6a6d80';
    g.fillRect(0, 0, w, h);
    // manchas grandes, claras e escuras
    for (let i = 0; i < 200; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const r = 4 + rnd() * 16;
      g.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(10,12,30,0.05)';
      g.beginPath();
      g.ellipse(x, y, r * 1.6, r, 0, 0, Math.PI * 2);
      g.fill();
    }

    // faixas amarelas. Plano do chão: u = X / lx, v = 1 + Z / lz (Z negativo para o fundo)
    const PX = (x) => (x / lx) * w;
    const PZ = (z) => (1 + z / lz) * h; // canvas y=0 é o fundo (Z=-lz)
    const lw = Math.max(3, Math.round(mw * 30));
    g.fillStyle = '#f2b11c';
    const seg = (x0, z0, x1, z1) => {
      const xa = Math.round(PX(Math.min(x0, x1)) - lw / 2);
      const za = Math.round(PZ(Math.min(z0, z1)) - lw / 2);
      g.fillRect(xa, za, Math.round(Math.abs(PX(x1) - PX(x0))) + lw, Math.round(Math.abs(PZ(z1) - PZ(z0))) + lw);
    };
    for (const [x0, x1, z0, z1] of rects) {
      seg(x0, z0, x1, z0);
      seg(x0, z1, x1, z1);
      seg(x0, z0, x0, z1);
      seg(x1, z0, x1, z1);
    }
    for (const [[ax, az], [bx, bz]] of lines) seg(ax, az, bx, bz);
    if (arrows) {
      // setas (chevron) apontando para +X
      const a = arrows.size * 30;
      for (const x of arrows.x) {
        const cx = PX(x);
        const cy = PZ(arrows.z);
        g.beginPath();
        g.moveTo(cx - a * 0.5, cy - a);
        g.lineTo(cx + a * 0.6, cy);
        g.lineTo(cx - a * 0.5, cy + a);
        g.lineTo(cx - a * 0.1, cy);
        g.closePath();
        g.fill();
      }
    }
    // trincas finas
    g.strokeStyle = 'rgba(30,32,48,0.35)';
    g.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      let x = rnd() * w;
      let y = rnd() * h;
      g.beginPath();
      g.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        x += (rnd() - 0.5) * 18;
        y += (rnd() - 0.3) * 10;
        g.lineTo(x, y);
      }
      g.stroke();
    }
  });

// Parede: concreto escuro com junta vertical a cada 2,9 m e um degradê leve para cima
export const wallTex = (len, h) =>
  canvasTex(Math.round(len * 40), Math.round(h * 40), (g, w, hh) => {
    seed = 7;
    const gr = g.createLinearGradient(0, 0, 0, hh);
    gr.addColorStop(0, '#424962');
    gr.addColorStop(1, '#353b52');
    g.fillStyle = gr;
    g.fillRect(0, 0, w, hh);
    for (let i = 0; i < 160; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.05)';
      g.fillRect(rnd() * w, rnd() * hh, 2 + rnd() * 10, 1 + rnd() * 3);
    }
    g.fillStyle = 'rgba(18,20,30,0.55)';
    for (let x = 116; x < w; x += 116) g.fillRect(x, 0, 1, hh);
  });

// Faixa zebrada amarelo e preto (batente de porta)
export const hazardTex = () =>
  canvasTex(16, 64, (g, w, h) => {
    g.fillStyle = '#e8a817';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#1b1c22';
    for (let y = -16; y < h + 16; y += 16) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y - 8);
      g.lineTo(w, y);
      g.lineTo(0, y + 8);
      g.closePath();
      g.fill();
    }
  });

// Porta de enrolar fechada: lâminas horizontais
export const shutterTex = () =>
  canvasTex(64, 96, (g, w, h) => {
    seed = 3;
    g.fillStyle = '#a3a3ad';
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 6) {
      g.fillStyle = '#bdbdc6';
      g.fillRect(0, y, w, 2);
      g.fillStyle = '#7b7b88';
      g.fillRect(0, y + 5, w, 1);
    }
    for (let i = 0; i < 40; i++) {
      g.fillStyle = 'rgba(40,40,50,0.12)';
      g.fillRect(rnd() * w, rnd() * h, 6 + rnd() * 10, 1);
    }
  });

// Painel perfurado com chaves e caixinhas amarelas (fica na parede, atrás da bancada de desmontagem)
export const pegboardTex = () =>
  canvasTex(74, 29, (g, w, h) => {
    g.fillStyle = '#7a4f28';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#2b3143';
    g.fillRect(2, 2, w - 4, h - 4);
    g.fillStyle = '#1a1e2b';
    for (let y = 4; y < h - 2; y += 3) for (let x = 4; x < w - 2; x += 3) if ((x + y) % 2) g.fillRect(x, y, 1, 1);
    // chaves de boca penduradas
    // chaves de boca penduradas: cabo de 2 px, bocas de 4 px
    const wrench = (x, y, len) => {
      g.fillStyle = '#e1e4ea';
      g.fillRect(x, y + 2, 1, len);
      g.fillRect(x - 1, y, 3, 3);
      g.fillRect(x - 1, y + len + 1, 3, 3);
      g.fillStyle = '#2b3143';
      g.fillRect(x, y, 1, 1);
      g.fillRect(x, y + len + 3, 1, 1);
    };
    [[8, 5, 16], [13, 4, 18], [18, 4, 19], [23, 4, 18], [28, 5, 17], [33, 6, 15]].forEach(([x, y, l]) => wrench(x, y, l));
    // caixinhas amarelas
    const bin = (x, y) => {
      g.fillStyle = '#e09c12';
      g.fillRect(x, y, 10, 7);
      g.fillStyle = '#f6c443';
      g.fillRect(x, y, 10, 2);
      g.fillStyle = '#a86d06';
      g.fillRect(x, y + 6, 10, 1);
    };
    bin(44, 5);
    bin(57, 5);
    bin(44, 16);
    bin(57, 16);
  });

// Engradado: tábuas com X
export const crateTex = (light) =>
  canvasTex(26, 26, (g, w, h) => {
    seed = light ? 11 : 12;
    g.fillStyle = light ? '#d99a52' : '#c98444';
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 5) {
      g.fillStyle = light ? '#dc9d58' : '#a8662f';
      g.fillRect(0, y + 4, w, 1);
    }
    // quadro e X em tábuas de 3 px, com sombra de 1 px
    const plank = light ? '#f0b874' : '#e3a25e';
    const shade = light ? '#c98a48' : '#8e5226';
    g.fillStyle = plank;
    g.fillRect(0, 0, w, 3);
    g.fillRect(0, h - 3, w, 3);
    g.fillRect(0, 0, 3, h);
    g.fillRect(w - 3, 0, 3, h);
    for (let i = 3; i < w - 3; i++) {
      g.fillStyle = plank;
      g.fillRect(i, i - 1, 1, 3);
      g.fillRect(i, w - i - 2, 1, 3);
      g.fillStyle = shade;
      g.fillRect(i, i + 2, 1, 1);
      g.fillRect(i, w - i + 1, 1, 1);
    }
    g.fillStyle = shade;
    g.fillRect(0, 3, w, 1);
    g.fillRect(3, 3, 1, h - 6);
  });

// Carcaça aletada do motor: listras ao longo do eixo (u dá a volta, v corre no eixo)
export const finsTex = (base, light, dark) =>
  canvasTex(36, 4, (g, w, h) => {
    for (let x = 0; x < w; x++) {
      g.fillStyle = x % 3 === 0 ? dark : x % 3 === 1 ? light : base;
      g.fillRect(x, 0, 1, h);
    }
  });

// Tela da CNC (interface azul)
export const cncScreenTex = () =>
  canvasTex(24, 18, (g, w, h) => {
    g.fillStyle = '#5fb3e6';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#9fd8f6';
    g.fillRect(2, 2, 12, 2);
    g.fillRect(2, 6, 8, 1);
    g.fillRect(2, 9, 10, 1);
    g.fillStyle = '#2b6c9e';
    g.fillRect(16, 3, 6, 10);
  });

// Osciloscópio: tela viva, redesenhada por frame (fase da onda)
export const scopeTex = () => {
  const t = canvasTex(48, 32, () => {});
  t.userData.draw = (phase, amp = 1) => {
    const g = t.userData.canvas.getContext('2d');
    g.fillStyle = '#16262b';
    g.fillRect(0, 0, 48, 32);
    g.fillStyle = '#1f3a3b';
    for (let x = 0; x < 48; x += 8) g.fillRect(x, 0, 1, 32);
    for (let y = 0; y < 32; y += 8) g.fillRect(0, y, 48, 1);
    g.fillStyle = '#46e26e';
    let py = null;
    for (let x = 2; x < 46; x++) {
      const y = Math.round(16 + amp * 9 * Math.sin(x * 0.42 + phase) * (0.75 + 0.25 * Math.sin(x * 0.11 - phase * 0.3)));
      if (py !== null) {
        const a = Math.min(py, y);
        const b = Math.max(py, y);
        g.fillRect(x, a, 1, Math.max(1, b - a));
      } else g.fillRect(x, y, 1, 1);
      py = y;
    }
    t.needsUpdate = true;
  };
  t.userData.draw(0);
  return t;
};

// Prancheta / tablet na mão
export const tabletTex = () =>
  canvasTex(12, 16, (g, w, h) => {
    g.fillStyle = '#2a2f3a';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#9fd3ef';
    g.fillRect(1, 1, w - 2, h - 2);
    g.fillStyle = '#d9f1fb';
    g.fillRect(2, 3, 6, 1);
    g.fillRect(2, 6, 7, 1);
    g.fillRect(2, 9, 5, 1);
  });

// Gradiente radial para o halo das luminárias na parede
export const glowTex = () =>
  canvasTex(
    64,
    64,
    (g, w, h) => {
      g.save();
      g.scale(1, 2);
      const gr = g.createRadialGradient(w / 2, 0, 0, w / 2, 0, w / 2);
      gr.addColorStop(0, 'rgba(255,196,110,0.42)');
      gr.addColorStop(0.5, 'rgba(255,176,90,0.13)');
      gr.addColorStop(1, 'rgba(255,170,80,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h / 2);
      g.restore();
    },
    {smooth: true},
  );
