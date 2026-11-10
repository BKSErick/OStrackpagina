// Operador da oficina, proporção chibi medida na referência: de 1,65 m, cabeça com boné ocupa 40%, tronco 26%,
// pernas 34%. Montado em caixas com juntas (quadril, ombro, cotovelo) para andar, digitar, apertar e dirigir.
// pose(p) recebe tudo pronto do sim.js; nada aqui guarda estado de um frame para outro.
import * as THREE from 'three';
import {box, mat} from './props.js';
import {tabletTex} from './tex.js';

const K = {
  cap: '#30478a',
  capTop: '#3b56a4',
  suit: '#1f2e5e',
  suitDark: '#17224a',
  yellow: '#f0a90a',
  skin: '#f7bd8a',
  hair: '#5a301f',
  shoe: '#3b2b26',
  glasses: '#a8dcf2',
  frame: '#1e2a44',
};

export function buildWorker({glasses = false, hair = K.hair, tablet = false, wrench = false} = {}) {
  const root = new THREE.Group();
  root.userData.oid = true;
  const body = new THREE.Group();
  root.add(body);

  // pernas com quadril em y 0,56
  const legs = [];
  for (const sx of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(sx * 0.12, 0.56, 0);
    body.add(hip);
    box(hip, -0.095, 0.095, -0.5, 0.02, -0.1, 0.1, mat(K.suit));
    box(hip, -0.1, 0.1, -0.56, -0.48, -0.11, 0.15, mat(K.shoe));
    legs.push(hip);
  }
  // tronco
  box(body, -0.25, 0.25, 0.52, 0.98, -0.15, 0.15, mat(K.suit));
  box(body, -0.255, 0.255, 0.52, 0.6, -0.155, 0.155, mat(K.suitDark)); // cinto
  box(body, -0.255, 0.255, 0.84, 0.99, -0.155, 0.155, mat(K.yellow)); // pala amarela
  box(body, -0.06, 0.06, 0.6, 0.86, 0.13, 0.135, mat(K.suitDark)); // zíper
  // braços: ombro e cotovelo
  const arms = [];
  for (const sx of [-1, 1]) {
    const sh = new THREE.Group();
    sh.position.set(sx * 0.32, 0.94, 0);
    body.add(sh);
    box(sh, -0.065, 0.065, -0.24, 0.04, -0.07, 0.07, mat(K.suit));
    box(sh, -0.07, 0.07, -0.06, 0.05, -0.075, 0.075, mat(K.yellow));
    const el = new THREE.Group();
    el.position.set(0, -0.24, 0);
    sh.add(el);
    box(el, -0.06, 0.06, -0.2, 0.0, -0.065, 0.065, mat(K.skin));
    box(el, -0.065, 0.065, -0.25, -0.18, -0.07, 0.07, mat(K.skin));
    arms.push({sh, el});
  }
  // cabeça
  const head = new THREE.Group();
  head.position.set(0, 0.99, 0);
  body.add(head);
  box(head, -0.07, 0.07, 0, 0.06, -0.07, 0.07, mat(K.skin)); // pescoço
  box(head, -0.25, 0.25, 0.05, 0.47, -0.22, 0.22, mat(K.skin));
  box(head, -0.255, 0.255, 0.22, 0.48, -0.23, -0.02, mat(hair)); // cabelo atrás e dos lados
  box(head, -0.256, -0.2, 0.26, 0.44, -0.23, -0.06, mat(hair));
  box(head, 0.2, 0.256, 0.26, 0.44, -0.23, -0.06, mat(hair));
  box(head, -0.256, -0.22, 0.3, 0.44, -0.06, 0.12, mat(hair)); // franja na têmpora
  box(head, 0.22, 0.256, 0.3, 0.44, -0.06, 0.12, mat(hair));
  box(head, -0.2, 0.2, 0.38, 0.44, 0.2, 0.226, mat(hair)); // franja na testa
  box(head, -0.27, -0.23, 0.16, 0.3, -0.04, 0.06, mat(K.skin)); // orelhas
  box(head, 0.23, 0.27, 0.16, 0.3, -0.04, 0.06, mat(K.skin));
  // olhos e boca
  for (const sx of [-1, 1]) box(head, sx * 0.1 - 0.035, sx * 0.1 + 0.035, 0.22, 0.33, 0.22, 0.225, mat('#141018'));
  box(head, -0.05, 0.05, 0.12, 0.145, 0.22, 0.225, mat('#b9765a'));
  if (glasses) {
    for (const sx of [-1, 1]) {
      box(head, sx * 0.11 - 0.075, sx * 0.11 + 0.075, 0.2, 0.34, 0.22, 0.235, mat(K.frame));
      box(head, sx * 0.11 - 0.058, sx * 0.11 + 0.058, 0.215, 0.325, 0.235, 0.24, mat(K.glasses));
    }
    box(head, -0.04, 0.04, 0.28, 0.3, 0.225, 0.235, mat(K.frame));
  }
  // boné
  box(head, -0.27, 0.27, 0.42, 0.6, -0.24, 0.22, mat(K.cap));
  box(head, -0.23, 0.23, 0.6, 0.64, -0.2, 0.18, mat(K.capTop));
  box(head, -0.21, 0.21, 0.42, 0.46, 0.22, 0.38, mat(K.cap)); // aba

  // objetos na mão
  let tab = null;
  if (tablet) {
    tab = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.03), [mat('#2a2f3a'), mat('#2a2f3a'), mat('#2a2f3a'), mat('#2a2f3a'), new THREE.MeshBasicMaterial({map: tabletTex()}), mat('#2a2f3a')]);
    m.castShadow = true;
    tab.add(m);
    body.add(tab);
  }
  let wr = null;
  if (wrench) {
    wr = new THREE.Group();
    box(wr, -0.02, 0.02, -0.02, 0.3, -0.015, 0.015, mat('#c9ccd4'));
    box(wr, -0.06, 0.06, 0.28, 0.36, -0.015, 0.015, mat('#c9ccd4'));
    box(wr, -0.02, 0.02, 0.31, 0.37, -0.02, 0.02, mat('#20242f'));
    arms[1].el.add(wr);
    wr.position.set(0, -0.22, 0.05);
  }
  return {root, body, legs, arms, head, tab, wr};
}

