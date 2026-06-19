import Link from "next/link";

// ── Eyebrow ──────────────────────────────────────────────
export function Eyebrow({ children, className = "" }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

// ── Button ───────────────────────────────────────────────
const buttonStyles = {
  primary: "bg-brand text-brand-fg hover:brightness-105 shadow-card-1",
  secondary: "bg-paper text-ink border border-rule hover:bg-paper-3",
  ghost: "text-ink hover:bg-paper-3",
};

// Paletas do botão glass — gradiente diagonal + glow + anel de luz.
const glassPalettes = {
  brand: {
    gradient: "linear-gradient(135deg, #2541C7 0%, #2952E3 50%, #5B86F5 100%)",
    glow: "rgba(30,64,175,0.42)",
    ring: "rgba(191,219,254,0.30)",
  },
  ok: {
    gradient: "linear-gradient(135deg, #0E9F6E 0%, #16B981 50%, #34D399 100%)",
    glow: "rgba(14,159,110,0.40)",
    ring: "rgba(187,247,221,0.30)",
  },
  amber: {
    gradient: "linear-gradient(135deg, #C2701C 0%, #E89B4C 50%, #F6B45A 100%)",
    glow: "rgba(194,112,28,0.40)",
    ring: "rgba(253,230,190,0.30)",
  },
  ink: {
    gradient: "linear-gradient(135deg, #0A0F1C 0%, #1E2533 50%, #2B3346 100%)",
    glow: "rgba(10,15,28,0.50)",
    ring: "rgba(120,150,255,0.18)",
  },
};

export function Button({
  href,
  variant = "primary",
  color = "brand",
  className = "",
  children,
  ...props
}) {
  if (variant === "glass") {
    const p = glassPalettes[color] || glassPalettes.brand;
    const glassCls = `group relative inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-sm font-medium tracking-tight overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${className}`;
    const style = {
      background: p.gradient,
      boxShadow: `0 18px 35px ${p.glow}, 0 0 0 1px ${p.ring}, inset 0 1px 0 rgba(255,255,255,0.25)`,
      color: "#eef2ff",
    };
    const inner = (
      <>
        {/* light swipe suave, ida e volta */}
        <span
          className="pointer-events-none absolute top-0 left-0 h-full w-2/5"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)", animation: "os-shimmer 3.6s ease-in-out infinite alternate" }}
          aria-hidden
        />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </>
    );
    return href ? (
      <Link href={href} className={glassCls} style={style} {...props}>
        {inner}
      </Link>
    ) : (
      <button className={glassCls} style={style} {...props}>
        {inner}
      </button>
    );
  }

  const cls = `inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-sm font-medium transition-all ${buttonStyles[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

// ── Section ──────────────────────────────────────────────
export function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`px-5 sm:px-8 ${className}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  );
}

// ── Card ─────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-paper border border-rule rounded-lg shadow-card-1 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

// ── Chip ─────────────────────────────────────────────────
export function Chip({ children, tone = "brand" }) {
  const tones = {
    brand: "text-brand bg-brand-tint border-brand-line",
    ok: "text-ok",
    mute: "text-mute bg-chip border-rule",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 mono text-[11px] px-2.5 py-1 rounded-full border ${tones[tone] || tones.brand}`}
    >
      {children}
    </span>
  );
}
