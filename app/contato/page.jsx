import { Section, Eyebrow } from "@/components/ui";
import { Icons } from "@/components/Icons";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contato",
  description:
    "Solicite uma demonstração do OStrack para a sua recuperadora industrial.",
};

const bullets = [
  "Demonstração com o fluxo da sua operação",
  "Sem compromisso e sem cartão de crédito",
  "Resposta em até 1 dia útil",
];

export default function ContatoPage() {
  return (
    <Section className="pt-16 sm:pt-20 pb-20">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
        <div>
          <Eyebrow>Contato</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-ink leading-[1.05]">
            Vamos colocar suas OS no eixo.
          </h1>
          <p className="mt-5 text-lg text-mute leading-relaxed">
            Conte um pouco sobre a sua recuperadora e agendamos uma demonstração
            do OStrack aplicada ao seu fluxo.
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
