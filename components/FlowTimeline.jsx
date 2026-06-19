"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/Icons";
import { STAGES } from "@/components/content";

// Timeline do fluxo interno (operação) com linha que se desenha conforme o scroll.
export function FlowTimeline() {
  const [active, setActive] = useState(-1);
  const itemRefs = useRef([]);

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
        { threshold: 0.5, rootMargin: "0px 0px -20% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const pct = active < 0 ? 0 : ((active + 1) / STAGES.length) * 100;

  return (
    <div className="relative max-w-3xl">
      {/* trilho */}
      <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-rule" aria-hidden />
      {/* linha que se desenha */}
      <div
        className="absolute left-[19px] top-2 w-[2px] bg-brand"
        style={{
          height: `calc(${pct}% - 16px)`,
          transition: "height 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}
        aria-hidden
      />

      <ol className="space-y-0">
        {STAGES.map((s, i) => {
          const Icon = Icons[s.icon];
          const on = i <= active;
          return (
            <li
              key={s.n}
              ref={(el) => (itemRefs.current[i] = el)}
              className="relative pl-14 pb-12 last:pb-0"
              style={{
                opacity: on ? 1 : 0.4,
                transform: on ? "none" : "translateY(14px)",
                transition:
                  "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: on ? "100ms" : "0ms",
              }}
            >
              <span
                className={`absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500 ${
                  on
                    ? "bg-brand text-brand-fg border-brand"
                    : "bg-paper text-faint border-rule"
                }`}
                style={on ? { animation: "os-pulse 2.4s ease-out 1" } : undefined}
              >
                <Icon width={20} height={20} />
              </span>
              <div className="flex items-baseline gap-3">
                <span className="mono text-sm text-faint">{s.n}</span>
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
                  {s.title}
                </h2>
              </div>
              <p className="mt-3 text-mute leading-relaxed">{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
