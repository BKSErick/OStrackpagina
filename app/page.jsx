import { Section, Button, Eyebrow, Card, Chip } from "@/components/ui";
import { Icons } from "@/components/Icons";
import { STAGES, FEATURES } from "@/components/content";
import { HeroDashboard } from "@/components/HeroDashboard";
import { Reveal } from "@/components/Reveal";
import { ClientTimeline } from "@/components/ClientTimeline";
import { CTASection } from "@/components/CTASection";
import { ProblemHub } from "@/components/ProblemHub";

const beforeAfter = [
  {
    before: "OS parada em planilha, WhatsApp e memória da equipe.",
    after: "Uma fila única com etapa, responsável, tempo parado e próxima ação.",
  },
  {
    before: "Cliente recebe preço, horas e detalhe interno antes da conversa certa.",
    after: "Cliente aprova o escopo técnico; custo, horas e margem ficam internos.",
  },
  {
    before: "Databook e relatório técnico montados depois, com retrabalho.",
    after: "Evidências, medições, testes e histórico já nascem dentro da OS.",
  },
];

const proofPoints = [
  "Pipeline real de recuperação: entrada, peritagem, diagnóstico, orçamento, aprovação, compras, execução, montagem, qualidade e entrega.",
  "Rastreabilidade por transição de etapa, a mesma base usada para medir lead time operacional.",
  "Escopo técnico para o cliente sem vazamento de preço, horas, desconto ou nota interna.",
  "Base preparada para documentos industriais: fotos, medições, checklist de qualidade, relatório técnico e databook.",
];

const fitItems = [
  {
    title: "Serve para",
    items: [
      "Recuperadoras, usinagens e oficinas industriais que atendem cliente grande.",
      "Operações que ainda dependem de Excel, WhatsApp, e-mail e papel para tocar OS.",
      "Empresas que precisam provar rastreabilidade, escopo aprovado e qualidade na entrega.",
    ],
  },
  {
    title: "Não é para",
    items: [
      "Quem quer apenas um formulário genérico de ordem de serviço.",
      "Oficinas sem volume, sem cliente exigente e sem dor com prazo ou documento.",
      "Empresas procurando substituir ERP fiscal, financeiro ou estoque completo.",
    ],
  },
];

const implementation = [
  "Mapeamos seu fluxo atual e nomeamos onde a OS costuma travar.",
  "Configuramos etapas, equipe, clientes, equipamentos e modelo documental.",
  "Rodamos a primeira OS assistida até aprovação, qualidade e entrega.",
];

