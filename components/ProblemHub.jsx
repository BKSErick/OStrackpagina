import { Icons } from "@/components/Icons";

// Hub radial da seção "O Problema" — fundo CLARO (igual à página).
// Núcleo (cérebro = inteligência do OStrack) com as etapas convergindo a ele.
// SVG: anéis finos + linhas conectoras com pontos fluindo pro centro.
// HTML: núcleo + chips das etapas posicionados sobre os nós do SVG.

const C = 200; // centro do viewBox 400x400
const R = 150; // raio dos nós
const nodes = [
  { icon: "search", label: "Peritagem", x: C, y: C - R, css: "left-1/2 top-[8%] -translate-x-1/2", delay: "0s" },
  { icon: "handshake", label: "Aprovação", x: C + R, y: C, css: "right-[8%] top-1/2 -translate-y-1/2", delay: "0.4s" },
  { icon: "wrench", label: "Execução", x: C, y: C + R, css: "left-1/2 bottom-[8%] -translate-x-1/2", delay: "0.8s" },
  { icon: "truck", label: "Entrega", x: C - R, y: C, css: "left-[8%] top-1/2 -translate-y-1/2", delay: "1.2s" },
];

export function ProblemHub() {
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      {/* glow suave do núcleo (sutil no claro) */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <div
          className="os-glow w-44 h-44 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand-tint) 0%, transparent 70%)" }}
        />
      </div>

      {/* estrutura orbital */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" fill="none">
        {/* anéis */}
        <circle cx={C} cy={C} r={R} stroke="var(--rule-2)" strokeWidth="1" />
        <circle cx={C} cy={C} r="92" stroke="var(--rule)" strokeWidth="1" strokeDasharray="3 6" className="os-spin-rev" style={{ transformOrigin: "center" }} />

        {/* linhas conectoras + pontos fluindo */}
        {nodes.map((n) => (
          <g key={n.label}>
            <line x1={C} y1={C} x2={n.x} y2={n.y} stroke="var(--brand-line)" strokeWidth="1" />
            <line
              x1={C} y1={C} x2={n.x} y2={n.y}
              stroke="var(--brand)" strokeWidth="2" strokeLinecap="round"
              strokeDasharray="2 12"
              style={{ animation: "os-flow 1.1s linear infinite", animationDelay: n.delay }}
            />
          </g>
        ))}
      </svg>

      {/* núcleo: cérebro */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center os-float-soft">
          <div
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(180deg, #5B86F5 0%, #2952E3 100%)",
              boxShadow: "0 12px 32px rgba(41,82,227,0.45), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -3px 8px rgba(0,0,0,0.18)",
            }}
          >
            <Icons.brain width={38} height={38} />
          </div>
          <span className="mt-2.5 mono text-[10px] uppercase tracking-[0.16em] text-brand font-medium">
            OStrack
          </span>
        </div>
      </div>

      {/* etapas (chips claros) */}
      {nodes.map((n) => {
        const Icon = Icons[n.icon];
        return (
          <div key={n.label} className={`absolute ${n.css}`}>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full bg-paper border border-rule flex items-center justify-center text-brand"
                style={{ animation: "os-node 3.2s ease-in-out infinite", animationDelay: n.delay }}
              >
                <Icon width={22} height={22} />
              </div>
              <span className="text-xs font-medium text-ink-2 bg-paper/80 px-1.5 rounded">
                {n.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
