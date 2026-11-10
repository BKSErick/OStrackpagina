// Geometria da oficina, peça por peça, nas medidas tiradas da referência (ver layout.js). Só caixas, cilindros e
// planos: na resolução da pixel art é o que a referência tem. Cada peça que se mexe devolve o nó para o update.
import * as THREE from 'three';
import {MARK_ARROWS, MARK_LINES, MARK_RECTS, MARK_W, ROOM} from './layout.js';
import {crateTex, cncScreenTex, finsTex, floorTex, glowTex, hazardTex, pegboardTex, scopeTex, shutterTex, wallTex} from './tex.js';

const {LX, LZ, H, T, WT} = ROOM;
const ZW = -LZ + WT; // face interna da parede do fundo-esquerda
const XW = LX - WT; // face interna da parede do fundo-direita

const MATS = new Map();
export const mat = (color, o = {}) => {
  const key = color + JSON.stringify(o);
  if (!MATS.has(key)) MATS.set(key, new THREE.MeshLambertMaterial({color, ...o}));
  return MATS.get(key);
};
export const glow = (color) => {
  const key = 'glow' + color;
  if (!MATS.has(key)) MATS.set(key, new THREE.MeshBasicMaterial({color}));
  return MATS.get(key);
};

const shadow = (m, cast = true) => {
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
};
// caixa pelas faces: x0..x1, y0..y1, z0..z1
export const box = (p, x0, x1, y0, y1, z0, z1, m) => {
  const mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), m));
  mesh.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  p.add(mesh);
  return mesh;
};
// cilindro com eixo 'x' | 'y' | 'z'
export const cyl = (p, axis, [x, y, z], r, len, m, seg = 18, r2 = r) => {
  const mesh = shadow(new THREE.Mesh(new THREE.CylinderGeometry(r2, r, len, seg), m));
  if (axis === 'x') mesh.rotation.z = -Math.PI / 2;
  if (axis === 'z') mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, y, z);
  p.add(mesh);
  return mesh;
};
const plane = (p, w, h, m, pos, rotY = 0, rotX = 0) => {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  mesh.position.set(...pos);
  mesh.rotation.set(rotX, rotY, 0, 'YXZ');
  mesh.receiveShadow = true;
  p.add(mesh);
  return mesh;
};
const group = (parent, name, station) => {
  const g = new THREE.Group();
  g.name = name;
  g.userData.oid = true;
  if (station) g.userData.station = station;
  parent.add(g);
  return g;
};

const C = {
  wallTop: '#5b6286',
  slabFace: '#4a5272',
  rim: '#5a5f78',
  frame: '#9aa0b2',
  frameDark: '#5d6378',
  steel: '#2b3140',
  steelLight: '#5d6479',
  benchTop: '#6d7389',
  legs: '#353c4e',
  yellow: '#f2b11c',
  wood: '#d48d49',
  woodDark: '#8d5426',
  blue: '#1f52a6',
  blueLight: '#3f7fd2',
  blueDark: '#0e2b5c',
  white: '#c4c8d0',
  whiteShade: '#b7bac3',
  glass: '#86b6e0',
  red: '#c3302e',
  chrome: '#c9cdd6',
  cardboard: '#c98a3e',
};