function BulletList({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-mute leading-relaxed">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
            <Icons.check width={13} height={13} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <Chip>
                <span className="text-brand">●</span> Pipeline de recuperação industrial
              </Chip>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-[-0.03em] leading-[1.05] text-ink">
                Sua OS não trava na máquina.{" "}
                <span className="text-brand">Trava antes da aprovação e do databook.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-mute leading-relaxed max-w-xl">
                O OStrack organiza o fluxo da recuperadora do recebimento à entrega:
                peritagem, escopo técnico, aprovação do cliente, compras, execução,
                qualidade e documento final no mesmo rastro operacional.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/contato" variant="glass" color="brand">
                  Ver o OStrack na minha OS <Icons.arrowRight />
                </Button>
                <Button href="/diagnostico" variant="secondary">
                  Diagnosticar meu gargalo
                </Button>
              </div>
            </Reveal>

          </div>

          <Reveal delay={200}>
            <HeroDashboard />
          </Reveal>
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <ProblemHub />
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>O problema real</Eyebrow>
            <p className="mt-4 text-2xl sm:text-3xl font-medium tracking-[-0.02em] leading-snug text-ink">
              A peça fica aberta no pátio, o cliente cobra prazo, a equipe cobra
              decisão e ninguém sabe exatamente{" "}
              <span className="text-brand">quem está segurando a próxima etapa.</span>
            </p>
            <p className="mt-5 text-mute leading-relaxed">
              O concorrente do OStrack não é outro software. É a mistura de
              planilha, WhatsApp, e-mail e papel que deixa a OS viva no discurso,
              mas invisível na operação.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>Antes e depois</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            OStrack transforma caos operacional em rastro de entrega.
          </h2>
        </Reveal>
        <div className="mt-12 grid lg:grid-cols-3 gap-4">
          {beforeAfter.map((item, i) => (
            <Reveal key={item.before} delay={i * 80}>
              <Card className="h-full">
                <div className="eyebrow text-faint">Antes</div>
                <p className="mt-3 text-sm text-mute leading-relaxed">{item.before}</p>
                <div className="my-5 h-px bg-rule" />
                <div className="eyebrow text-brand">Com OStrack</div>
                <p className="mt-3 text-base font-medium text-ink leading-relaxed">{item.after}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>O mecanismo</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Seis etapas no site. Dez etapas no chão de fábrica quando precisa.
          </h2>
          <p className="mt-4 text-mute text-lg">
            O fluxo comercial fica simples para entender, mas a operação guarda o
            detalhe que uma recuperadora industrial precisa para entregar com controle.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAGES.map((s, i) => {
            const Icon = Icons[s.icon];
            return (
              <Reveal key={s.n} delay={i * 70}>
                <Card className="relative h-full hover:shadow-card-2 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-brand-tint text-brand">
                      <Icon />
                    </span>
                    <span className="mono text-faint text-sm">{s.n}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-mute leading-relaxed">{s.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <Reveal>
            <Eyebrow>Prova operacional</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
              Não é um Kanban bonito em cima de um processo quebrado.
            </h2>
            <p className="mt-4 text-mute text-lg leading-relaxed">
              O produto foi pensado para o que a recuperadora precisa provar:
              etapa, responsável, evidência, aprovação, qualidade e histórico.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Card>
              <BulletList items={proofPoints} />
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>Na visão do seu cliente</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Ele aprova o escopo técnico. Sua margem continua interna.
          </h2>
          <p className="mt-4 text-mute text-lg">
            O cliente acompanha status, vê evidências e decide o escopo sem
            receber preço unitário, horas, desconto ou anotação interna.
          </p>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          <ClientTimeline />
        </div>
      </Section>

      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>Recursos</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Cada recurso existe para tirar uma OS do limbo.
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = Icons[f.icon];
            return (
              <Reveal key={f.title} delay={i * 70}>
                <div className="p-6 rounded-lg border border-transparent hover:border-rule hover:bg-paper transition-all duration-300">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-paper border border-rule text-brand shadow-card-1">
                    <Icon />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm text-mute leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-8">
          <Button href="/recursos" variant="secondary">
            Ver todos os recursos <Icons.arrowRight />
          </Button>
        </Reveal>
      </Section>

      <Section className="py-16">
        <div className="grid lg:grid-cols-2 gap-4">
          {fitItems.map((group, i) => (
            <Reveal key={group.title} delay={i * 100}>
              <Card className="h-full">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">{group.title}</h2>
                <BulletList items={group.items} />
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-start">
          <Reveal>
            <Eyebrow>Implementação</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
              A demo já começa pelo gargalo da sua recuperadora.
            </h2>
            <p className="mt-4 text-mute text-lg leading-relaxed">
              Sem apresentação genérica. A conversa parte da fila real: onde a
              OS para, quem aprova, qual documento o cliente exige e qual etapa
              precisa virar dado.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Card>
              <ol className="space-y-4">
                {implementation.map((item, i) => (
                  <li key={item} className="flex gap-4">
                    <span className="mono inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand text-brand-fg text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1 text-sm text-mute leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/contato" variant="glass" color="brand">
                  Solicitar demo <Icons.arrowRight />
                </Button>
                <Button href="/diagnostico" variant="secondary">
                  Fazer diagnostico
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section className="py-16">
        <Reveal>
          <CTASection
            layout="split"
            imageSide="left"
            imagePosition="22% center"
            title={"Pare de medir\nquantas OS\nvocê abre."}
            subtitle={"Comece a controlar quais OS chegam na entrega, com escopo aprovado, rastro técnico e base documental pronta para o cliente industrial."}
            ctaLabel="Ver minha OS no OStrack"
            bgImage="/cta-home.png"
          />
        </Reveal>
      </Section>
    </>
  );
}
