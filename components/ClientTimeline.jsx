"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/Icons";
import { CLIENT_TIMELINE } from "@/components/content";

export function ClientTimeline() {
  const [active, setActive] = useState(-1);
  const itemRefs = useRef([]);
  const lineRef = useRef(null);
  const [lineH, setLineH] = useState(0);

  useEffect(() => {
    const observers = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive((cur) => Math.max(cur, i));
            io.unobserve(entry.target);
          }
        },
        { threshold: 0.55, rootMargin: "0px 0px -20% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // A linha progride conforme os steps são ativados.
  useEffect(() => {
    const total = CLIENT_TIMELINE.length;
    const pct = active < 0 ? 0 : ((active + 1) / total) * 100;
    setLineH(pct);
  }, [active]);

  return (
    <div className="relative">
      {/* trilho da linha */}
      <div
        className="absolute left-[27px] sm:left-[31px] top-2 bottom-2 w-[2px] bg-rule"
        aria-hidden
      />
      {/* linha que se preenche (progresso animado) */}
      <div
        ref={lineRef}
        className="absolute left-[27px] sm:left-[31px] top-2 w-[2px] bg-brand origin-top"
        style={{
          height: `calc(${lineH}% - 16px)`,
          transition: "height 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}
        aria-hidden
      />

      <ol className="space-y-7">
        {CLIENT_TIMELINE.map((step, i) => {
          const Icon = Icons[step.icon];
          const on = i <= active;
          return (
            <li
              key={step.n}
              ref={(el) => (itemRefs.current[i] = el)}
              className="relative pl-16 sm:pl-20"
              style={{
                opacity: on ? 1 : 0.35,
                transform: on ? "none" : "translateY(14px)",
                transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: on ? "120ms" : "0ms",
              }}
            >
              {/* nó */}
              <span
                className={`absolute left-0 top-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border transition-all duration-500 ${
                  on
                    ? "bg-brand text-brand-fg border-brand"
                    : "bg-paper text-faint border-rule"
                }`}
                style={on ? { animation: "os-pulse 2.4s ease-out 1" } : undefined}
              >
                <Icon width={24} height={24} />
              </span>

              <div className="bg-paper border border-rule rounded-lg shadow-card-1 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow">{step.when}</span>
                  <span className="mono text-[11px] text-brand bg-brand-tint border border-brand-line rounded-full px-2.5 py-0.5">
                    {step.tag}
                  </span>
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-mute leading-relaxed">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
