// Palco: câmera ortográfica com os ângulos medidos na referência, luz e o passe de pixel art.
//
// Pixel art: a cena é desenhada numa grade fixa no mundo (ART_PX = 3 px da referência = 3,4 cm), com a câmera
// encaixada nessa grade, e ampliada sem suavizar. Um segundo passe grava normal e um id por objeto; a composição
// desenha 1 pixel de contorno escuro onde o id muda (do lado do objeto da frente) e clareia as quinas dentro do
// mesmo objeto. É o que dá o traço da referência.
import * as THREE from 'three';
import {AXES, CAM, ROOM} from './layout.js';
import {buildShop} from './scene.js';

export const BG = '#11131d';

const AUX_VS = `
#include <clipping_planes_pars_vertex>
varying vec3 vN;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  #include <begin_vertex>
  #include <project_vertex>
  #include <clipping_planes_vertex>
}`;
const AUX_FS = `
#include <clipping_planes_pars_fragment>
uniform float uId;
varying vec3 vN;
void main() {
  #include <clipping_planes_fragment>
  gl_FragColor = vec4(normalize(vN) * 0.5 + 0.5, uId / 255.0);
}`;

const COMP_VS = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const COMP_FS = `
precision highp float;
uniform sampler2D tColor;
uniform sampler2D tAux;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform float uRange;
uniform vec3 uBg;
uniform vec3 uBg2;
uniform vec3 uInk;
uniform vec2 uHi;     // faixa de ids realçada (estação sob o mouse); x < 0 nenhuma
uniform vec3 uHiColor;
uniform float uHiK;
uniform float uDim;    // escurece o que não é a estação em foco
uniform vec2 uFocus;  // faixa de ids da estação em foco
uniform vec4 uCrew;   // ids dos operadores que contam como parte da estação em foco
uniform vec2 uView;    // tamanho da tela em px, para a vinheta
varying vec2 vUv;

float depthAt(vec2 uv) { return texture2D(tDepth, uv).x * uRange; }

void main() {
  vec2 uv = vUv;
  float d = texture2D(tDepth, uv).x;
  if (d >= 0.99999) {
    // fundo: vinheta leve
    vec2 q = (uv - 0.5) * vec2(uView.x / uView.y, 1.0);
    float v = smoothstep(0.2, 1.1, length(q));
    gl_FragColor = linearToOutputTexel(vec4(mix(uBg2, uBg, v), 1.0));
    return;
  }
  vec3 col = texture2D(tColor, uv).rgb;
  vec4 a = texture2D(tAux, uv);
  float id = floor(a.a * 255.0 + 0.5);
  vec3 n = a.rgb * 2.0 - 1.0;
  float z = d * uRange;

  float ink = 0.0;
  float crease = 0.0;
  vec2 offs[4];
  offs[0] = vec2(uTexel.x, 0.0);
  offs[1] = vec2(-uTexel.x, 0.0);
  offs[2] = vec2(0.0, uTexel.y);
  offs[3] = vec2(0.0, -uTexel.y);
  for (int i = 0; i < 4; i++) {
    vec2 o = uv + offs[i];
    float dn = texture2D(tDepth, o).x;
    vec4 an = texture2D(tAux, o);
    float idn = floor(an.a * 255.0 + 0.5);
    float zn = dn * uRange;
    bool bgN = dn >= 0.99999;
    // contorno: o vizinho é outro objeto (ou fundo) e está atrás deste pixel
    if (bgN || (idn != id && zn > z + 0.02) ) ink = 1.0;
    // contorno de silhueta dentro do mesmo objeto (braço na frente do tronco)
    if (!bgN && idn == id && zn > z + 0.35) ink = 1.0;
    if (!bgN && idn == id && abs(zn - z) < 0.3) {
      vec3 nn = an.rgb * 2.0 - 1.0;
      if (dot(nn, n) < 0.75) crease = max(crease, 1.0);
    }
  }
  if (crease > 0.0 && ink == 0.0) col = mix(col, col * 1.18 + 0.03, 0.75);
  col = mix(col, uInk, ink * 0.92);

  // destaque da estação (hover) e foco
  bool inHi = uHi.x >= 0.0 && id >= uHi.x - 0.5 && id <= uHi.y + 0.5;
  if (inHi) col = mix(col, uHiColor, uHiK * (ink > 0.0 ? 0.9 : 0.14));
  bool inFocus = uFocus.x < 0.0 || (id >= uFocus.x - 0.5 && id <= uFocus.y + 0.5)
    || abs(id - uCrew.x) < 0.5 || abs(id - uCrew.y) < 0.5 || abs(id - uCrew.z) < 0.5 || abs(id - uCrew.w) < 0.5;
  if (!inFocus) {
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, mix(vec3(l), uBg, 0.55), uDim);
  }

  gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
}`;

