"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronLeft, FileText, MessageCircle, QrCode, Search } from "@/components/OsDemoIcons";
import { IDLE_LIMIT_DAYS, OS_CHECKLIST, OS_HISTORY, OS_MONEY, OS_NEXT_ACTION, OS_PARTS, OS_PLANNED_HOURS, OS_SENT_QUOTE, OS_START_STAGE, OSTRACK_ROUTE } from "@/components/os-demo-data";
const Balloon = () => null;
const LAST = OSTRACK_ROUTE.length - 1;
const START_DAYS = OS_HISTORY[OS_HISTORY.length - 1].days;
const OPEN_DAYS = OS_HISTORY.reduce((sum, entry) => sum + entry.days, 0);
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimal = (value) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const TABS = [
    { id: "geral", label: "Visão geral" },
    {
        id: "diagnostico",
        label: "Diagnóstico técnico",
        badge: `${OS_CHECKLIST.filter((item) => item.status === "ok").length}/${OS_CHECKLIST.length}`
    },
    { id: "componentes", label: "Componentes", badge: String(OS_PARTS.length) },
    { id: "historico", label: "Histórico" }
];
const TOASTS = {
    qr: "No OStrack, este botão gera a etiqueta QR que acompanha a peça no chão de fábrica.",
    whatsapp: "No OStrack, abre a conversa com o cliente já com o número e o equipamento da O.S.",
    databook: "No OStrack, monta o databook da O.S. com diagnóstico, fotos e relatório.",
    approval: "No OStrack, manda o link de aprovação do orçamento para o cliente pelo WhatsApp.",
    link: "No OStrack, copia o link do portal onde o cliente aprova o orçamento."
};
const firstHistory = () => OS_HISTORY.map((entry, index) => ({ ...entry, days: index === OS_HISTORY.length - 1 ? null : entry.days }));
const plural = (days) => `${days} ${days === 1 ? "dia" : "dias"}`;
/* Número que corre até o valor novo quando a etapa muda. */
function useCountUp(target, duration = 750) {
    const [value, setValue] = useState(target);
    const fromRef = useRef(target);
    useEffect(() => {
        const from = fromRef.current;
        fromRef.current = target;
        if (from === target)
            return;
        const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const length = still ? 0 : duration;
        const tick = typeof window.requestAnimationFrame === "function"
            ? (callback) => window.requestAnimationFrame(callback)
            : (callback) => window.setTimeout(() => callback(performance.now()), 16);
        const cancel = typeof window.cancelAnimationFrame === "function"
            ? (id) => window.cancelAnimationFrame(id)
            : (id) => window.clearTimeout(id);
        let frame = 0;
        const started = performance.now();
        const step = (now) => {
            const t = length === 0 ? 1 : Math.min(1, (now - started) / length);
            setValue(t === 1 ? target : from + (target - from) * (1 - Math.pow(2, -10 * t)));
            if (t < 1)
                frame = tick(step);
        };
        frame = tick(step);
        return () => cancel(frame);
    }, [target, duration]);
    return value;
}
function Money({ value }) {
    const shown = useCountUp(value);
    return <>{brl.format(Math.round(shown))}</>;
}
function partStatus(kind, stage) {
    if (stage < 5)
        return { label: "Aguardando orçamento", tone: "neutral" };
    if (stage >= 7)
        return { label: kind === "buy" ? "Recebido" : "Pronta", tone: "ok" };
    if (kind === "make")
        return { label: "Em fabricação", tone: "info" };
    return stage === 5 ? { label: "Requisitado", tone: "info" } : { label: "Em trânsito", tone: "warn" };
}
function MarginCard({ stage }) {
    const money = OS_MONEY[stage];
    const cost = money.purchases + money.labor;
    const noQuote = money.quote === 0;
    const margin = noQuote ? 0 : money.quote - cost;
    const marginPct = noQuote ? null : (margin / money.quote) * 100;
    const tone = noQuote ? "neutral" : margin < 0 ? "bad" : (marginPct ?? 0) < 15 ? "warn" : "ok";
    const base = noQuote ? OS_SENT_QUOTE : money.quote;
    const width = (value) => `${Math.max(0, Math.min(100, (value / base) * 100))}%`;
    return (<section className="ost-card" aria-labelledby="ost-margem">
      <header className="ost-card__head">
        <h4 id="ost-margem">
          <Balloon className="ost-ann">4</Balloon>
          Custo &amp; margem
        </h4>
        <span className="ost-ghost" aria-hidden="true">Ver apontamentos</span>
      </header>
      <div className="ost-card__body">
        <div className="ost-margin">
          <div>
            <p className="ost-eyebrow">Margem atual</p>
            <p className="ost-margin__value" data-tone={tone}>
              <Money value={margin}/>
              {marginPct !== null ? <span className="ost-mono">{decimal(marginPct)}%</span> : null}
            </p>
          </div>
          <span className="ost-tag" data-tone={tone}>
            {noQuote ? "Sem orçamento aprovado" : tone === "ok" ? "Saudável" : tone === "warn" ? "Margem apertada" : "No prejuízo"}
          </span>
        </div>
        <div className="ost-bar" aria-hidden="true">
          <span data-part="material" style={{ width: width(money.purchases) }}/>
          <span data-part="labor" style={{ width: width(money.labor) }}/>
          <span data-part="margin" style={{ width: noQuote ? "0%" : width(margin) }}/>
        </div>
        <p className="ost-legend-row" aria-hidden="true">
          <span data-part="material">Material</span>
          <span data-part="labor">Mão de obra</span>
          <span data-part="margin">Margem</span>
        </p>
        <dl className="ost-lines">
          <div>
            <dt>
              Orçamento aprovado
              {noQuote ? <small>{brl.format(OS_SENT_QUOTE)} enviado, aguardando o cliente</small> : null}
            </dt>
            <dd className="ost-mono">
              <Money value={money.quote}/>
            </dd>
          </div>
          <div>
            <dt>
              <i data-part="material"/>
              Compras
            </dt>
            <dd className="ost-mono">
              <Money value={money.purchases}/>
            </dd>
          </div>
          <div>
            <dt>
              <i data-part="labor"/>
              Mão de obra
              <small>
                {decimal(money.hours)}h de {OS_PLANNED_HOURS}h previstas
              </small>
            </dt>
            <dd className="ost-mono">
              <Money value={money.labor}/>
            </dd>
          </div>
          <div>
            <dt>Custo total</dt>
            <dd className="ost-mono">
              <Money value={cost}/>
            </dd>
          </div>
        </dl>
      </div>
    </section>);
}
export function Operacao() {
    const [stage, setStage] = useState(OS_START_STAGE);
    const trackRef = useRef(null);
    useEffect(() => {
        const track = trackRef.current;
        const active = track?.querySelector('[data-state="active"]');
        if (track && active && track.scrollWidth > track.clientWidth) {
            track.scrollLeft += active.getBoundingClientRect().left - track.getBoundingClientRect().left - (track.clientWidth - active.clientWidth) / 2;
        }
    }, [stage]);
    const [idleDays, setIdleDays] = useState(START_DAYS);
    const [history, setHistory] = useState(firstHistory);
    const [tab, setTab] = useState("geral");
    const [stamped, setStamped] = useState(0);
    const [toast, setToast] = useState(null);
    const stampTimer = useRef(null);
    const toastTimer = useRef(null);
    useEffect(() => () => {
        if (stampTimer.current)
            window.clearTimeout(stampTimer.current);
        if (toastTimer.current)
            window.clearTimeout(toastTimer.current);
    }, []);
    const next = stage < LAST ? OSTRACK_ROUTE[stage + 1] : null;
    const idle = stage < LAST && idleDays >= IDLE_LIMIT_DAYS;
    const awaitingApproval = stage === OS_START_STAGE;
    function say(text) {
        setToast(text);
        if (toastTimer.current)
            window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 3600);
    }
    function advance() {
        if (!next)
            return;
        setHistory((current) => [
            ...current.map((entry) => (entry.days === null ? { ...entry, days: idleDays } : entry)),
            { stage: stage + 1, date: "Hoje", days: null }
        ]);
        setStage(stage + 1);
        setIdleDays(0);
        setStamped((value) => value + 1);
        if (stampTimer.current)
            window.clearTimeout(stampTimer.current);
        stampTimer.current = window.setTimeout(() => setStamped(0), 1700);
    }
    function reset() {
        setStage(OS_START_STAGE);
        setIdleDays(START_DAYS);
        setHistory(firstHistory());
        setTab("geral");
        setStamped(0);
    }
    const okCount = OS_CHECKLIST.filter((item) => item.status === "ok").length;
    const warnCount = OS_CHECKLIST.length - okCount;
    return (<section id="demonstracao" className="os-demo-section" aria-labelledby="os-demo-title">
      <div className="os-demo-wrap">
        <h2 id="os-demo-title">Acompanhe o caminho completo da sua OS.</h2>
        <p>Explore a ficha de exemplo: avance as etapas e veja o que muda em cada fase.</p>
        <div className="ost" role="region" aria-label="Ficha de O.S. do OStrack, recriação interativa">
          <div className="ost-topbar" aria-hidden="true">
            <span className="ost-brand">
              <span className="ost-brand__dot"/>
              OStrack
            </span>
            <span className="ost-search">
              <Search size={14} strokeWidth={2}/>
              Buscar O.S., cliente, equipamento ou peça…
            </span>
            <span className="ost-topbar__right">
              <QrCode size={15} strokeWidth={2}/>
              <MessageCircle size={15} strokeWidth={2}/>
              <Bell size={15} strokeWidth={2}/>
            </span>
          </div>

          <div className="ost-page">
            <p className="ost-crumb">
              <ChevronLeft aria-hidden="true" size={13} strokeWidth={2}/>
              <span>Kanban</span>
              <span aria-hidden="true">/</span>
              <span>Siderúrgica</span>
              <span aria-hidden="true">/</span>
              <span className="ost-mono ost-crumb__id">DEMO-014</span>
            </p>

            <div className="ost-header">
              <div className="ost-header__main">
                <p className="ost-header__tags">
                  <span className="ost-mono ost-header__id">DEMO-014</span>
                  <span className="ost-tag" data-tone="info">
                    <i className="ost-dot" aria-hidden="true"/>
                    {OSTRACK_ROUTE[stage]}
                  </span>
                  <span className="ost-tag" data-tone="bad">
                    Urgente
                  </span>
                  <span className="ost-tag ost-tag--idle" data-tone={idle ? "bad" : "neutral"}>
                    <Balloon className="ost-ann">2</Balloon>
                    Parada há {plural(idleDays)}
                  </span>
                  <span className="ost-tag" data-tone="neutral">
                    Aberta há {OPEN_DAYS} dias
                  </span>
                </p>
                <h3 className="ost-title">Eixo de transmissão Ø80</h3>
                <p className="ost-client">
                  <span className="ost-avatar" aria-hidden="true">
                    SE
                  </span>
                  <span>Siderúrgica, cliente de exemplo</span>
                  <span className="ost-faint" aria-hidden="true">
                    -
                  </span>
                  <span className="ost-mono ost-mute">CNPJ fictício</span>
                </p>
              </div>
              <div className="ost-actions">
                <button type="button" className="ost-btn" onClick={() => say(TOASTS.qr)}>
                  <QrCode aria-hidden="true" size={15} strokeWidth={2}/>
                  Etiqueta QR
                </button>
                <button type="button" className="ost-btn" onClick={() => say(TOASTS.whatsapp)}>
                  <MessageCircle aria-hidden="true" size={15} strokeWidth={2}/>
                  WhatsApp
                </button>
                <button type="button" className="ost-btn ost-btn--primary" onClick={() => say(TOASTS.databook)}>
                  <FileText aria-hidden="true" size={15} strokeWidth={2}/>
                  Gerar Databook
                </button>
              </div>
            </div>

            <div className="ost-track-card">
              <Balloon className="ost-ann ost-ann--corner">1</Balloon>
              <ol ref={trackRef} className="ost-track" aria-label={`Roteiro da O.S.: etapa ${stage + 1} de ${OSTRACK_ROUTE.length}, ${OSTRACK_ROUTE[stage]}`} tabIndex={0}>
                {OSTRACK_ROUTE.map((label, index) => {
            const state = index < stage ? "done" : index === stage ? "active" : "todo";
            return (<Fragment key={label}>
                      <li className="ost-step" data-state={state} style={{ ["--i"]: index }}>
                        <span className="ost-step__dot" aria-hidden="true">
                          {state === "done" ? (<Check size={13} strokeWidth={3}/>) : (<span className="ost-mono">{index + 1}</span>)}
                        </span>
                        <span className="ost-step__label">{label}</span>
                        <span className="ost-step__hint">
                          {state === "done" ? "concluído" : state === "active" ? "em andamento" : "-"}
                        </span>
                      </li>
                      {index < LAST ? (<li className="ost-step__link" data-state={index < stage ? "done" : "todo"} aria-hidden="true" style={{ ["--i"]: index }}/>) : null}
                    </Fragment>);
        })}
              </ol>
              <p className="ost-track-hint">Deslize para acompanhar todas as etapas.</p>
              {stamped ? (<span className="ost-stamp" role="status" key={stamped}>
                  Etapa concluída
                </span>) : null}
            </div>

            <div className="ost-tabs" role="tablist" aria-label="Seções da O.S.">
              {TABS.map((item) => (<button key={item.id} type="button" role="tab" id={`ost-tab-${item.id}`} aria-selected={tab === item.id} aria-controls={`ost-panel-${item.id}`} tabIndex={tab === item.id ? 0 : -1} onClick={() => setTab(item.id)} onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
                    return;
                const position = TABS.findIndex((entry) => entry.id === tab);
                const step = event.key === "ArrowRight" ? 1 : -1;
                const target = TABS[(position + step + TABS.length) % TABS.length];
                setTab(target.id);
                document.getElementById(`ost-tab-${target.id}`)?.focus();
            }}>
                  {item.label}
                  {item.badge ? <span className="ost-mono ost-badge">{item.badge}</span> : null}
                </button>))}
            </div>

            <div className="ost-panel" role="tabpanel" id={`ost-panel-${tab}`} aria-labelledby={`ost-tab-${tab}`}>
              {tab === "geral" ? (<div className="ost-overview">
                  <div className="ost-col">
                    <MarginCard stage={stage}/>
                    <section className="ost-card" aria-labelledby="ost-componentes">
                      <header className="ost-card__head">
                        <h4 id="ost-componentes">Componentes vinculados</h4>
                        <button type="button" className="ost-ghost" onClick={() => setTab("componentes")}>
                          Ver todos ({OS_PARTS.length})
                        </button>
                      </header>
                      <ul className="ost-parts">
                        {OS_PARTS.map((part) => {
                const status = partStatus(part.kind, stage);
                return (<li key={part.item}>
                              <span className="ost-parts__name">{part.item}</span>
                              <span className="ost-tag" data-tone={part.kind === "buy" ? "info" : "neutral"}>
                                {part.kind === "buy" ? "Compra direta" : "Fabricação"}
                              </span>
                              <span className="ost-mono ost-mute">{part.qty} un.</span>
                              <span className="ost-tag ost-tag--status" data-tone={status.tone}>
                                {status.label}
                              </span>
                            </li>);
            })}
                      </ul>
                    </section>
                  </div>

                  <div className="ost-col">
                    <section className="ost-card" aria-labelledby="ost-aprovacao">
                      <header className="ost-card__head">
                        <h4 id="ost-aprovacao">
                          <Balloon className="ost-ann">3</Balloon>
                          Aprovação do cliente
                        </h4>
                      </header>
                      <div className="ost-card__body">
                        <div className="ost-approval" data-tone={awaitingApproval ? (idle ? "bad" : "warn") : "ok"}>
                          <p className="ost-approval__state">
                            <i className="ost-pulse" aria-hidden="true"/>
                            {awaitingApproval
                ? `Aguardando aprovação há ${plural(idleDays)}`
                : stage === LAST
                    ? "Finalizado e entregue"
                    : "Aprovado pelo cliente"}
                          </p>
                          <p className="ost-approval__sub">
                            {awaitingApproval
                ? `Orçamento de ${brl.format(OS_SENT_QUOTE)} enviado em 26/10.`
                : `Orçamento de ${brl.format(OS_SENT_QUOTE)} aprovado pelo link.`}
                          </p>
                        </div>
                        {awaitingApproval ? (<>
                            <button type="button" className="ost-btn ost-btn--primary ost-btn--block" onClick={() => say(TOASTS.approval)}>
                              <MessageCircle aria-hidden="true" size={15} strokeWidth={2}/>
                              Reenviar pelo WhatsApp
                            </button>
                            <button type="button" className="ost-ghost ost-ghost--block" onClick={() => say(TOASTS.link)}>
                              Copiar link de aprovação
                            </button>
                          </>) : null}
                      </div>
                    </section>

                    <section className="ost-card ost-next" aria-labelledby="ost-proxima">
                      <header className="ost-card__head">
                        <h4 id="ost-proxima">Próxima ação</h4>
                      </header>
                      <div className="ost-card__body">
                        <p className="ost-next__text">{OS_NEXT_ACTION[stage]}</p>
                        <button type="button" className="ost-btn ost-btn--primary ost-btn--block" onClick={advance} disabled={!next}>
                          {next ? `Avançar para ${next}` : "O.S. entregue"}
                        </button>
                        <button type="button" className="ost-ghost ost-ghost--block" onClick={reset}>
                          Reiniciar exemplo
                        </button>
                      </div>
                    </section>

                    <section className="ost-card" aria-labelledby="ost-detalhes">
                      <header className="ost-card__head">
                        <h4 id="ost-detalhes">Detalhes</h4>
                      </header>
                      <dl className="ost-details">
                        <div>
                          <dt>Entrada</dt>
                          <dd className="ost-mono">20/10 08:00</dd>
                        </div>
                        <div>
                          <dt>Entrega prevista</dt>
                          <dd className="ost-mono">05/11 17:00</dd>
                        </div>
                        <div>
                          <dt>Técnico responsável</dt>
                          <dd>R.M.</dd>
                        </div>
                        <div>
                          <dt>Prioridade</dt>
                          <dd>
                            <span className="ost-tag" data-tone="bad">
                              Alta
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt>RC/Pedido</dt>
                          <dd className="ost-mono">{stage >= 5 ? "RC-0142" : "-"}</dd>
                        </div>
                        <div>
                          <dt>Valor estimado</dt>
                          <dd className="ost-mono ost-strong">{brl.format(OS_SENT_QUOTE)}</dd>
                        </div>
                      </dl>
                    </section>
                  </div>
                </div>) : null}

              {tab === "diagnostico" ? (<section className="ost-card" aria-label="Diagnóstico técnico">
                  <div className="ost-card__body">
                    <div className="ost-diag">
                      <div>
                        <p className="ost-eyebrow">Concluídos</p>
                        <p data-tone="ok">
                          {okCount}
                          <small>/ {OS_CHECKLIST.length}</small>
                        </p>
                      </div>
                      <div>
                        <p className="ost-eyebrow">Em atenção</p>
                        <p data-tone="warn">
                          {warnCount}
                          <small>/ {OS_CHECKLIST.length}</small>
                        </p>
                      </div>
                      <div>
                        <p className="ost-eyebrow">Pendentes</p>
                        <p>
                          0<small>/ {OS_CHECKLIST.length}</small>
                        </p>
                      </div>
                    </div>
                    <ul className="ost-checklist">
                      {OS_CHECKLIST.map((item, index) => (<li key={item.label} data-tone={item.status}>
                          <span className="ost-check" aria-hidden="true">
                            {item.status === "ok" ? "OK" : "!"}
                          </span>
                          <span className="ost-mono ost-mute">{String(index + 1).padStart(2, "0")}</span>
                          {item.label}
                          <span className="fl-visually-hidden">{item.status === "ok" ? ", concluído" : ", em atenção"}</span>
                        </li>))}
                    </ul>
                  </div>
                </section>) : null}

              {tab === "componentes" ? (<section className="ost-card" aria-label="Componentes">
                  <table className="ost-table">
                    <thead>
                      <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Qtd</th>
                        <th scope="col">Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OS_PARTS.map((part) => {
                const status = partStatus(part.kind, stage);
                return (<tr key={part.item}>
                            <th scope="row">{part.item}</th>
                            <td>{part.kind === "buy" ? "Compra direta" : "Fabricação"}</td>
                            <td className="ost-mono">{part.qty}</td>
                            <td>
                              <span className="ost-tag" data-tone={status.tone}>
                                {status.label}
                              </span>
                            </td>
                          </tr>);
            })}
                    </tbody>
                  </table>
                </section>) : null}

              {tab === "historico" ? (<section className="ost-card" aria-label="Histórico de etapas">
                  <ol className="ost-timeline">
                    {history.map((entry, index) => (<li key={`${entry.stage}-${index}`} data-open={entry.days === null || undefined}>
                        <span className="ost-timeline__dot" aria-hidden="true"/>
                        <span className="ost-timeline__stage">{OSTRACK_ROUTE[entry.stage]}</span>
                        <span className="ost-mono ost-mute">{entry.date}</span>
                        <span className="ost-mono" data-idle={entry.days === null && idle ? "" : undefined}>
                          {entry.days === null ? `há ${plural(idleDays)}` : `${decimal(entry.days)} d`}
                        </span>
                      </li>))}
                  </ol>
                </section>) : null}
            </div>
          </div>

          <p className="ost-toast" role="status" aria-live="polite" data-on={toast ? "" : undefined}>
            {toast ?? ""}
          </p>
        </div>

        <p className="os-demo-disclaimer">Demonstração interativa com cliente, dados e valores fictícios.</p>
      </div>
    </section>);
}
