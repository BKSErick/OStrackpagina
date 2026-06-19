import { Section, Eyebrow, Card } from "@/components/ui";
import { Icons } from "@/components/Icons";
import { FEATURES } from "@/components/content";
import { Reveal } from "@/components/Reveal";
import { FeatureRows } from "@/components/FeatureRows";

export const metadata = {
  title: "Recursos",
  description:
    "Kanban de OS, peritagem e diagnóstico em PDF, orçamento e aprovação digital, portal do cliente, inteligência de lead time e gestão da equipe técnica.",
};

export default function RecursosPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-20 pb-10">
        <Reveal>
          <Eyebrow>Recursos</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-ink max-w-3xl leading-[1.05]">
            Cada recurso existe pra tirar uma OS do limbo.
          </h1>
          <p className="mt-5 text-lg text-mute max-w-2xl leading-relaxed">
            Nada de planilha paralela. Tudo no OStrack aponta para a mesma meta:
            encurtar o lead time e fazer a peça andar na fila.
          </p>
        </Reveal>
      </Section>

      <Section className="py-10">
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = Icons[f.icon];
            return (
              <Reveal key={f.title} delay={i * 70}>
                <Card className="h-full hover:shadow-card-2 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-md bg-brand-tint text-brand">
                      <Icon />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-ink">{f.title}</h2>
                      <p className="mt-1.5 text-sm text-mute leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Feature rows alternadas */}
      <Section className="py-16">
        <Reveal className="max-w-2xl mb-16">
          <Eyebrow>Em detalhe</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Os recursos que destravam o gargalo.
          </h2>
          <p className="mt-4 text-mute text-lg">
            Onde o OStrack ataca diretamente o lead time da sua recuperadora.
          </p>
        </Reveal>
        <FeatureRows />
      </Section>
    </>
  );
}
