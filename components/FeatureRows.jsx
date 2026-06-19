import Link from "next/link";
import { Icons } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

// Feature rows alternadas (texto + mockup) — tema claro OStrack.

const ROWS = [
  {
    title: "Aprovação que não dorme no e-mail.",
    desc: "O orçamento vai direto pro portal do cliente. Ele aprova, questiona ou pede ajuste, e a OS volta a andar na hora, sem ficar refém de uma resposta perdida na caixa de entrada.",
    sub: "É aqui que o seu lead time encurta de verdade.",
    bullets: [
      "Aprovação digital em 1 clique",
      "Notificação automática a cada etapa",
      "Histórico de decisão registrado",
    ],
    link: { label: "Ver o fluxo completo", href: "/como-funciona" },
    mockup: "approval",
    reverse: false,
  },
  {
    title: "Enxergue o lead time antes que ele te surpreenda.",
    desc: "Dashboards mostram o tempo de cada etapa e onde a fila trava. Você decide pelo dado real da oficina, não pelo achismo de fim de mês.",
    sub: "O gargalo deixa de ser invisível.",
    bullets: [
      "Tempo medido por etapa",
      "Gargalos identificados no fluxo",
      "Visão em tempo real do chão de fábrica",
    ],
    link: { label: "Solicitar demo", href: "/contato" },
    mockup: "charts",
    reverse: true,
  },
];

export function FeatureRows() {
  return (
    <div className="space-y-20 lg:space-y-28">
      {ROWS.map((row, i) => (
        <div
          key={i}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* texto */}
          <Reveal className={row.reverse ? "lg:order-2" : ""}>
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink leading-[1.1]">
              {row.title}
            </h3>
            <p className="mt-5 text-mute text-lg leading-relaxed">{row.desc}</p>
            {row.sub && <p className="mt-3 text-ink-2 font-medium">{row.sub}</p>}
            <Link
              href={row.link.href}
              className="mt-6 inline-flex items-center gap-2 text-brand font-medium hover:gap-3 transition-all"
            >
              {row.link.label} <Icons.arrowRight />
            </Link>
            <ul className="mt-7 space-y-3">
              {row.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-ink-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-brand-tint text-brand shrink-0">
                    <Icons.check width={15} height={15} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* mockup */}
          <Reveal delay={120} className={row.reverse ? "lg:order-1" : ""}>
            {row.mockup === "approval" ? <ApprovalMock /> : <ChartsMock />}
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function ApprovalMock() {
  const items = [
    { n: "Mancal de rolamento", v: "R$ 1.240" },
    { n: "Vedação + retentor", v: "R$ 380" },
    { n: "Mão de obra (peritagem)", v: "R$ 650" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-brand-tint blur-3xl opacity-60" aria-hidden />
      <div className="relative bg-paper border border-rule rounded-2xl shadow-lift p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow !text-[9px]">Orçamento</div>
            <div className="mono text-sm text-ink-2 mt-0.5">OS-2041 · Metaltech</div>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-ok mono">
            <span className="w-1.5 h-1.5 rounded-full bg-ok os-live" /> No portal
          </span>
        </div>

        <div className="mt-4 divide-y divide-rule border-y border-rule">
          {items.map((it) => (
            <div key={it.n} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-ink-2">{it.n}</span>
              <span className="numerals text-ink">{it.v}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-mute">Total</span>
          <span className="text-xl font-semibold text-ink numerals">R$ 2.270</span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            className="relative overflow-hidden flex-1 h-11 rounded-full text-white text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, #2541C7 0%, #2952E3 50%, #5B86F5 100%)",
              boxShadow: "0 12px 26px rgba(30,64,175,0.4), 0 0 0 1px rgba(191,219,254,0.3)",
            }}
          >
            <span
              className="pointer-events-none absolute top-0 left-0 h-full w-2/5"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "os-shimmer 3.6s ease-in-out infinite alternate" }}
            />
            Aprovar orçamento
          </button>
          <button className="h-11 px-4 rounded-full border border-rule text-ink-2 text-sm hover:bg-paper-3">
            Pedir ajuste
          </button>
        </div>
      </div>

      {/* chip flutuante */}
      <div className="absolute -bottom-4 -right-2 os-float-soft">
        <div className="flex items-center gap-2 bg-paper border border-rule rounded-full shadow-lift px-3 py-1.5">
          <span className="w-5 h-5 rounded-full bg-ok/10 text-ok flex items-center justify-center text-[11px]">✓</span>
          <span className="text-[11px] text-ink-2 font-medium">Cliente aprovou · 10:05</span>
        </div>
      </div>
    </div>
  );
}

function ChartsMock() {
  const bars = [
    { h: 45, label: "Entrada", n: 3 },
    { h: 68, label: "Perit.", n: 5 },
    { h: 92, label: "Aprov.", n: 7 },
    { h: 54, label: "Exec.", n: 4 },
    { h: 38, label: "Mont.", n: 2 },
    { h: 30, label: "Entrega", n: 2 },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-brand-tint blur-3xl opacity-60" aria-hidden />
      <div className="relative bg-paper border border-rule rounded-2xl shadow-lift p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-medium text-ink-2 bg-paper-3 rounded px-2 py-1">Lead time</span>
          <span className="text-[11px] text-mute px-2 py-1">Throughput</span>
          <span className="text-[11px] text-mute px-2 py-1">Gargalos</span>
        </div>

        {/* tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-rule bg-paper-2 p-3">
            <div className="eyebrow !text-[9px]">Lead time médio</div>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-2xl font-semibold text-ink numerals">6,4d</span>
              <span className="text-ok text-[11px] mono">▼ 12%</span>
            </div>
          </div>
          <div className="rounded-xl border border-rule bg-paper-2 p-3">
            <div className="eyebrow !text-[9px]">OS entregues / sem</div>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-2xl font-semibold text-ink numerals">18</span>
              <span className="text-ok text-[11px] mono">▲ 9%</span>
            </div>
          </div>
        </div>

        {/* barras */}
        <div className="mt-4 rounded-xl border border-rule bg-paper-2 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow !text-[9px]">OS por etapa</span>
            <span className="mono text-[10px] text-warn">● gargalo na aprovação</span>
          </div>
          <div className="flex items-end gap-2.5 h-28">
            {bars.map((b, i) => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-ink-2 numerals font-medium">{b.n}</span>
                <div
                  className={`w-full rounded-t origin-bottom ${b.label === "Aprov." ? "bg-warn" : "bg-brand/80"}`}
                  style={{ height: `${b.h}%`, animation: `os-bar 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 mt-2 pt-2 border-t border-rule">
            {bars.map((b) => (
              <span key={b.label} className="flex-1 text-center text-[9px] text-mute">
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
