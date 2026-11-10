// O roteiro da oficina: state(t) é função pura do tempo, num loop de 24 s. Frame 0 = a referência.
//
// Uma O.S. andando pela fábrica: o operador do recebimento leva a O.S. no tablet até a desmontagem e volta; o do
// teste leva o laudo até a expedição; com o laudo entregue, a empilhadeira levanta o engradado, sai pela porta e
// volta com o próximo. As máquinas trabalham o tempo todo (fuso da CNC, motor em teste, osciloscópio, engrenagem).

export const LOOP = 24;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerpAngle = (a, b, k) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
};

// caminho por pontos: comprimento acumulado e ponto a uma distância
const mkPath = (pts) => {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const at = (d) => {
    d = clamp(d, 0, acc[acc.length - 1]);
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    const k = (d - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
  };
  return {len: acc[acc.length - 1], at};
};

const SPEED = 0.95; // m/s
const STRIDE = 0.62; // m por meio ciclo de passo

// Agenda de um operador: paradas e caminhadas. Devolve a pose no tempo t.
const schedule = (stops) => {
  // stops em ordem: fica em 'at' até 'until', depois anda pelo 'via' até o próximo. O último volta à casa (LOOP).
  const segs = [];
  let t = 0;
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    segs.push({kind: 'stay', t0: t, t1: s.until, ...s});
    t = s.until;
    if (i === stops.length - 1) break;
    const n = stops[i + 1];
    const path = mkPath([s.at, ...(s.via ?? []), n.at]);
    const dur = path.len / SPEED;
    segs.push({kind: 'walk', t0: t, t1: t + dur, path, from: s, to: n});
    t += dur;
  }
  return (time) => {
    const seg = segs.find((g) => time >= g.t0 && time < g.t1) ?? segs[segs.length - 1];
    if (seg.kind === 'stay') return {x: seg.at[0], z: seg.at[1], yaw: seg.yaw, act: seg.act, walk: null, a: time};
    const k = (time - seg.t0) / (seg.t1 - seg.t0);
    const d = seg.path.len * k;
    const [x, z] = seg.path.at(d);
    const [ax, az] = seg.path.at(d - 0.2);
    const [bx, bz] = seg.path.at(d + 0.2);
    let yaw = Math.atan2(bx - ax, bz - az);
    // vira no começo e no fim da caminhada
    yaw = lerpAngle(seg.from.yaw, yaw, smooth(0, 0.35, time - seg.t0));
    yaw = lerpAngle(yaw, seg.to.yaw, smooth(seg.t1 - 0.35, seg.t1, time));
    const speed = smooth(0, 0.25, time - seg.t0) * (1 - smooth(seg.t1 - 0.2, seg.t1, time));
    return {x, z, yaw, act: seg.from.walkAct ?? null, walk: (d / STRIDE) * Math.PI, speed, a: time};
  };
};

// operador 1, recebimento: leva a O.S. até a desmontagem e volta
const W1_HOME = {at: [0.62, -7.43], yaw: 0.35, act: 'tablet', walkAct: 'walkTablet'};
const w1 = schedule([
  {...W1_HOME, until: 3.5, via: [[1.0, -5.75], [3.7, -5.75]]},
  {at: [4.5, -6.4], yaw: 2.75, act: 'tablet', walkAct: 'walkTablet', until: 12.6, via: [[3.7, -5.75], [1.0, -5.75]]},
  {...W1_HOME, until: LOOP},
]);
// operador 4, teste: leva o laudo até a empilhadeira e volta
const W4_HOME = {at: [7.75, -1.15], yaw: -2.3, act: 'tablet', walkAct: 'walkTablet'};
const w4 = schedule([
  {...W4_HOME, until: 6.0, via: [[8.7, -0.72]]},
  {at: [9.35, -1.02], yaw: 2.52, act: 'tablet', walkAct: 'walkTablet', until: 10.4, via: [[8.7, -0.72]]},
  {...W4_HOME, until: LOOP},
]);

// empilhadeira: casa com o engradado na porta da direita
const FK = {x: 9.75, z: -1.93, fork: 1.72};
const forkliftAt = (t) => {
  const lift = 0.22 * (smooth(13.5, 14.5, t) - smooth(23.0, 23.9, t));
  const out = 3.1 * (ease(clamp((t - 14.6) / 4.0)) - ease(clamp((t - 19.4) / 3.5)));
  return {x: FK.x + out, z: FK.z, yaw: 0, lift, roll: out / 0.24, out};
};

const flicker = (t) => {
  if (t < 5.0 || t > 5.75) return 1;
  const k = Math.floor((t - 5.0) / 0.075);
  return [0.15, 1, 0.1, 0.9, 1, 0.2, 1, 1, 0.3, 1][k] ?? 1;
};

export function state(t) {
  t = ((t % LOOP) + LOOP) % LOOP;
  const p1 = w1(t);
  const p4 = w4(t);
  const fk = forkliftAt(t);
  // o mecânico da desmontagem olha quando a O.S. chega
  const lookW1 = smooth(9.4, 9.9, t) * (1 - smooth(12.3, 12.8, t));
  // o motorista olha o laudo chegando
  const lookW4 = smooth(7.6, 8.1, t) * (1 - smooth(10.2, 10.7, t));
  return {
    t,
    workers: {
      w1: p1,
      w2: {x: 5.2, z: -8.2, yaw: -0.2, act: 'bench', a: t * 2.4, look: -0.45 * lookW1},
      w3: {x: 10.4, z: -6.72, yaw: 2.75, act: 'type', a: t},
      w4: p4,
      w5: {x: 3.0, z: -3.85, yaw: -0.15, act: 'wrench', a: t * 3.2},
    },
    forklift: {...fk, look: -0.9 * lookW4},
    crate: {x: fk.x + FK.fork, y: fk.lift, z: fk.z, yaw: 0},
    spindle: t * 24,
    testShaft: t * 9,
    testBuzz: 0,
    scopePhase: t * 5,
    scopeAmp: 1,
    gear: t * 0.6 * (1 + lookW1 * 0),
    lamps: [1, 1, flicker(t), 1],
  };
}

// Momentos do roteiro (para revisão e trilha)
export const BEATS = {
  w1Leaves: 3.5,
  w1Arrives: 9.6,
  w4Leaves: 6.0,
  w4Arrives: 8.0,
  w1Back: 12.6,
  liftUp: 13.5,
  forkOut: 14.6,
  forkGone: 18.6,
  forkBack: 19.4,
  forkHome: 22.9,
};
