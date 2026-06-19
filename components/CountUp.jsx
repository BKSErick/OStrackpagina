"use client";

import { useEffect, useRef, useState } from "react";

// Anima a parte numérica de um valor (ex.: "6", "1 clique", "0") de 0 até o alvo
// quando entra na viewport. Mantém qualquer sufixo de texto.
export function CountUp({ value, duration = 1200, className = "" }) {
  const match = String(value).match(/^([\d.,]+)(.*)$/);
  const target = match ? parseFloat(match[1].replace(",", ".")) : 0;
  const decimals = match && match[1].includes(",") ? 1 : 0;
  const suffix = match ? match[2] : "";

  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;

    let raf;
    const animate = (start) => {
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(performance.now());
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
