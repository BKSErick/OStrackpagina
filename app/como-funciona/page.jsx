import { Section, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { FlowTimeline } from "@/components/FlowTimeline";
import { BentoGrid } from "@/components/BentoGrid";

export const metadata = {
  title: "Como funciona",
  description:
    "O ciclo completo da OS no OStrack: entrada, peritagem, aprovação, execução, montagem e entrega.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-20 pb-10">
        <Reveal>
          <Eyebrow>Como funciona</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-ink max-w-3xl leading-[1.05]">
            O caminho da OS, da bancada à entrega.
          </h1>
          <p className="mt-5 text-lg text-mute max-w-2xl leading-relaxed">
            Toda ordem de serviço percorre seis etapas rastreáveis. Cada
            transição fica registrada — então você não descobre o atraso no fim,
            descobre na hora em que ele acontece.
          </p>
        </Reveal>
      </Section>

      {/* Timeline interna (operação) — linha desenhada conforme o scroll */}
      <Section className="py-10">
        <FlowTimeline />
      </Section>

      {/* Status — o que você passa a enxergar */}
      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>O que você passa a enxergar</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Cada OS, sob controle e auditável.
          </h2>
          <p className="mt-4 text-mute text-lg">
            O fluxo só funciona porque tudo fica registrado. É isso que você
            ganha de visibilidade.
          </p>
        </Reveal>
        <div className="mt-12">
          <BentoGrid />
        </div>
      </Section>
    </>
  );
}