export function createStage({canvas}) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 1);
  // nada passa da face de fora da parede do fundo-direita (a empilhadeira sai por ali)
  renderer.clippingPlanes = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), ROOM.LX)];

  const scene = new THREE.Scene();
  const shop = buildShop(scene);

  // luz: céu frio, chão escuro, sol baixo da esquerda-frente, luminárias quentes
  const hemi = new THREE.HemisphereLight('#c1cbe6', '#454858', 2.05);
  scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe8c7', 1.85);
  key.position.set(1.0, 12, 1.5);
  key.target.position.set(6.5, 0, -4.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -10;
  sc.right = 10;
  sc.top = 10;
  sc.bottom = -10;
  sc.near = 1;
  sc.far = 30;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  scene.add(key, key.target);
  const lampLights = shop.lamps.map((l) => {
    const p = new THREE.PointLight('#ffd49c', 3.0, 4.5, 1.6);
    p.position.set(...l.pos);
    if (l.axis === 'z') p.position.x += 0.3; // a da porta da direita: encostada na parede, não estoura o engradado
    scene.add(p);
    return p;
  });

  // câmera ortográfica: direita r, cima u, volta para a câmera "back"
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 80);
  const R = new THREE.Vector3(...AXES.r);
  const U = new THREE.Vector3(...AXES.u);
  const BACK = new THREE.Vector3(...AXES.back);
  camera.up.copy(U);
  const RANGE = camera.far - camera.near;

  // alvos de render em baixa resolução
  const mkRT = (depth) => {
    const rt = new THREE.WebGLRenderTarget(4, 4, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false});
    if (depth) {
      rt.depthTexture = new THREE.DepthTexture(4, 4);
      rt.depthTexture.type = THREE.UnsignedIntType;
    }
    return rt;
  };
  const rtColor = mkRT(true);
  const rtAux = mkRT(false);
  rtColor.texture.colorSpace = THREE.SRGBColorSpace;

  // id por objeto (para o contorno) e material do passe auxiliar
  const ids = new Map();
  const auxMats = new Map();
  const auxOf = (id) => {
    if (!auxMats.has(id)) auxMats.set(id, new THREE.ShaderMaterial({vertexShader: AUX_VS, fragmentShader: AUX_FS, uniforms: {uId: {value: id}}, clipping: true}));
    return auxMats.get(id);
  };
  let nextId = 1;
  const meshes = [];
  const decals = []; // halos de luz: só no passe de cor
  const assign = (o, id) => {
    if (o.userData.oid) {
      id = nextId++;
      ids.set(o, id);
    }
    if (o.isMesh) {
      o.userData.id = id;
      if (o.userData.noAux) decals.push(o);
      else meshes.push(o);
    }
    for (const c of o.children) assign(c, id);
  };
  assign(scene, 0);
  // faixa de ids de cada estação (as peças de uma estação são numeradas em sequência)
  const stationIds = {};
  scene.traverse((o) => {
    if (!o.userData.station) return;
    let lo = Infinity;
    let hi = -Infinity;
    o.traverse((c) => {
      if (ids.has(c)) {
        lo = Math.min(lo, ids.get(c));
        hi = Math.max(hi, ids.get(c));
      }
    });
    if (lo <= hi) stationIds[o.userData.station] = [lo, hi];
  });
  const stationAt = (id) => Object.keys(stationIds).find((k) => id >= stationIds[k][0] && id <= stationIds[k][1]) ?? null;

  const comp = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader: COMP_VS,
      fragmentShader: COMP_FS,
      uniforms: {
        tColor: {value: rtColor.texture},
        tAux: {value: rtAux.texture},
        tDepth: {value: rtColor.depthTexture},
        uTexel: {value: new THREE.Vector2()},
        uRange: {value: RANGE},
        uBg: {value: new THREE.Color(BG)},
        uBg2: {value: new THREE.Color('#191c2a')},
        uInk: {value: new THREE.Color('#0e1018')},
        uHi: {value: new THREE.Vector2(-1, -1)},
        uHiColor: {value: new THREE.Color('#2952e3')},
        uHiK: {value: 0},
        uDim: {value: 0},
        uFocus: {value: new THREE.Vector2(-1, -1)},
        uCrew: {value: new THREE.Vector4(-9, -9, -9, -9)},
        uView: {value: new THREE.Vector2(1, 1)},
      },
      depthTest: false,
      depthWrite: false,
    }),
  );
  comp.frustumCulled = false;
  const compScene = new THREE.Scene();
  compScene.add(comp);
  const compCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let W = 1;
  let Hh = 1;
  let PR = 1;
  const resize = (w, h, pr) => {
    W = w;
    Hh = h;
    PR = pr;
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    comp.material.uniforms.uView.value.set(w, h);
  };

  // shot = {cx, cy, k}: centro em px da referência e escala (px da tela por px da referência)
  const place = (shot) => {
    const k = shot.k;
    const px = Math.max(3 * k, 1.5); // tamanho do pixel da arte na tela, em px CSS
    const tw = Math.max(8, Math.ceil(W / px));
    const th = Math.max(8, Math.ceil(Hh / px));
    if (rtColor.width !== tw || rtColor.height !== th) {
      rtColor.setSize(tw, th);
      rtAux.setSize(tw, th);
    }
    comp.material.uniforms.uTexel.value.set(1 / tw, 1 / th);
    const hw = (W / (k * CAM.s)) / 2;
    const hh = (Hh / (k * CAM.s)) / 2;
    camera.left = -hw;
    camera.right = hw;
    camera.top = hh;
    camera.bottom = -hh;
    camera.updateProjectionMatrix();
    // centro no plano da câmera, encaixado na grade de pixel da arte
    let a = (shot.cx - CAM.ox) / CAM.s;
    let b = -(shot.cy - CAM.oy) / CAM.s;
    const step = (2 * hw) / tw;
    a = Math.round(a / step) * step;
    b = Math.round(b / step) * step;
    const target = new THREE.Vector3().addScaledVector(R, a).addScaledVector(U, b);
    camera.position.copy(target).addScaledVector(BACK, 40);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  };

  const frame = (s, shot, ui = {}) => {
    shop.update(s);
    lampLights.forEach((l, i) => (l.intensity = [1.9, 2.4, 1.15, 1.4][i] * (s.lamps?.[i] ?? 1)));
    place(shot);
    // passe de cor
    renderer.setRenderTarget(rtColor);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    renderer.render(scene, camera);
    // passe auxiliar: normal + id
    const saved = meshes.map((m) => m.material);
    meshes.forEach((m) => (m.material = auxOf(m.userData.id)));
    decals.forEach((m) => (m.visible = false));
    const sm = renderer.shadowMap.autoUpdate;
    renderer.shadowMap.autoUpdate = false;
    renderer.setRenderTarget(rtAux);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.shadowMap.autoUpdate = sm;
    meshes.forEach((m, i) => (m.material = saved[i]));
    decals.forEach((m) => (m.visible = true));
    // composição na tela
    const u = comp.material.uniforms;
    const hr = ui.hi && stationIds[ui.hi];
    u.uHi.value.set(hr ? hr[0] : -1, hr ? hr[1] : -1);
    u.uHiK.value = ui.hiK ?? 0;
    const fr = ui.focus && stationIds[ui.focus];
    u.uFocus.value.set(fr ? fr[0] : -1, fr ? fr[1] : -1);
    u.uDim.value = ui.dim ?? 0;
    const crew = (ui.crew ?? []).map((k) => ids.get(shop.workers[k].root) ?? -9);
    u.uCrew.value.set(crew[0] ?? -9, crew[1] ?? -9, crew[2] ?? -9, crew[3] ?? -9);
    renderer.setRenderTarget(null);
    renderer.render(compScene, compCam);
  };

  // id do objeto sob um ponto da tela (para o clique na estação): lê o passe auxiliar
  const pickBuf = new Uint8Array(4);
  const pick = (x, y) => {
    const tx = Math.floor((x / W) * rtAux.width);
    const ty = Math.floor((1 - y / Hh) * rtAux.height);
    if (tx < 0 || ty < 0 || tx >= rtAux.width || ty >= rtAux.height) return -1;
    renderer.readRenderTargetPixels(rtAux, tx, ty, 1, 1, pickBuf);
    return pickBuf[3];
  };

  const warm = () => renderer.compileAsync(scene, camera);
  return {renderer, scene, camera, shop, resize, frame, place, warm, pick, stationIds, stationAt, ids, comp};
}