// ---------------------------------------------------------------- sala
export function buildRoom(root) {
  const g = group(root, 'room');
  // laje (piso + face da frente) e borda
  box(g, 0, LX, -T, -0.004, -LZ, 0, mat(C.slabFace));
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(LX, LZ), new THREE.MeshLambertMaterial({map: floorTex(LX, LZ, MARK_RECTS, MARK_LINES, MARK_W, MARK_ARROWS)}));
  fl.rotation.x = -Math.PI / 2;
  fl.position.set(LX / 2, 0, -LZ / 2);
  fl.receiveShadow = true;
  g.add(fl);
  // borda clara da laje nas duas arestas da frente
  box(g, 0, LX, -0.02, 0.004, -0.13, 0, mat(C.rim));
  box(g, 0, 0.13, -0.02, 0.004, -LZ, 0, mat(C.rim));

  // paredes: face interna com textura, topo claro
  const wallMats = (inner, len, side) => {
    const tex = wallTex(len, H);
    const inside = new THREE.MeshLambertMaterial({map: tex});
    const top = mat(C.wallTop);
    const dark = mat('#20242f');
    // ordem do BoxGeometry: +x, -x, +y, -y, +z, -z
    return side === 'bl' ? [dark, dark, top, dark, inside, dark] : [dark, inside, top, dark, dark, dark];
  };
  const HL = H - 0.24; // trecho da porta da esquerda é mais baixo
  // parede do fundo-esquerda, em trechos em volta da porta da esquerda (vão X 0,93..3,10, altura 2,02)
  const bl = (x0, x1, y0, y1) => box(g, x0, x1, y0, y1, -LZ, ZW, wallMats(true, x1 - x0, 'bl'));
  bl(0, 0.93, 0, HL);
  bl(0.93, 3.1, 2.02, HL);
  bl(3.1, 3.4, 0, HL);
  bl(3.4, LX, 0, H);
  // degrau entre o trecho baixo e o alto
  box(g, 2.75, 3.55, HL, HL + 0.14, -LZ - 0.02, ZW + 0.1, mat(C.wallTop));
  // parede do fundo-direita, em trechos em volta da porta da direita (vão Z -2,9..-0,6, altura 2,1)
  const br = (z0, z1, y0, y1) => box(g, XW, LX, y0, y1, z0, z1, wallMats(true, z1 - z0, 'br'));
  br(-LZ, -2.9, 0, H);
  br(-2.9, -0.6, 2.1, H);
  br(-0.6, 0, 0, H);
  // pontas das paredes: pilar claro
  box(g, 0, 0.62, 0, HL + 0.02, -LZ, ZW + 0.18, mat('#4b516a'));
  box(g, XW - 0.18, LX, 0, H + 0.02, -0.42, 0, mat('#4b516a'));
  // pilastra entre a estante e a porta da direita
  box(g, XW - 0.14, LX, 0, H + 0.06, -4.0, -3.62, mat('#353b50'));
  // junta na parede do fundo
  box(g, 8.15, 8.2, 0.02, H - 0.02, ZW, ZW + 0.012, mat('#1d2130'));

  // ---- porta da esquerda (enrolar, fechada) na parede do fundo-esquerda
  const dl = group(root, 'door-left', 'recebimento');
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(2.17, 2.02), new THREE.MeshLambertMaterial({map: shutterTex()}));
  sh.position.set(2.015, 1.01, ZW - 0.12);
  sh.receiveShadow = true;
  dl.add(sh);
  box(dl, 0.84, 3.2, 2.0, 2.46, ZW, ZW + 0.36, mat(C.frame)); // caixa do rolo
  box(dl, 0.84, 3.2, 1.96, 2.02, ZW, ZW + 0.3, mat(C.frameDark));
  const hz = hazardTex();
  const postMat = (front) => [mat(C.frameDark), mat(C.frameDark), mat(C.frameDark), mat(C.frameDark), front, mat(C.frameDark)];
  box(dl, 0.8, 0.98, 0, 1.98, ZW, ZW + 0.16, postMat(new THREE.MeshLambertMaterial({map: hz})));
  box(dl, 3.05, 3.23, 0, 1.98, ZW, ZW + 0.16, postMat(new THREE.MeshLambertMaterial({map: hz})));

  // ---- porta da direita (aberta, vão escuro) na parede do fundo-direita
  const dr = group(root, 'door-right', 'expedicao');
  // vão escuro rente à face de fora: o que sai pela porta some atrás dele (e o palco corta o que passa de X = LX)
  plane(dr, 2.3, 2.1, new THREE.MeshBasicMaterial({color: '#0f1118'}), [LX - 0.004, 1.05, -1.75], -Math.PI / 2);
  box(dr, XW - 0.34, XW, 2.08, 2.44, -3.0, -0.5, mat(C.frame));
  box(dr, XW - 0.3, XW, 2.04, 2.1, -3.0, -0.5, mat(C.frameDark));
  const postMatX = (front) => [mat(C.frameDark), front, mat(C.frameDark), mat(C.frameDark), mat(C.frameDark), mat(C.frameDark)];
  box(dr, XW - 0.16, XW, 0, 2.05, -3.02, -2.85, postMatX(new THREE.MeshLambertMaterial({map: hz})));
  box(dr, XW - 0.16, XW, 0, 2.05, -0.65, -0.48, postMatX(new THREE.MeshLambertMaterial({map: hz})));
  // laterais amarelas por dentro do vão
  box(dr, XW, LX, 0, 2.1, -2.92, -2.88, mat('#c9921a'));
  box(dr, XW, LX, 0, 2.1, -0.62, -0.58, mat('#c9921a'));

  // ---- luminárias (tubo quente) e seus halos
  const lamps = [];
  const lampX = (x0, x1, y, z) => {
    const L = group(root, 'lamp');
    box(L, x0, x1, y, y + 0.1, z, z + 0.12, mat('#7d8396'));
    const tube = box(L, x0 + 0.04, x1 - 0.04, y - 0.05, y + 0.02, z + 0.04, z + 0.13, glow('#ffe9b0'));
    tube.castShadow = false;
    lamps.push({tube, pos: [(x0 + x1) / 2, y - 0.1, z + 0.45], axis: 'x'});
  };
  const lampZ = (z0, z1, y, x) => {
    const L = group(root, 'lamp');
    box(L, x - 0.12, x, y, y + 0.1, z0, z1, mat('#7d8396'));
    const tube = box(L, x - 0.13, x - 0.04, y - 0.05, y + 0.02, z0 + 0.04, z1 - 0.04, glow('#ffe9b0'));
    tube.castShadow = false;
    lamps.push({tube, pos: [x - 0.45, y - 0.1, (z0 + z1) / 2], axis: 'z'});
  };
  // halos quentes na parede, embaixo das luminárias (só no passe de cor)
  const halo = new THREE.MeshBasicMaterial({map: glowTex(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false});
  const haloAt = (cx, cy, cz, w, h, rotY) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), halo);
    m.position.set(cx, cy, cz);
    m.rotation.y = rotY;
    m.userData.noAux = true;
    m.renderOrder = 2;
    root.add(m);
  };
  haloAt(6.4, 1.28, ZW + 0.015, 2.6, 2.2, 0);
  haloAt(9.83, 1.28, ZW + 0.015, 2.6, 2.2, 0);
  lampX(1.45, 3.0, 2.46, ZW + 0.2);
  lampX(5.75, 7.05, 2.38, ZW);
  lampX(9.15, 10.5, 2.38, ZW);
  lampZ(-2.6, -0.95, 2.44, XW - 0.2);

  // ---- faixas amarelas: pintadas na textura do chão (nítidas, sem briga de profundidade)
  const mk = group(root, 'marks');
  const ym = mat(C.yellow);
  return {lamps};
}

