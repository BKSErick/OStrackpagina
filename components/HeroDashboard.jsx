import { Wordmark } from "@/components/Wordmark";
import { Icons } from "@/components/Icons";

// Dashboard "viva" do hero — painel central + cards flutuantes animados (CSS puro).
// Evoca a dash real do SaaS e comunica rastreabilidade.

const kanban = [
  { title: "Peritagem", tone: "var(--info)", cards: [{ os: "OS-2041", cli: "MineraSul" }] },
  { title: "Aprovação", tone: "var(--warn)", cards: [{ os: "OS-2038", cli: "Indústria SP" }] },
  { title: "Execução", tone: "var(--brand)", cards: [{ os: "OS-2030", cli: "Usicampo" }] },
];

const trace = [
  { t: "08:12", who: "Recepção", ev: "OS-2041 aberta" },
  { t: "09:40", who: "J. Pereira", ev: "Peritagem concluída" },
  { t: "10:05", who: "Sistema", ev: "Orçamento enviado ao cliente" },
];

export function HeroDashboard() {
  return (
    <div className="relative">
      {/* halo */}
      <div className="absolute -inset-6 rounded-[2rem] bg-brand-tint blur-3xl opacity-60" aria-hidden />

      {/* Painel principal */}
      <div className="relative os-float-soft bg-paper border border-rule rounded-xl shadow-lift overflow-hidden">
        <div className="flex items-center justify-between px-4 h-12 border-b border-rule bg-paper-2">
          <Wordmark size={14} />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] text-ok mono">
              <span className="w-1.5 h-1.5 rounded-full bg-ok os-live" /> AO VIVO
            </span>
          </div>
        </div>

        {/* métricas */}
        <div className="grid grid-cols-3 divide-x divide-rule border-b border-rule">
          {[
            { k: "OS ativas", v: "23" },
            { k: "Lead time", v: "6,4d" },
            { k: "Aguard. aprov.", v: "4" },
          ].map((m) => (
            <div key={m.k} className="px-4 py-3">
              <div className="eyebrow !text-[9px]">{m.k}</div>
              <div className="mt-1 text-xl font-semibold text-ink numerals">{m.v}</div>
            </div>
          ))}
        </div>

        {/* mini kanban */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-paper-2">
          {kanban.map((col) => (
            <div key={col.title}>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className="w-2 h-2 rounded-full" style={{ background: col.tone }} />
                <span className="text-[11px] font-medium text-ink-2">{col.title}</span>
              </div>
              {col.cards.map((c) => (
                <div key={c.os} className="bg-paper border border-rule rounded-md p-2.5 shadow-card-1">
                  <div className="mono text-[10px] text-faint">{c.os}</div>
                  <div className="text-[12px] font-medium text-ink mt-0.5">{c.cli}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* faixa de rastreabilidade */}
        <div className="px-4 py-2.5 border-t border-rule bg-paper flex items-center gap-2 text-[11px] text-mute">
          <Icons.clock width={14} height={14} className="text-brand" />
          Cada evento da OS, com data, hora e responsável.
        </div>
      </div>

      {/* ── Card flutuante: sparkline lead time ── */}
      <div className="hidden sm:block absolute -top-6 -right-6 w-44 os-float-slow">
        <div className="bg-paper border border-rule rounded-lg shadow-lift p-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow !text-[9px]">Lead time (12 sem)</span>
            <span className="text-ok text-[11px] mono">▼ 28%</span>
          </div>
          <svg viewBox="0 0 140 44" className="mt-2 w-full h-11" fill="none">
            <polyline
              points="0,34 20,30 40,32 60,24 80,26 100,16 120,14 140,8"
              stroke="var(--brand)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 260, strokeDashoffset: 260, animation: "os-draw 1.6s ease-out 0.4s forwards" }}
            />
            <circle cx="140" cy="8" r="3" fill="var(--brand)" />
          </svg>
        </div>
      </div>

      {/* ── Card flutuante: anel OS por etapa ── */}
      <div className="hidden sm:block absolute -bottom-8 -left-6 w-40 os-float">
        <div className="bg-paper border border-rule rounded-lg shadow-lift p-3 flex items-center gap-3">
          <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90">
            <circle cx="22" cy="22" r="18" stroke="var(--rule)" strokeWidth="5" fill="none" />
            <circle
              cx="22" cy="22" r="18"
              stroke="var(--brand)" strokeWidth="5" fill="none" strokeLinecap="round"
              style={{
                strokeDasharray: 113,
                strokeDashoffset: 113,
                ["--ring-target"]: 34,
                animation: "os-ring 1.4s ease-out 0.6s forwards",
              }}
            />
          </svg>
          <div>
            <div className="text-lg font-semibold text-ink numerals leading-none">70%</div>
            <div className="text-[10px] text-mute mt-1 leading-tight">das OS já passaram da aprovação</div>
          </div>
        </div>
      </div>

      {/* ── Card flutuante: rastreabilidade ── */}
      <div className="hidden lg:block absolute top-1/2 -right-10 -translate-y-1/2 w-52 os-float-soft" style={{ animationDelay: "0.8s" }}>
        <div className="bg-paper border border-rule rounded-lg shadow-lift p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="mono text-[10px] text-ink-2">OS-2041 · trilha</span>
            <span className="w-1.5 h-1.5 rounded-full bg-ok os-live" />
          </div>
          <ul className="space-y-2">
            {trace.map((e, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mono text-[10px] text-faint w-8 shrink-0">{e.t}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1 shrink-0" />
                <span className="text-[10px] text-ink-2 leading-tight">
                  {e.ev}
                  <span className="text-faint"> · {e.who}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