// Aplica uma pose. p = {x, z, yaw, walk (fase em rad, null parado), speed 0..1, act, a (fase da ação), sit}
export function poseWorker(w, p) {
  w.root.position.set(p.x, p.y ?? 0, p.z);
  w.root.rotation.y = p.yaw;
  const walk = p.walk != null ? p.speed ?? 1 : 0;
  const ph = p.walk ?? 0;
  const sw = Math.sin(ph) * 0.55 * walk;
  w.body.position.y = Math.abs(Math.cos(ph)) * 0.035 * walk;
  w.legs[0].rotation.x = sw;
  w.legs[1].rotation.x = -sw;
  // braços soltos
  let L = {s: -sw * 0.7, e: -0.15, z: 0.08};
  let R = {s: sw * 0.7, e: -0.15, z: -0.08};
  w.head.rotation.set(0, 0, 0);
  const a = p.a ?? 0;
  switch (p.act) {
    case 'tablet': // segura o tablet na frente, mão direita toca a tela
      L = {s: -0.55, e: -1.15, z: 0.25};
      R = {s: -0.5 - 0.08 * Math.max(0, Math.sin(a * 3)), e: -1.25, z: -0.3};
      w.head.rotation.x = 0.1;
      break;
    case 'type': // painel da CNC: braços para a frente, dedos alternando
      L = {s: -1.0 - 0.07 * Math.sin(a * 7), e: -0.55, z: 0.12};
      R = {s: -1.0 - 0.07 * Math.sin(a * 7 + 2.2), e: -0.55, z: -0.12};
      w.head.rotation.x = 0.05;
      break;
    case 'wrench': // aperto com chave, mão esquerda segura a peça
      L = {s: -0.85, e: -0.65, z: 0.15};
      R = {s: -0.95 + 0.28 * Math.sin(a), e: -0.9 + 0.35 * Math.sin(a + 0.8), z: -0.12};
      w.head.rotation.x = 0.1;
      break;
    case 'bench': // mexe na peça em cima da bancada com as duas mãos
      L = {s: -0.8 + 0.1 * Math.sin(a), e: -0.9, z: 0.18};
      R = {s: -0.75 + 0.12 * Math.sin(a + 1.7), e: -0.95 + 0.15 * Math.sin(a * 2), z: -0.18};
      w.head.rotation.x = 0.12;
      break;
    case 'drive': // sentado, mãos no volante
      L = {s: -1.0, e: -0.5, z: 0.1};
      R = {s: -1.0 + 0.06 * Math.sin(a), e: -0.5, z: -0.1};
      break;
    case 'carry': // leva a peça na frente do corpo
      L = {s: -0.9, e: -0.9, z: 0.2};
      R = {s: -0.9, e: -0.9, z: -0.2};
      break;
  }
  if (p.sit) {
    w.legs[0].rotation.x = -1.45;
    w.legs[1].rotation.x = -1.45;
    w.body.position.y = -0.08;
  }
  if (p.look) w.head.rotation.y = p.look;
  w.arms[0].sh.rotation.set(L.s, 0, L.z);
  w.arms[0].el.rotation.set(L.e, 0, 0);
  w.arms[1].sh.rotation.set(R.s, 0, R.z);
  w.arms[1].el.rotation.set(R.e, 0, 0);
  if (w.tab) {
    // tablet entre as mãos, inclinado para o rosto
    w.tab.position.set(0.02, 0.62, 0.36);
    w.tab.rotation.set(-0.75, 0, 0);
    w.tab.visible = p.act === 'tablet' || p.act === 'walkTablet';
    if (p.act === 'walkTablet') {
      w.tab.position.set(-0.3, 0.42, 0.12);
      w.tab.rotation.set(-0.2, 0, 0.1);
    }
  }
  if (w.wr) w.wr.rotation.set(0.6, 0, 0);
}