// ---------------------------------------------------------------- recebimento: motor no palete
export function buildPallet(p, x0, x1, z0, z1, h = 0.15) {
  const g = new THREE.Group();
  p.add(g);
  const n = 5;
  const dz = (z1 - z0) / n;
  for (let i = 0; i < n; i++) box(g, x0, x1, h - 0.035, h, z0 + i * dz + 0.02, z0 + (i + 1) * dz - 0.02, mat(C.wood));
  for (const x of [x0, (x0 + x1) / 2 - 0.06, x1 - 0.12]) box(g, x, x + 0.12, 0, h - 0.035, z0, z1, mat(C.woodDark));
  return g;
}

// Motor elétrico trifásico, eixo ao longo de X. Origem no centro do pé.
export function buildMotor({len = 1.0, r = 0.37, shaftSide = -1} = {}) {
  const g = new THREE.Group();
  const cy = 0.16 + r;
  // pés e base
  box(g, -len * 0.35, len * 0.35, 0, 0.12, -r * 0.75, r * 0.75, mat(C.blueDark));
  box(g, -len * 0.3, len * 0.3, 0.1, cy - r * 0.4, -r * 0.5, r * 0.5, mat(C.blue));
  // carcaça com aletas
  const fins = new THREE.MeshLambertMaterial({map: finsTex(C.blue, C.blueLight, C.blueDark)});
  cyl(g, 'x', [0, cy, 0], r, len * 0.82, fins, 24);
  cyl(g, 'x', [-len * 0.41, cy, 0], r + 0.02, 0.05, mat(C.blueLight), 24);
  cyl(g, 'x', [len * 0.41, cy, 0], r + 0.02, 0.05, mat(C.blueLight), 24);
  // tampas
  cyl(g, 'x', [shaftSide * len * 0.45, cy, 0], r * 0.92, len * 0.1, mat(C.blueLight), 20);
  cyl(g, 'x', [-shaftSide * len * 0.45, cy, 0], r * 0.86, len * 0.1, mat(C.blue), 20);
  cyl(g, 'x', [shaftSide * len * 0.51, cy, 0], r * 0.3, 0.04, mat('#1d3f78'), 14);
  // ponta de eixo (gira no teste)
  const shaft = new THREE.Group();
  shaft.position.set(shaftSide * len * 0.5, cy, 0);
  g.add(shaft);
  cyl(shaft, 'x', [shaftSide * 0.1, 0, 0], 0.055, 0.2, mat(C.chrome), 12);
  box(shaft, shaftSide * 0.2 - 0.01, shaftSide * 0.2 + 0.01, 0.04, 0.06, -0.015, 0.015, mat('#555b66'));
  // caixa de ligação em cima
  box(g, -0.2, 0.18, cy + r - 0.02, cy + r + 0.17, -0.18, 0.18, mat('#5f8fd2'));
  box(g, -0.15, 0.13, cy + r + 0.17, cy + r + 0.2, -0.14, 0.14, mat('#9fb9e0'));
  return {g, shaft, cy};
}

