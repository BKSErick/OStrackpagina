// O filme da oficina: render(t) puro sobre o mesmo state(t) da página ao vivo. Gravado frame a frame pelo
// capture.mjs da skill teardown. ?shot=ref enquadra exatamente como a referência (1536 x 1024, escala 1).
import {runSim} from 'teardown-kit/runtime.js';
import {ROOM_BOX, SHOT_FULL} from './layout.js';
import {LOOP, state} from './sim.js';
import {BG, createStage} from './stage.js';

export const DEFAULTS = {
  duration: LOOP,
  fps: 60,
  theme: 'dark',
  hud: {enabled: false, title: 'Oficina', subtitle: ''},
  director: {enabled: false},
  watermark: '',
};

// encaixa a sala (ou a referência inteira) no viewport
export const fitShot = (w, h, box = ROOM_BOX, pad = 1) => {
  const bw = box.x1 - box.x0;
  const bh = box.y1 - box.y0;
  return {cx: (box.x0 + box.x1) / 2, cy: (box.y0 + box.y1) / 2, k: Math.min(w / bw, h / bh) * pad};
};
export const REF_BOX = {x0: 0, x1: SHOT_FULL.w, y0: 0, y1: SHOT_FULL.h};

export const run = () =>
  runSim(DEFAULTS, async ({canvas, capture}) => {
    document.documentElement.style.setProperty('--bg', BG);
    const q = new URLSearchParams(location.search);
    const st = createStage({canvas});
    const size = () => [canvas.clientWidth || innerWidth, canvas.clientHeight || innerHeight];
    const resize = () => {
      const [w, h] = size();
      st.resize(w, h, capture ? devicePixelRatio || 1 : Math.min(devicePixelRatio || 1, 2));
    };
    resize();
    const shot = () => {
      const [w, h] = size();
      return q.get('shot') === 'ref' || window.__SIM_CONFIG?.shot === 'ref' ? fitShot(w, h, REF_BOX) : fitShot(w, h, REF_BOX);
    };
    st.frame(state(0), shot());
    await st.warm();
    window.STAGE = st;
    return {
      resize,
      render(t) {
        st.frame(state(t), shot());
        return {};
      },
    };
  });
