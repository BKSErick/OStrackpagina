// Monta a oficina inteira e devolve update(s), que posa tudo a partir do estado do sim.js.
// Cada estação é um grupo com userData.station; cada peça dentro dela tem id próprio (contorno próprio). Os ids de
// uma estação saem contíguos, e o palco usa a faixa para o realce e para o clique.
import * as THREE from 'three';
import {
  buildBackBench,
  buildCart,
  buildCNC,
  buildConsole,
  buildCrate,
  buildForklift,
  buildGasBottle,
  buildGearbox,
  buildHydraulic,
  buildMotor,
  buildPallet,
  buildPegboard,
  buildRoom,
  buildShelf,
  buildTable,
  buildTestStand,
  buildToolChest,
  buildUnderTable,
} from './props.js';
import {buildWorker, poseWorker} from './people.js';

const station = (root, id) => {
  const g = new THREE.Group();
  g.name = id;
  g.userData.station = id;
  root.add(g);
  return g;
};
// embrulha uma peça para ela ter contorno próprio
const part = (parent, build) => {
  const g = new THREE.Group();
  g.userData.oid = true;
  parent.add(g);
  const out = build(g);
  return {g, out};
};

export function buildShop(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const {lamps} = buildRoom(root);

  // 1 recebimento: motor no palete
  const s1 = station(root, 'recebimento');
  part(s1, (g) => buildPallet(g, 1.2, 2.5, -7.8, -6.5));
  const m1 = part(s1, (g) => {
    const m = buildMotor({len: 1.22, r: 0.41, shaftSide: -1});
    m.g.position.set(1.85, 0.15, -7.15);
    g.add(m.g);
    return m;
  });

  // 2 desmontagem e peritagem
  const s2 = station(root, 'desmontagem');
  part(s2, (g) => buildPegboard(g));
  part(s2, (g) => buildBackBench(g));
  part(s2, (g) => buildTable(g, 4.3, 6.9, -7.85, -6.95, 0.8));
  const gb = part(s2, (g) => {
    const b = buildGearbox();
    b.g.position.set(5.72, 0.8, -7.42);
    g.add(b.g);
    return b;
  });
  part(s2, (g) => {
    // flange que o mecânico desmonta
    const pl = new THREE.Group();
    g.add(pl);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 16), new THREE.MeshLambertMaterial({color: '#3a3f4b'}));
    m.position.set(5.05, 0.83, -7.35);
    m.castShadow = m.receiveShadow = true;
    pl.add(m);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 10), new THREE.MeshLambertMaterial({color: '#7d8392'}));
    h.position.set(5.05, 0.87, -7.35);
    h.castShadow = true;
    pl.add(h);
  });
  part(s2, (g) => buildToolChest(g));
  part(s2, (g) => buildGasBottle(g));

  // 3 usinagem
  const s3 = station(root, 'usinagem');
  const cnc = part(s3, (g) => buildCNC(g));
  part(s3, (g) => buildCart(g));
  part(s3, (g) => buildShelf(g));

  // 4 reparo e montagem
  const s4 = station(root, 'montagem');
  part(s4, (g) => buildTable(g, 1.0, 4.05, -3.3, -1.6, 0.85));
  part(s4, (g) => buildHydraulic(g));
  part(s4, (g) => buildUnderTable(g));

  // 5 teste e inspeção
  const s5 = station(root, 'teste');
  const ts = part(s5, (g) => buildTestStand(g));
  const con = part(s5, (g) => buildConsole(g));

  // 6 expedição
  const s6 = station(root, 'expedicao');
  const fk = part(s6, (g) => {
    const f = buildForklift();
    g.add(f.g);
    return f;
  });
  const crate = part(s6, (g) => buildCrate(g));

  // operadores (fora das estações: andam entre elas)
  const W = {
    w1: buildWorker({tablet: true}),
    w2: buildWorker({glasses: true, hair: '#6a3a22'}),
    w3: buildWorker({}),
    w4: buildWorker({tablet: true, hair: '#4a2618'}),
    w5: buildWorker({glasses: true, wrench: true}),
    driver: buildWorker({hair: '#5f3320'}),
  };
  for (const k of ['w1', 'w2', 'w3', 'w4', 'w5']) root.add(W[k].root);
  fk.out.g.add(W.driver.root);

  const update = (s) => {
    for (const k of ['w1', 'w2', 'w3', 'w4', 'w5']) poseWorker(W[k], s.workers[k]);
    // empilhadeira e engradado
    const f = s.forklift;
    fk.out.g.position.set(f.x, 0, f.z);
    fk.out.g.rotation.y = f.yaw;
    fk.out.lift.position.y = f.lift;
    for (const w of fk.out.wheels) w.rotation.z = -f.roll;
    poseWorker(W.driver, {x: 0.12, y: 0.22, z: 0, yaw: Math.PI / 2, act: 'drive', a: s.t * 2, sit: true, look: f.look ?? 0});
    crate.g.position.set(s.crate.x, s.crate.y, s.crate.z);
    crate.g.rotation.y = s.crate.yaw;
    // máquinas
    cnc.out.spindle.rotation.y = s.spindle;
    ts.out.motor.shaft.rotation.x = s.testShaft;
    ts.out.motor.g.position.y = 0.62 + s.testBuzz;
    con.out.scope.userData.draw(s.scopePhase, s.scopeAmp);
    gb.out.gear.rotation.z = s.gear;
  };
  return {root, update, lamps, workers: W, motorRecv: m1};
}