// ---------------------------------------------------------------- bancada simples
export function buildTable(p, x0, x1, z0, z1, top, {topColor = C.benchTop, th = 0.12} = {}) {
  const g = new THREE.Group();
  p.add(g);
  box(g, x0, x1, top - th, top, z0, z1, mat(topColor));
  const l = 0.1;
  const ix = 0.06;
  for (const [x, z] of [[x0 + ix, z0 + ix], [x1 - ix - l, z0 + ix], [x0 + ix, z1 - ix - l], [x1 - ix - l, z1 - ix - l]]) box(g, x, x + l, 0, top - th, z, z + l, mat(C.legs));
  box(g, x0 + ix, x1 - ix, 0.16, 0.2, z0 + ix, z0 + ix + 0.04, mat(C.legs));
  return g;
}

// ---------------------------------------------------------------- desmontagem: redutor, painel de ferramentas
export function buildGearbox() {
  const g = new THREE.Group();
  const W = 0.62;
  box(g, 0, 0.7, 0, 0.6, -W / 2, W / 2, mat('#b4b8c1'));
  box(g, -0.02, 0.72, 0.52, 0.6, -W / 2 - 0.02, W / 2 + 0.02, mat('#d5d8de'));
  box(g, -0.02, 0.72, 0, 0.06, -W / 2 - 0.02, W / 2 + 0.02, mat('#8d929e'));
  // abertura com engrenagem na face +Z
  cyl(g, 'z', [0.42, 0.3, W / 2 + 0.005], 0.2, 0.02, mat('#3a3f4b'), 20);
  const gear = new THREE.Group();
  gear.position.set(0.42, 0.3, W / 2 + 0.02);
  g.add(gear);
  cyl(gear, 'z', [0, 0, 0], 0.15, 0.04, mat('#8a8f9b'), 12);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const t = box(gear, -0.025, 0.025, 0.13, 0.19, -0.02, 0.02, mat('#a3a8b3'));
    t.position.set(Math.sin(a) * 0.16, Math.cos(a) * 0.16, 0);
    t.rotation.z = -a;
  }
  cyl(gear, 'z', [0, 0, 0.02], 0.045, 0.04, mat('#3a3f4b'), 10);
  // eixo de entrada com acoplamento na face -X
  cyl(g, 'x', [-0.12, 0.3, 0], 0.11, 0.24, mat('#9ca1ac'), 16);
  cyl(g, 'x', [-0.3, 0.3, 0], 0.06, 0.16, mat(C.chrome), 12);
  // nervuras
  for (const z of [-W / 2, W / 2 - 0.04]) box(g, 0.08, 0.12, 0.06, 0.52, z, z + 0.04, mat('#9ca1ac'));
  return {g, gear};
}

export function buildPegboard(p) {
  const pb = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 1.0), new THREE.MeshLambertMaterial({map: pegboardTex()}));
  pb.position.set(5.6, 1.6, ZW + 0.02);
  pb.receiveShadow = true;
  p.add(pb);
  return pb;
}

export function buildToolChest(p) {
  const g = new THREE.Group();
  p.add(g);
  box(g, 7.35, 8.3, 0.06, 0.98, -8.95, -8.42, mat(C.red));
  for (let i = 0; i < 5; i++) {
    const y = 0.18 + i * 0.16;
    box(g, 7.38, 8.27, y, y + 0.012, -8.42, -8.41, mat('#7c1b1b'));
    box(g, 7.6, 8.05, y + 0.06, y + 0.085, -8.42, -8.39, mat('#d9dbe0'));
  }
  box(g, 7.33, 8.32, 0.98, 1.02, -8.97, -8.4, mat('#a52625'));
  box(g, 7.6, 8.05, 1.02, 1.12, -8.72, -8.66, mat('#2c2f38'));
  for (const x of [7.4, 8.2]) for (const z of [-8.9, -8.5]) cyl(g, 'z', [x, 0.04, z], 0.04, 0.04, mat('#22252d'), 8);
  return g;
}

