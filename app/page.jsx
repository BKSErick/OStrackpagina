import { Section, Button, Eyebrow, Card, Chip } from "@/components/ui";
import { Icons } from "@/components/Icons";
import { STAGES, FEATURES } from "@/components/content";
import { HeroDashboard } from "@/components/HeroDashboard";
import { Reveal } from "@/components/Reveal";
import { ClientTimeline } from "@/components/ClientTimeline";
import { CTASection } from "@/components/CTASection";
import { ProblemHub } from "@/components/ProblemHub";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <Section className="pt-16 sm:pt-24 pb-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <Chip>
                <span className="text-brand">●</span> Para recuperadoras industriais
              </Chip>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-[-0.03em] leading-[1.05] text-ink">
                A peça não espera o torno.{" "}
                <span className="text-brand">Espera a cotação ser aprovada.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-mute leading-relaxed max-w-xl">
                Pare de travar suas bancadas de trabalho por causa de e-mails de
                orçamento esquecidos na caixa de entrada do seu cliente. O OStrack
                centraliza laudos, fotos de peritagem e aprovações rápidas em um só lugar.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/contato" variant="glass" color="brand">
                  Destravar Minha Oficina <Icons.arrowRight />
                </Button>
                <Button href="/como-funciona" variant="secondary">
                  Ver como funciona
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-8 flex items-center gap-2 text-sm text-faint">
                <Icons.clock width={16} height={16} />
                Reduza o lead time administrativo e libere espaço no pátio.
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <HeroDashboard />
          </Reveal>
        </div>
      </Section>

      {/* ── Problema ───────────────────────────────────── */}
      <Section className="py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <ProblemHub />
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>O problema</Eyebrow>
            <p className="mt-4 text-2xl sm:text-3xl font-medium tracking-[-0.02em] leading-snug text-ink">
              Seu pátio está lotado de equipamentos abertos que você não pode mexer.{" "}
              <span className="text-brand">
                A equipe técnica fica ociosa e o cliente liga cobrando um prazo que ele mesmo travou ao deixar o orçamento pendente.
              </span>
            </p>
            <p className="mt-5 text-mute leading-relaxed">
              Com o OStrack, a peritagem e a aprovação de orçamentos passam a fluir no
              mesmo ambiente digital, eliminando o tempo morto e permitindo que as OS
              entrem em execução imediatamente.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── Fluxo / 6 etapas ───────────────────────────── */}
      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>O fluxo</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Seis etapas. Uma fila que anda.
          </h2>
          <p className="mt-4 text-mute text-lg">
            Toda OS percorre o mesmo caminho rastreável. Você sempre sabe onde
            cada serviço está — e por que parou.
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

      {/* ── Timeline na visão do cliente ───────────────── */}
      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>Na visão do seu cliente</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            O que ele vê, sem precisar te ligar.
          </h2>
          <p className="mt-4 text-mute text-lg">
            Acompanhe uma OS do recebimento à entrega pelos olhos de quem mandou
            o equipamento. Cada etapa, uma notificação. Nenhuma ligação cobrando
            status.
          </p>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          <ClientTimeline />
        </div>
      </Section>

      {/* ── Recursos ───────────────────────────────────── */}
      <Section className="py-16">
        <Reveal className="max-w-2xl">
          <Eyebrow>Recursos</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
            Cada recurso existe pra tirar uma OS do limbo.
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

      {/* ── CTA final ──────────────────────────────────── */}
      <Section className="py-16">
        <Reveal>
          <CTASection
            layout="split"
            imageSide="left"
            imagePosition="22% center"
            title={"Pare de medir\nquantas OS\nvocê abre."}
            subtitle={"Comece a medir quantas você entrega.\nVeja o OStrack rodando com o fluxo\nda sua recuperadora"}
            bgImage="/cta-home.png"
          />
        </Reveal>
      </Section>
    </>
  );
}
