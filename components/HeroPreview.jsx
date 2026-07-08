import { Wordmark } from "@/components/Wordmark";

// Mock estático de dashboard — evoca o app real (Kanban + lead time).
const columns = [
  {
    title: "Peritagem",
    tone: "var(--info)",
    cards: [
      { os: "OS-2041", cli: "MineraSul", tag: "Redutor" },
      { os: "OS-2044", cli: "Ferromax", tag: "Bomba" },
    ],
  },
  {
    title: "Aprovação",
    tone: "var(--warn)",
    cards: [{ os: "OS-2038", cli: "Indústria SP", tag: "Motor" }],
  },
  {
    title: "Execução",
    tone: "var(--brand)",
    cards: [
      { os: "OS-2030", cli: "MineraSul", tag: "Eixo" },
      { os: "OS-2031", cli: "Usicampo", tag: "Caixa" },
    ],
  },
];

export function HeroPreview() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-4 rounded-2xl bg-brand-tint blur-2xl opacity-60"
        aria-hidden
      />
      <div className="relative bg-paper border border-rule rounded-xl shadow-lift overflow-hidden">
        {/* top bar */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-rule bg-paper-2">
          <Wordmark size={14} />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rule-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-rule-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand" />
          </div>
        </div>

        {/* metric strip */}
        <div className="grid grid-cols-3 divide-x divide-rule border-b border-rule">
          {[
            { k: "OS ativas", v: "23" },
            { k: "Lead time médio", v: "6,4d" },
            { k: "Aguard. aprovação", v: "4" },
          ].map((m) => (
            <div key={m.k} className="px-4 py-3">
              <div className="eyebrow !text-[9px]">{m.k}</div>
              <div className="mt-1 text-xl font-semibold text-ink numerals">{m.v}</div>
            </div>
          ))}
        </div>

        {/* kanban */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-paper-2">
          {columns.map((col) => (
            <div key={col.title}>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className="w-2 h-2 rounded-full" style={{ background: col.tone }} />
                <span className="text-[11px] font-medium text-ink-2">{col.title}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map((c) => (
                  <div
                    key={c.os}
                    className="bg-paper border border-rule rounded-md p-2.5 shadow-card-1"
                  >
                    <div className="mono text-[10px] text-faint">{c.os}</div>
                    <div className="text-[12px] font-medium text-ink mt-0.5 leading-tight">
                      {c.cli}
                    </div>
                    <div className="mt-1.5 inline-block text-[10px] text-mute bg-chip rounded px-1.5 py-0.5">
                      {c.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