// ---------------------------------------------------------------- usinagem: centro de usinagem CNC
export function buildCNC(p) {
  const g = new THREE.Group();
  p.add(g);
  const z0 = -8.97;
  const z1 = -7.25;
  const T = 1.9; // altura do gabinete
  box(g, 8.88, 11.45, 0, 0.2, z0, z1 + 0.06, mat(C.steel));
  // gabinete da esquerda (branco) com janela lateral grande
  box(g, 8.9, 9.68, 0.2, T, z0, z1, mat(C.white));
  box(g, 8.89, 8.9, 0.6, 1.55, -8.4, -7.5, mat('#28324a'));
  box(g, 8.885, 8.9, 0.65, 1.5, -8.35, -7.55, mat('#3b5a7c'));
  // meio: portas com vidro
  box(g, 9.68, 10.86, 0.2, T - 0.04, z0, z1 - 0.04, mat('#2d3343'));
  box(g, 9.68, 10.86, T - 0.14, T - 0.02, z0, z1, mat(C.white));
  for (const [a, b] of [[9.75, 10.25], [10.29, 10.8]]) {
    box(g, a, b, 0.4, T - 0.18, z1 - 0.04, z1 - 0.01, mat('#3a4254'));
    box(g, a + 0.05, b - 0.05, 0.75, T - 0.24, z1 - 0.012, z1, mat(C.glass));
    box(g, a + 0.08, a + 0.13, 0.9, T - 0.34, z1, z1 + 0.004, mat('#a9cdee')); // reflexo
  }
  box(g, 10.2, 10.23, 0.95, 1.25, z1, z1 + 0.05, mat(C.chrome));
  box(g, 10.33, 10.36, 0.95, 1.25, z1, z1 + 0.05, mat(C.chrome));
  // painel da direita com tela e teclado
  box(g, 10.86, 11.45, 0.2, T + 0.02, z0, z1, mat(C.white));
  box(g, 10.95, 11.38, 1.0, 1.72, z1, z1 + 0.03, mat('#2b3140'));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.26), glow('#ffffff'));
  scr.material = new THREE.MeshBasicMaterial({map: cncScreenTex()});
  scr.position.set(11.16, 1.5, z1 + 0.035);
  g.add(scr);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) box(g, 10.99 + j * 0.09, 11.06 + j * 0.09, 1.06 + i * 0.08, 1.12 + i * 0.08, z1 + 0.03, z1 + 0.05, mat(i === 0 && j === 3 ? '#e2672a' : '#c9ccd4'));
  // teto e cabeçote
  box(g, 9.0, 11.3, T, T + 0.1, -8.85, -7.4, mat('#d3d6dc'));
  box(g, 9.72, 10.6, T + 0.1, T + 0.62, -8.5, -7.68, mat('#3d4354'));
  box(g, 9.7, 10.62, T + 0.58, T + 0.64, -8.52, -7.66, mat('#4b5265'));
  // mangueira de refrigeração
  cyl(g, 'y', [9.25, T + 0.2, -8.6], 0.06, 0.4, mat('#3d4354'), 10);
  cyl(g, 'x', [9.47, T + 0.38, -8.6], 0.06, 0.45, mat('#3d4354'), 10);
  // ferramenta girando atrás do vidro (fuso) e brilho azul do interior
  const spindle = new THREE.Group();
  spindle.position.set(10.27, 1.45, -7.6);
  g.add(spindle);
  cyl(spindle, 'y', [0, 0, 0], 0.07, 0.3, mat('#9aa0ac'), 8);
  box(spindle, -0.02, 0.02, -0.4, -0.15, -0.02, 0.02, mat(C.chrome));
  const inner = box(g, 9.72, 10.82, 0.5, 1.7, -8.3, -8.26, glow('#2c5f8f'));
  inner.castShadow = false;
  return {g, spindle, screen: scr, inner};
}

