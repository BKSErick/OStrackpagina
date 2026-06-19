import { Button } from "@/components/ui";
import { Icons } from "@/components/Icons";

// Renderiza texto preservando quebras de linha (\n → <br/>).
function withBreaks(text) {
  return String(text)
    .split("\n")
    .map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
}

// CTA com FOTO de fundo. A imagem já traz o espaço para o conteúdo, então
// NÃO há card de vidro nem overlay — só um bloco de texto + botão sobre a foto.
//   halign: "left" | "center" | "right"  → ancora o bloco na foto
//   valign: "top" | "center" | "bottom"
//   light:  texto escuro (para fotos claras)
export function CTASection({
  title,
  subtitle,
  bgImage,
  ctaLabel = "Solicitar demo",
  ctaHref = "/contato",
  halign = "center",
  valign = "center",
  light = false,
  layout = "overlay", // "overlay" (texto sobre a foto) | "split" (foto num box + texto ao lado)
  imageSide = "left", // no split: "left" | "right"
  imagePosition = "center center", // enquadramento da foto (background-position)
}) {
  // ── Modo SPLIT: foto num box de um lado, texto formatado do outro ──
  if (layout === "split") {
    const img = (
      <div className="relative rounded-2xl overflow-hidden border border-rule shadow-card-2 h-64 sm:h-80 lg:h-[460px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: imagePosition,
          }}
          aria-hidden
        />
      </div>
    );
    const text = (
      <div className={imageSide === "left" ? "lg:pl-4" : "lg:pr-4"}>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-ink">
          {withBreaks(title)}
        </h2>
        {subtitle && (
          <p className="mt-5 text-lg text-mute leading-relaxed">{withBreaks(subtitle)}</p>
        )}
        <div className="mt-8">
          <Button href={ctaHref} variant="glass" color="brand">
            {ctaLabel} <Icons.arrowRight />
          </Button>
        </div>
      </div>
    );
    return (
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        {imageSide === "left" ? (
          <>
            {img}
            {text}
          </>
        ) : (
          <>
            {text}
            {img}
          </>
        )}
      </div>
    );
  }

  const vAlign =
    valign === "top" ? "justify-start" : valign === "bottom" ? "justify-end" : "justify-center";
  const rowJustify =
    halign === "left" ? "justify-start" : halign === "right" ? "justify-end" : "justify-center";
  const textAlign = halign === "center" ? "text-center" : "text-left";

  const textColor = light ? "text-ink" : "text-white";
  const subColor = light ? "text-ink-2/80" : "text-white/80";
  const shadow = light ? "none" : "0 1px 14px rgba(0,0,0,0.35)";

  return (
    <div className="relative overflow-hidden rounded-2xl min-h-[420px] sm:min-h-[480px] flex">
      {/* foto de fundo */}
      <div
        className="absolute inset-0 bg-ink"
        style={
          bgImage
            ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {
                backgroundImage:
                  "radial-gradient(120% 120% at 0% 0%, #1E2533 0%, #0A0F1C 55%, #060912 100%)",
              }
        }
        aria-hidden
      />

      {/* conteúdo ancorado no espaço da foto */}
      <div className={`relative z-10 w-full flex flex-col ${vAlign} px-8 sm:px-14 py-10`}>
        <div className={`w-full flex ${rowJustify}`}>
          <div className={`max-w-md ${textAlign}`}>
            <h2
              className={`text-3xl sm:text-4xl font-semibold tracking-[-0.025em] leading-[1.1] ${textColor}`}
              style={{ textShadow: shadow }}
            >
              {withBreaks(title)}
            </h2>
            {subtitle && (
              <p className={`mt-4 text-lg ${subColor} leading-relaxed`} style={{ textShadow: shadow }}>
                {withBreaks(subtitle)}
              </p>
            )}
            <div className={`mt-8 flex ${halign === "center" ? "justify-center" : "justify-start"}`}>
              <Button href={ctaHref} variant="glass" color="brand">
                {ctaLabel} <Icons.arrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
