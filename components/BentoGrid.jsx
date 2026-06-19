import { Icons } from "@/components/Icons";
import { Brandmark } from "@/components/Brandmark";
import { Reveal } from "@/components/Reveal";

// Bento grid (tema claro) com mini-mockups do OStrack.
// Layout: A (top-esq) · B (top-meio) · C (direita, alto) · D (baixo, largo).

function CardShell({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-paper border border-rule rounded-2xl shadow-card-1 hover:shadow-card-2 transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

function Heading({ title, desc }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-mute leading-relaxed">{desc}</p>
    </div>
  );
}

export function BentoGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:auto-rows-[270px]">
      {/* A — Fila de OS com progresso */}
      <Reveal className="lg:col-start-1 lg:row-start-1 h-full">
        <CardShell className="h-full flex flex-col p-6">
          <Heading title="A fila que anda" desc="Veja, num relance, em que etapa cada OS está e quanto já avançou." />
          <div className="mt-auto space-y-2 pt-5">
            <OsRow os="OS-2041" label="Redutor · Metaltech" pct={72} active />
            <OsRow os="OS-2044" label="Bomba · Ferromax" pct={38} />
          </div>
        </CardShell>
      </Reveal>

      {/* B — Lead time com sparkline */}
      <Reveal delay={80} className="lg:col-start-2 lg:row-start-1 h-full">
        <CardShell className="h-full flex flex-col p-6">
          <Heading title="Lead time sob o olho" desc="O tempo real entre etapas, medido. Você vê a tendência." />
          <div className="mt-auto pt-5">
            <div className="rounded-xl border border-rule bg-paper-2 p-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow !text-[9px]">Lead time médio</span>
                <span className="text-ok text-[11px] mono">▼ 12%</span>
              </div>
              <div className="mt-1 flex items-end justify-between gap-3">
                <span className="text-2xl font-semibold text-ink numerals">6,4d</span>
                <svg viewBox="0 0 120 36" className="w-28 h-9" fill="none">
                  <polyline
                    points="0,28 18,24 36,26 54,18 72,20 90,12 120,8"
                    stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: "os-draw 1.6s ease-out 0.3s forwards" }}
                  />
                  <circle cx="120" cy="8" r="2.6" fill="var(--brand)" />
                </svg>
              </div>
            </div>
          </div>
        </CardShell>
      </Reveal>

      {/* C — Showcase da marca (facho de luz) */}
      <Reveal delay={160} className="lg:col-start-3 lg:row-start-1 lg:row-span-2 h-full">
        <CardShell className="h-full flex flex-col">
          {/* área do facho */}
          <div className="relative flex-1 min-h-[200px] overflow-hidden">
            {/* facho cônico */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[80%] h-[78%] blur-2xl os-glow"
              style={{
                background: "linear-gradient(180deg, var(--brand) 0%, rgba(41,82,227,0.25) 45%, transparent 75%)",
                clipPath: "polygon(18% 0, 82% 0, 60% 100%, 40% 100%)",
              }}
              aria-hidden
            />
            {/* raios finos */}
            <div className="absolute inset-0 flex justify-center gap-3 opacity-50" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-px"
                  style={{ height: "62%", background: "linear-gradient(180deg, var(--brand), transparent)" }}
                />
              ))}
            </div>
            {/* tile da marca */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[44%] os-float-soft">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lift"
                style={{ background: "linear-gradient(180deg, #2B3346 0%, #0A0F1C 100%)", boxShadow: "0 16px 40px rgba(41,82,227,0.35), inset 0 1px 0 rgba(255,255,255,0.18)" }}
              >
                <span className="text-brand"><Brandmark size={36} /></span>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Heading title="A inteligência no centro" desc="Cada evento da OS converge para uma só fonte da verdade, com data, hora e responsável." />
          </div>
        </CardShell>
      </Reveal>

      {/* D — Menu de módulos */}
      <Reveal delay={120} className="lg:col-start-1 lg:col-span-2 lg:row-start-2 h-full">
        <CardShell className="h-full grid sm:grid-cols-2 gap-4 p-6 items-center">
          <Heading title="Tudo num lugar" desc="Peritagem, orçamento, aprovação e execução no mesmo sistema, sem planilha paralela." />
          <div className="rounded-xl border border-rule bg-paper-2 p-3">
            <MenuItem icon="search" label="Peritagem" />
            <MenuItem icon="handshake" label="Orçamento & Aprovação" active />
            <MenuItem icon="kanban" label="Execução" />
            <MenuItem icon="portal" label="Portal do cliente" />
            <MenuItem icon="chart" label="Inteligência" />
          </div>
        </CardShell>
      </Reveal>
    </div>
  );
}

function OsRow({ os, label, pct, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border ${
        active ? "bg-brand text-brand-fg border-brand" : "bg-paper-2 border-rule"
      }`}
    >
      <Icons.kanban width={16} height={16} className={active ? "text-brand-fg" : "text-brand"} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="mono text-[10px] opacity-80 truncate">{os} · {label}</span>
          <span className="text-[10px] opacity-80 numerals shrink-0">{pct}%</span>
        </div>
        <div className={`mt-1 h-1.5 rounded-full ${active ? "bg-white/25" : "bg-rule"}`}>
          <div
            className={`h-full rounded-full ${active ? "bg-white" : "bg-brand"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, active = false }) {
  const Icon = Icons[icon];
  return (
    <div
      className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${
        active ? "bg-brand-tint text-brand font-medium" : "text-ink-2"
      }`}
    >
      <Icon width={16} height={16} className={active ? "text-brand" : "text-mute"} />
      {label}
    </div>
  );
}
