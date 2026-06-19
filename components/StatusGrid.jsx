import { Card } from "@/components/ui";
import { Icons } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

// Grid de status/métrica do que o OStrack passa a dar visibilidade.
// Valores estruturais/verdadeiros (sem inventar % de performance).
const ITEMS = [
  {
    icon: "layers",
    value: "6",
    title: "Etapas rastreadas",
    desc: "Do recebimento à entrega, toda OS percorre o mesmo fluxo auditável.",
  },
  {
    icon: "file",
    value: "100%",
    title: "Trilha de auditoria",
    desc: "Cada movimentação registrada com data, hora e responsável.",
  },
  {
    icon: "handshake",
    value: "1 clique",
    title: "Aprovação do cliente",
    desc: "Orçamento aprovado pelo portal — sem troca de e-mails.",
  },
  {
    icon: "clock",
    value: "Tempo real",
    title: "Visão do chão de fábrica",
    desc: "Status de cada ordem atualizado ao vivo no Kanban.",
  },
];

export function StatusGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ITEMS.map((item, i) => {
        const Icon = Icons[item.icon];
        return (
          <Reveal key={item.title} delay={i * 70}>
            <Card className="h-full hover:shadow-card-2 hover:-translate-y-1 transition-all duration-300">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-brand-tint text-brand">
                <Icon />
              </span>
              <CountUp
                value={item.value}
                className="mt-5 block text-3xl font-semibold tracking-[-0.03em] text-brand numerals"
              />
              <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm text-mute leading-relaxed">{item.desc}</p>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