export function buildCart(p) {
  const g = new THREE.Group();
  p.add(g);
  const [x0, x1, z0, z1] = [7.82, 8.62, -7.58, -6.78];
  const fr = mat('#2f6ab0');
  for (const [x, z] of [[x0, z0], [x1 - 0.05, z0], [x0, z1 - 0.05], [x1 - 0.05, z1 - 0.05]]) box(g, x, x + 0.05, 0.1, 0.86, z, z + 0.05, fr);
  for (const y of [0.22, 0.78]) {
    box(g, x0, x1, y, y + 0.06, z0, z1, fr);
    box(g, x0 + 0.04, x1 - 0.04, y + 0.06, y + 0.07, z0 + 0.04, z1 - 0.04, mat('#5b6172'));
  }
  for (const [x, z] of [[x0 + 0.03, z0 + 0.03], [x1 - 0.03, z0 + 0.03], [x0 + 0.03, z1 - 0.03], [x1 - 0.03, z1 - 0.03]]) cyl(g, 'z', [x, 0.05, z], 0.05, 0.04, mat('#1f2229'), 8);
  // peças usinadas em cima
  let k = 0;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      if (k++ === 8) continue;
      cyl(g, 'y', [x0 + 0.16 + j * 0.24, 0.92 + ((i + j) % 2) * 0.03, z0 + 0.16 + i * 0.24], 0.075, 0.16 + ((i + j) % 2) * 0.06, mat(C.chrome), 10);
    }
  box(g, x0 + 0.1, x0 + 0.4, 0.29, 0.45, z0 + 0.1, z1 - 0.1, mat('#9aa0ac'));
  box(g, x0 + 0.45, x1 - 0.1, 0.29, 0.4, z0 + 0.15, z1 - 0.2, mat('#7d8392'));
  return g;
}

export function buildShelf(p) {
  const g = new THREE.Group();
  p.add(g);
  const [x0, x1, z0, z1] = [10.95, XW - 0.02, -6.45, -4.6];
  const fr = mat('#6c7387');
  for (const [x, z] of [[x0, z0], [x1 - 0.06, z0], [x0, z1 - 0.06], [x1 - 0.06, z1 - 0.06]]) box(g, x, x + 0.06, 0, 2.0, z, z + 0.06, fr);
  const levels = [0.1, 0.62, 1.12, 1.6, 1.98];
  for (const y of levels) box(g, x0, x1, y, y + 0.05, z0, z1, mat('#838a9e'));
  // conteúdo
  const cb = mat(C.cardboard);
  box(g, x0 + 0.08, x1 - 0.06, 0.14, 0.42, z0 + 0.6, z0 + 1.0, cb);
  box(g, x0 + 0.08, x1 - 0.06, 0.14, 0.38, z0 + 1.05, z0 + 1.45, mat('#b97b33'));
  box(g, x0 + 0.1, x1 - 0.1, 0.66, 0.92, z0 + 1.0, z0 + 1.5, cb);
  box(g, x0 + 0.08, x1 - 0.08, 0.66, 0.8, z0 + 0.12, z0 + 0.5, mat('#7d8392'));
  box(g, x0 + 0.1, x1 - 0.1, 1.16, 1.38, z0 + 0.12, z0 + 0.48, mat('#5f6677'));
  box(g, x0 + 0.1, x1 - 0.1, 1.16, 1.32, z0 + 0.55, z0 + 0.95, mat('#8d93a2'));
  box(g, x0 + 0.08, x1 - 0.06, 1.16, 1.48, z0 + 1.05, z0 + 1.5, cb);
  box(g, x0 + 0.1, x1 - 0.1, 1.64, 1.82, z0 + 0.15, z0 + 0.45, mat('#9aa0ac'));
  box(g, x0 + 0.1, x1 - 0.1, 2.02, 2.2, z0 + 0.1, z0 + 0.4, mat('#9aa0ac'));
  box(g, x0 + 0.1, x1 - 0.1, 2.02, 2.14, z0 + 0.55, z0 + 0.95, mat('#7d8392'));
  return g;
}

// ---------------------------------------------------------------- montagem: cilindro hidráulico
export function buildHydraulic(p) {
  const g = new THREE.Group();
  p.add(g);
  const y = 1.16;
  const z = -2.45;
  // calços em V
  for (const x of [2.25, 3.3]) box(g, x - 0.12, x + 0.12, 0.85, 0.98, z - 0.16, z + 0.16, mat('#2f3544'));
  cyl(g, 'x', [2.75, y, z], 0.22, 1.6, mat('#f5b818'), 20);
  cyl(g, 'x', [3.57, y, z], 0.245, 0.09, mat('#d4980f'), 20);
  cyl(g, 'x', [1.94, y, z], 0.245, 0.09, mat('#d4980f'), 20);
  cyl(g, 'x', [1.6, y, z], 0.1, 0.62, mat(C.chrome), 14);
  box(g, 2.3, 2.38, y + 0.16, y + 0.24, z - 0.04, z + 0.04, mat('#c9921a'));
  box(g, 3.2, 3.28, y + 0.16, y + 0.24, z - 0.04, z + 0.04, mat('#c9921a'));
  // olhais nas duas pontas (furo virado para -X, como na referência)
  const eye = (x) => {
    const m = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.065, 8, 18), mat('#d3d6dd')));
    m.rotation.y = Math.PI / 2;
    m.position.set(x, y, z);
    g.add(m);
    const ring = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.02, 6, 14), mat('#c9921a')));
    ring.rotation.y = Math.PI / 2;
    ring.position.set(x - 0.03, y, z);
    g.add(ring);
  };
  eye(1.22);
  eye(3.78);
  return g;
}

