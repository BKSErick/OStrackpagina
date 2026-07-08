import { Section, Eyebrow } from "@/components/ui";
import { Icons } from "@/components/Icons";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Demo e diagnóstico",
  description:
    "Solicite uma demonstração do OStrack aplicada ao fluxo real da sua recuperadora industrial.",
};

const bullets = [
  "Demo com uma OS parecida com a sua operação",
  "Diagnóstico do gargalo: aprovação, compras, execução, qualidade ou databook",
  "Próxima ação clara: piloto, implementação ou ajuste de processo",
];

export default function ContatoPage() {
  return (
    <Section className="pt-16 sm:pt-20 pb-20">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
        <div>
          <Eyebrow>Demo consultiva</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-ink leading-[1.05]">
            Vamos encontrar onde sua OS está perdendo tempo.
          </h1>
          <p className="mt-5 text-lg text-mute leading-relaxed">
            Conte como sua recuperadora controla OS hoje. A demonstração parte do
            seu gargalo real, não de uma apresentação genérica de software.
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-ink-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-tint text-brand">
                  <Icons.check width={15} height={15} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
