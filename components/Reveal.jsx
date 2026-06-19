"use client";

import { useEffect, useRef, useState } from "react";

// Revela com fade + slide + leve scale ao ENTRAR e recolhe ao SAIR da viewport.
// Movimento suave (easeOutExpo-ish). `delay` em ms escalona itens.
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function Reveal({
  children,
  delay = 0,
  y = 12,
  once = false,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.unobserve(entry.target);
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px) scale(0.985)`,
        transition: `opacity 0.75s ${EASE}, transform 0.75s ${EASE}`,
        transitionDelay: `${shown ? delay : 0}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