// ---------------------------------------------------------------- teste: bancada de motor e console
export function buildConsole(p) {
  const g = new THREE.Group();
  p.add(g);
  const [x0, x1, z0, z1] = [6.85, 7.8, -2.75, -2.0];
  box(g, x0, x1, 0, 1.0, z0, z1 - 0.12, mat('#a3a8b2'));
  box(g, x0, x1, 1.0, 1.75, z0, z1, mat('#b3b8c2'));
  box(g, x0 - 0.02, x1 + 0.02, 1.75, 1.8, z0 - 0.02, z1 + 0.02, mat('#8d929e'));
  // tela do osciloscópio na face da frente (+Z)
  const tex = scopeTex();
  box(g, x0 + 0.1, x1 - 0.1, 1.2, 1.66, z1, z1 + 0.012, mat('#4a505f'));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.38), new THREE.MeshBasicMaterial({map: tex}));
  scr.position.set((x0 + x1) / 2, 1.43, z1 + 0.016);
  g.add(scr);
  // mesa inclinada com botões
  box(g, x0, x1, 0.94, 1.0, z1 - 0.12, z1 + 0.14, mat('#9ba0aa'));
  const btn = (x, c) => cyl(g, 'y', [x, 1.02, z1 + 0.04], 0.035, 0.04, glow(c), 10);
  btn(7.0, '#3fd06a');
  btn(7.14, '#3fd06a');
  btn(7.28, '#ffffff');
  btn(7.42, '#e8742a');
  btn(7.6, '#e23b3b');
  return {g, scope: tex};
}

export function buildTestStand(p) {
  const g = new THREE.Group();
  p.add(g);
  const [x0, x1, z0, z1] = [5.22, 6.8, -2.8, -1.45];
  box(g, x0, x1, 0, 0.62, z0, z1, mat('#2e3547'));
  box(g, x0 - 0.02, x1 + 0.02, 0.58, 0.64, z0 - 0.02, z1 + 0.02, mat('#3b4357'));
  box(g, x0 + 0.1, x1 - 0.1, 0.1, 0.5, z1, z1 + 0.01, mat('#262c3b'));
  // poste com braço e mangueira
  cyl(g, 'y', [5.12, 0.9, -2.98], 0.05, 1.8, mat('#3d4354'), 10);
  cyl(g, 'x', [5.38, 1.78, -2.98], 0.05, 0.56, mat('#3d4354'), 10);
  box(g, 5.6, 5.75, 1.62, 1.84, -3.06, -2.9, mat('#9aa0ac'));
  cyl(g, 'y', [5.68, 1.45, -2.98], 0.025, 0.36, mat('#1d2027'), 8);
  const m = buildMotor({len: 1.15, r: 0.37, shaftSide: -1});
  m.g.position.set(6.05, 0.62, -2.12);
  g.add(m.g);
  return {g, motor: m};
}

// ---------------------------------------------------------------- expedição: empilhadeira e engradado
export function buildCrate(p) {
  const g = new THREE.Group();
  p.add(g);
  buildPallet(g, -0.5, 0.5, -0.5, 0.5, 0.14);
  const side = new THREE.MeshLambertMaterial({map: crateTex(false)});
  const top = new THREE.MeshLambertMaterial({map: crateTex(true)});
  box(g, -0.46, 0.46, 0.14, 0.98, -0.46, 0.46, [side, side, top, side, side, side]);
  return g;
}

