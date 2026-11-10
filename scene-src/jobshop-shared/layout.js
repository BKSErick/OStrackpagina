// Oficina de manutenção industrial (Job Shop do OStrack), reconstruída da referência ref/oficina.png.
// Tudo em metros. Câmera e sala vêm de ref/fit.py (erro médio 3,3 px na referência de 1536 x 1024); a posição de
// cada peça vem de ref/w.py, que leva um pixel do chão da referência para o mundo.
//
// Mundo: canto da frente do piso em X=0, Z=0. X corre ao longo da parede do fundo-esquerda (na tela sobe para a
// direita), Z cresce para a frente (na tela desce para a direita). Parede fundo-esquerda em Z=-LZ, parede
// fundo-direita em X=LX. Piso em Y=0.

export const CAM = {
  th: 0.64298, // azimute (36,84°)
  ph: 0.41782, // elevação (23,94°)
  s: 88, // px da referência por metro
  ox: 573.61, // pixel da referência do canto da frente do piso
  oy: 866.09,
  refW: 1536,
  refH: 1024,
};

export const ROOM = {LX: 11.79, LZ: 9.22, H: 2.65, T: 0.29, WT: 0.38};

// Tamanho do pixel da arte, fixo no mundo: 3 px da referência. É o que dá o aspecto de pixel art.
export const ART_PX = 3 / CAM.s;

// Vetores de tela da câmera (r = direita, u = cima) e a direção de volta para a câmera.
const {th, ph} = CAM;
export const AXES = {
  r: [Math.cos(th), 0, Math.sin(th)],
  u: [Math.sin(th) * Math.sin(ph), Math.cos(ph), -Math.cos(th) * Math.sin(ph)],
  back: [-Math.sin(th) * Math.cos(ph), Math.sin(ph), Math.cos(th) * Math.cos(ph)],
};

// pixel da referência <-> mundo. Um ponto do mundo P vai para (ox + s·r·P, oy - s·u·P).
export const toRef = ([x, y, z]) => {
  const {r, u} = AXES;
  return [CAM.ox + CAM.s * (r[0] * x + r[1] * y + r[2] * z), CAM.oy - CAM.s * (u[0] * x + u[1] * y + u[2] * z)];
};
// ponto do plano da câmera que cai no pixel (px, py) da referência
export const fromRef = (px, py) => {
  const a = (px - CAM.ox) / CAM.s;
  const b = -(py - CAM.oy) / CAM.s;
  const {r, u} = AXES;
  return [a * r[0] + b * u[0], a * r[1] + b * u[1], a * r[2] + b * u[2]];
};

// Enquadramento da referência inteira: centro e escala em pixels da referência.
export const SHOT_FULL = {cx: 768, cy: 512, w: 1536, h: 1024};
// A sala com folga, para viewports de outra proporção
export const ROOM_BOX = {x0: 96, x1: 1438, y0: 126, y1: 900};

// Estações: cada uma é uma etapa da O.S. A área (x0..x1, z0..z1) é a faixa amarela no chão e o alvo do clique.
export const STATIONS = [
  {id: 'recebimento', n: 1, name: 'Recebimento', box: [0.3, 2.95, -8.75, -6.0], focus: [1.6, 0.6, -7.2]},
  {id: 'desmontagem', n: 2, name: 'Desmontagem e peritagem', box: [3.95, 7.45, -8.9, -6.6], focus: [5.6, 0.8, -7.7]},
  {id: 'usinagem', n: 3, name: 'Usinagem', box: [7.6, 11.5, -8.95, -6.35], focus: [9.9, 1.0, -8.0]},
  {id: 'montagem', n: 4, name: 'Reparo e montagem', box: [0.7, 4.4, -3.75, -1.1], focus: [2.6, 0.9, -2.4]},
  {id: 'teste', n: 5, name: 'Teste e inspeção', box: [5.0, 9.0, -2.85, -0.55], focus: [6.4, 0.9, -2.0]},
  {id: 'expedicao', n: 6, name: 'Expedição', box: [9.8, 11.5, -3.3, -0.6], focus: [10.6, 0.8, -1.9]},
];

// Faixas amarelas no chão: retângulos [x0, x1, z0, z1] e linhas soltas [[x, z], [x, z]]
export const MARK_RECTS = [
  [0.3, 2.95, -8.75, -6.0],
  [3.95, 7.45, -8.9, -6.6],
  [0.7, 4.4, -3.75, -1.1],
  [5.0, 9.0, -2.85, -0.55],
  [9.8, 11.55, -3.3, -0.6],
];
export const MARK_LINES = [
  [[8.0, -6.35], [10.85, -6.35]],
  [[10.85, -6.35], [10.85, -4.3]],
];
// setas pintadas na frente da expedição, apontando para a porta (+X)
export const MARK_ARROWS = {z: -0.78, x: [10.0, 10.35, 10.7, 11.05], size: 0.16};
export const MARK_W = 0.14;
