"use client";

import { useEffect, useRef, useState } from "react";

const sections = ["Fotos de entrada", "Tabela dimensional", "Diagnóstico técnico", "Qualidade e teste", "Conclusão e entrega"];

function Scene({ kind, title, poster, children, hero = false, onStep }) {
  const root = useRef(null);
  const frame = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { rootMargin: "200px" });
    if (root.current) observer.observe(root.current);
    const receive = (event) => {
      if (event.origin === location.origin && event.source === frame.current?.contentWindow && event.data?.[kind] === "ready") setReady(true);
      if (event.origin === location.origin && event.source === frame.current?.contentWindow && Number.isInteger(event.data?.databookStepChanged)) onStep?.(event.data.databookStepChanged);
    };
    window.addEventListener("message", receive);
    return () => { observer.disconnect(); window.removeEventListener("message", receive); };
  }, [kind, onStep]);
  return <div ref={root} className="relative w-full overflow-hidden bg-[#11131d]">
    <div className={hero ? "relative h-[310px] w-full sm:h-[420px] lg:h-[min(58vh,560px)]" : "relative h-[300px] w-full sm:h-[440px] lg:h-[min(55vh,520px)]"}>
      <img src={poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain" />
      {visible && <iframe ref={frame} src={`/cenas/${kind}.html${kind === "jobshop" ? "?notour" : ""}`} title={title} className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} />}
    </div>
    {children?.({ frame, ready })}
  </div>;
}

export function OficinaInterativa() {
  return <Scene hero kind="jobshop" title="Oficina interativa: explore as etapas da ordem de serviço" poster="/cenas/oficina.webp" />;
}

export function DatabookInterativo() {
  const [step, setStep] = useState(0);
  return <Scene kind="databook" onStep={setStep} title="Montagem interativa do databook" poster="/cenas/databook.webp">
    {({ frame, ready }) => {
      const go = (value) => { setStep(value); frame.current?.contentWindow?.postMessage({ databookStep: value }, location.origin); };
      return <div className="relative z-10 bg-[#111725] px-5 pb-6 pt-4 text-white sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-300" aria-live="polite">{step === 0 ? "Selecione uma etapa para montar o databook." : step <= 5 ? `${step} de 5 · ${sections[step - 1]}` : "Databook pronto para a entrega."}</p><span className="text-xs text-slate-400">Demonstração interativa</span></div>
        <div className="mt-4 flex flex-wrap gap-2">{sections.map((name, i) => <button key={name} type="button" disabled={!ready || i + 1 > step + 1} onClick={() => go(i + 1)} aria-pressed={step === i + 1} className="rounded-full border border-white/20 px-3 py-2 text-xs font-medium transition hover:border-blue-300 disabled:opacity-40 aria-pressed:bg-blue-600">{i + 1}. {name}</button>)}</div>
        <div className="mt-4 flex gap-3"><button type="button" disabled={!ready || step === 0} onClick={() => go(step - 1)} className="rounded-full border border-white/25 px-4 py-2 text-sm disabled:opacity-40">Voltar</button><button type="button" disabled={!ready} onClick={() => go(step === 6 ? 0 : step + 1)} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-40">{step === 0 ? "Começar" : step < 5 ? "Próxima etapa" : step === 5 ? "Enviar para entrega" : "Recomeçar"}</button></div>
      </div>;
    }}
  </Scene>;
}