export function buildForklift() {
  const g = new THREE.Group(); // origem: centro do eixo traseiro no chão, frente para +X
  const Y = mat('#f0b31a');
  const Yd = mat('#c98f10');
  const D = mat('#262a33');
  box(g, -0.35, 0.95, 0.18, 0.62, -0.48, 0.48, Y); // chassi
  box(g, -0.5, -0.2, 0.18, 0.95, -0.46, 0.46, Yd); // contrapeso
  box(g, -0.52, -0.18, 0.85, 0.98, -0.44, 0.44, Y);
  box(g, 0.6, 1.0, 0.62, 0.76, -0.46, 0.46, Y); // painel da frente
  // banco
  box(g, -0.12, 0.38, 0.62, 0.72, -0.3, 0.3, D);
  box(g, -0.2, -0.08, 0.72, 1.22, -0.3, 0.3, D);
  // proteção do operador
  for (const [x, z] of [[-0.32, -0.44], [-0.32, 0.37], [0.8, -0.44], [0.8, 0.37]]) box(g, x, x + 0.08, 0.62, 1.96, z, z + 0.07, D);
  // teto da proteção: só o quadro amarelo e duas travessas
  box(g, -0.34, 0.9, 1.94, 2.03, -0.46, -0.36, Y);
  box(g, -0.34, 0.9, 1.94, 2.03, 0.36, 0.46, Y);
  box(g, -0.34, -0.24, 1.94, 2.03, -0.46, 0.46, Y);
  box(g, 0.8, 0.9, 1.94, 2.03, -0.46, 0.46, Y);
  for (const x of [0.12, 0.46]) box(g, x - 0.035, x + 0.035, 1.96, 2.01, -0.4, 0.4, D);
  // volante
  const sw = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 6, 14), D));
  sw.rotation.set(-Math.PI / 2, 0, 0);
  sw.rotation.y = 0.9;
  sw.position.set(0.55, 1.05, 0);
  g.add(sw);
  cyl(g, 'y', [0.62, 0.95, 0], 0.02, 0.2, D, 6);
  // rodas
  const wheels = [];
  for (const [x, z] of [[0, -0.42], [0, 0.42], [0.85, -0.42], [0.85, 0.42]]) {
    const w = new THREE.Group();
    w.position.set(x, 0.24, z);
    g.add(w);
    cyl(w, 'z', [0, 0, 0], 0.24, 0.18, mat('#1d1f26'), 16);
    cyl(w, 'z', [0, 0, Math.sign(z) * 0.06], 0.12, 0.08, mat('#7d8392'), 10);
    wheels.push(w);
  }
  // torre (mastro) e garfos: o carro sobe em lift
  const mast = new THREE.Group();
  mast.position.set(1.05, 0, 0);
  g.add(mast);
  for (const z of [-0.36, 0.3]) box(mast, 0, 0.09, 0.08, 2.15, z, z + 0.06, D);
  box(mast, 0, 0.09, 2.1, 2.18, -0.36, 0.36, D);
  const lift = new THREE.Group();
  mast.add(lift);
  box(lift, 0.09, 0.15, 0.1, 0.62, -0.38, 0.38, D);
  for (const z of [-0.26, 0.2]) box(lift, 0.09, 1.2, 0.08, 0.13, z, z + 0.06, D);
  return {g, mast, lift, wheels};
}

// ---------------------------------------------------------------- miudezas
export function buildGasBottle(p) {
  const g = new THREE.Group();
  p.add(g);
  cyl(g, 'y', [3.75, 0.45, -8.78], 0.11, 0.9, mat('#2a9a49'), 14);
  cyl(g, 'y', [3.75, 0.94, -8.78], 0.06, 0.1, mat('#1f7a39'), 10);
  box(g, 3.7, 3.8, 0.98, 1.0, -8.8, -8.76, mat('#9aa0ac'));
  return g;
}

export function buildUnderTable(p) {
  const g = new THREE.Group();
  p.add(g);
  box(g, 1.55, 2.5, 0, 0.32, -2.95, -2.35, mat('#3f4554'));
  box(g, 1.55, 2.5, 0.32, 0.35, -2.95, -2.35, mat('#555c6d'));
  box(g, 2.85, 3.85, 0, 0.3, -2.55, -1.85, mat('#2a6cc4'));
  box(g, 2.9, 3.8, 0.28, 0.3, -2.5, -1.9, mat('#1b4f96'));
  return g;
}

export function buildBackBench(p) {
  const g = buildTable(p, 4.0, 6.65, -8.98, -8.42, 0.88, {topColor: '#5a6075'});
  // ferramentas na bancada de trás
  box(g, 4.3, 4.6, 0.88, 0.93, -8.8, -8.6, mat('#8d929e'));
  box(g, 4.75, 5.05, 0.88, 0.91, -8.75, -8.55, mat('#6b7180'));
  box(g, 5.3, 5.38, 0.88, 0.9, -8.85, -8.5, mat('#9aa0ac'));
  return g;
}

export {C};
