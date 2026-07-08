"use client";

import { useState, useEffect } from "react";
import { Section, Eyebrow, Button, Card } from "@/components/ui";
import { Icons } from "@/components/Icons";

const WHATSAPP_NUMBER = "5531991072407";

export default function DiagnosticoPage() {
  const [step, setStep] = useState(0); // 0: Intro, 1-4: Perguntas, 5: Captura, 6: Sucesso
  const [answers, setAnswers] = useState({
    volume: "",
    gargalo: "",
    controle: "",
    custo: "",
  });
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  const stepsTotal = 5; // 4 perguntas + 1 captura

  // Opção selecionada em tempo de clique
  function handleSelectOption(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // Pequena animação/atraso antes de ir para o próximo passo para feedback visual
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 320);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Formatar a mensagem do WhatsApp comercial
    const msg =
      `*Novo Pré-Diagnóstico Industrial (OStrack)*\n\n` +
      `*Nome:* ${formData.nome}\n` +
      `*Empresa:* ${formData.empresa}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*WhatsApp:* ${formData.telefone}\n\n` +
      `*Respostas da Operação:*\n` +
      `1. *Volume de OS:* ${answers.volume}\n` +
      `2. *Maior gargalo:* ${answers.gargalo}\n` +
      `3. *Controle atual:* ${answers.controle}\n` +
      `4. *Custo estimado de parada:* ${answers.custo}`;

    const formattedWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setWaUrl(formattedWaUrl);

    // 1. Meta Pixel Lead Tracking
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: "OStrack Diagnóstico",
        lead_type: answers.gargalo,
        value: answers.custo.includes("Mais") ? 50000 : 10000,
        currency: "BRL",
      });
    }

    // 2. Gravar no banco de dados do CRM Erick
    const payload = {
      nome: formData.nome,
      empresa: formData.empresa,
      email: formData.email,
      telefone: formData.telefone,
      segmento: "recuperadora_industrial",
      gargalo_primario: answers.gargalo,
      faturamento: answers.custo,
      answers: {
        volume_os: answers.volume,
        gargalo: answers.gargalo,
        controle_atual: answers.controle,
        custo_parada: answers.custo,
      },
      source: "ostrack-site",
    };

    try {
      let apiEndpoint = "https://crmerick.vercel.app/api/quiz-leads";
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        apiEndpoint = "http://localhost:3020/api/quiz-leads";
      }

      await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });
    } catch (err) {
      console.error("Erro ao salvar no CRM, prosseguindo com redirecionamento:", err);
    }

    // 3. Redirecionar para o WhatsApp
    if (typeof window !== "undefined") {
      window.open(formattedWaUrl, "_blank", "noopener,noreferrer");
    }

    setLoading(false);
    setStep(6); // Ir para tela de sucesso
  }

  // Progresso em porcentagem
  const progressPercent = Math.min(100, Math.max(0, ((step - 1) / (stepsTotal - 1)) * 100));

  return (
    <Section className="pt-12 sm:pt-16 pb-20">
      <div className="max-w-2xl mx-auto">
        
        {/* TELA 0: INTRODUÇÃO */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <Eyebrow>Pré-Diagnóstico</Eyebrow>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-ink leading-tight">
              Raio-X de Eficiência: Onde sua OS industrial está perdendo margem?
            </h1>
            <p className="text-lg text-mute leading-relaxed max-w-xl mx-auto">
              Responda 4 perguntas rápidas e descubra o gargalo invisível que está atrasando suas entregas e gerando prejuízo oculto na sua recuperação de peças.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setStep(1)}
                variant="glass"
                color="brand"
                className="px-8 h-12 text-base"
              >
                Iniciar Diagnóstico Gratuito <Icons.arrowRight className="ml-1" />
              </Button>
            </div>
            <p className="text-xs text-faint">Leva menos de 1 minuto. Sem compromisso.</p>
          </div>
        )}

        {/* TELAS DO QUIZ (1 A 5) */}
        {step >= 1 && step <= 5 && (
          <div className="space-y-6">
            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-mute">
                <span>Progresso do Diagnóstico</span>
                <span className="font-semibold text-brand">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <Card className="p-6 sm:p-8 border border-rule shadow-card-1 bg-paper relative overflow-hidden transition-all duration-300">
              
              {/* PERGUNTA 1: VOLUME */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <span className="mono text-brand text-xs font-semibold uppercase tracking-wider">Passo 1 de 4</span>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                    Qual o volume médio de OS de recuperação que sua planta gerencia mensalmente?
                  </h2>
                  <div className="grid gap-3 pt-2">
                    {[
                      "Até 10 OS/mês",
                      "11 a 30 OS/mês",
                      "31 a 80 OS/mês",
                      "Mais de 80 OS/mês"
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption("volume", opt)}
                        className={`text-left px-5 py-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          answers.volume === opt
                            ? "border-brand bg-brand-tint/30 text-brand shadow-sm"
                            : "border-rule bg-paper hover:bg-paper-3 hover:border-ink-3 text-ink-2"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PERGUNTA 2: GARGALO */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="mono text-brand text-xs font-semibold uppercase tracking-wider">Passo 2 de 4</span>
                    <button onClick={() => setStep(1)} className="text-xs text-mute hover:text-brand flex items-center gap-1">
                      ← Voltar
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                    Qual é o maior gargalo operacional que tira o seu sono hoje?
                  </h2>
                  <div className="grid gap-3 pt-2">
                    {[
                      { val: "Atraso na entrega das peças", label: "Atraso na entrega das peças (equipamento parado esperando)" },
                      { val: "Falta de rastreabilidade", label: "Falta de rastreabilidade (não saber em qual etapa a OS está parada)" },
                      { val: "Retrabalho e falta de qualidade", label: "Retrabalho e falta de qualidade (peças que quebram rápido)" },
                      { val: "Falta de histórico e Databook", label: "Falta de histórico e Databook (demora para juntar laudos/relatórios)" }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleSelectOption("gargalo", opt.val)}
                        className={`text-left px-5 py-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          answers.gargalo === opt.val
                            ? "border-brand bg-brand-tint/30 text-brand shadow-sm"
                            : "border-rule bg-paper hover:bg-paper-3 hover:border-ink-3 text-ink-2"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PERGUNTA 3: CONTROLE */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="mono text-brand text-xs font-semibold uppercase tracking-wider">Passo 3 de 4</span>
                    <button onClick={() => setStep(2)} className="text-xs text-mute hover:text-brand flex items-center gap-1">
                      ← Voltar
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                    Como a sua empresa tenta controlar o pipeline de recuperação atualmente?
                  </h2>
                  <div className="grid gap-3 pt-2">
                    {[
                      "Planilhas manuais (Excel/Sheets) que exigem atualização constante",
                      "Sistema ERP genérico (que não atende o fluxo real de fábrica)",
                      "Papel, e-mails, WhatsApp ou quadros físicos pela fábrica",
                      "Não temos controle centralizado (reativo/apagando incêndio)"
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption("controle", opt)}
                        className={`text-left px-5 py-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          answers.controle === opt
                            ? "border-brand bg-brand-tint/30 text-brand shadow-sm"
                            : "border-rule bg-paper hover:bg-paper-3 hover:border-ink-3 text-ink-2"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PERGUNTA 4: CUSTO DE INAÇÃO */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="mono text-brand text-xs font-semibold uppercase tracking-wider">Passo 4 de 4</span>
                    <button onClick={() => setStep(3)} className="text-xs text-mute hover:text-brand flex items-center gap-1">
                      ← Voltar
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                    Estimativa: Quanto custa para a sua operação 1 dia de equipamento parado por atraso na recuperação?
                  </h2>
                  <div className="grid gap-3 pt-2">
                    {[
                      "Até R$ 10.000 / dia",
                      "Entre R$ 10.000 e R$ 50.000 / dia",
                      "Mais de R$ 50.000 / dia"
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption("custo", opt)}
                        className={`text-left px-5 py-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          answers.custo === opt
                            ? "border-brand bg-brand-tint/30 text-brand shadow-sm"
                            : "border-rule bg-paper hover:bg-paper-3 hover:border-ink-3 text-ink-2"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ETAPA 5: CAPTURA FINAL */}
              {step === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="mono text-brand text-xs font-semibold uppercase tracking-wider">Envio do Relatório</span>
                    <button onClick={() => setStep(4)} className="text-xs text-mute hover:text-brand flex items-center gap-1">
                      ← Voltar
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                    Diagnóstico Concluído. Para onde enviamos o relatório técnico e a análise?
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="eyebrow mb-1.5 block">Nome Completo</span>
                        <input
                          name="nome"
                          required
                          value={formData.nome}
                          onChange={handleInputChange}
                          placeholder="Seu nome"
                          className="w-full h-11 px-3.5 rounded-md bg-paper border border-rule text-ink placeholder:text-faint text-sm focus:border-brand focus:outline-none transition-colors"
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow mb-1.5 block">Empresa</span>
                        <input
                          name="empresa"
                          required
                          value={formData.empresa}
                          onChange={handleInputChange}
                          placeholder="Sua recuperadora"
                          className="w-full h-11 px-3.5 rounded-md bg-paper border border-rule text-ink placeholder:text-faint text-sm focus:border-brand focus:outline-none transition-colors"
                        />
                      </label>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="eyebrow mb-1.5 block">E-mail Corporativo</span>
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="voce@empresa.com"
                          className="w-full h-11 px-3.5 rounded-md bg-paper border border-rule text-ink placeholder:text-faint text-sm focus:border-brand focus:outline-none transition-colors"
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow mb-1.5 block">WhatsApp com DDD</span>
                        <input
                          name="telefone"
                          type="tel"
                          required
                          value={formData.telefone}
                          onChange={handleInputChange}
                          placeholder="(31) 99999-0000"
                          className="w-full h-11 px-3.5 rounded-md bg-paper border border-rule text-ink placeholder:text-faint text-sm focus:border-brand focus:outline-none transition-colors"
                        />
                      </label>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="glass"
                        color="ok"
                        className="w-full h-12 text-base font-semibold"
                      >
                        {loading ? (
                          "Processando..."
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.737-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            GERAR MEU DIAGNÓSTICO INDUSTRIAL →
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  <p className="text-xs text-faint text-center">
                    Garantimos a total privacidade dos dados operacionais compartilhados.
                  </p>
                </div>
              )}

            </Card>
          </div>
        )}

        {/* TELA 6: SUCESSO */}
        {step === 6 && (
          <div className="animate-fade-in">
            <Card className="border border-rule shadow-card-1 bg-paper p-8 flex flex-col items-center text-center justify-center min-h-[420px] space-y-6">
              <div className="w-16 h-16 rounded-full bg-ok/10 text-ok flex items-center justify-center text-3xl">
                ✓
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-ink tracking-tight">Tudo pronto!</h2>
                <p className="text-mute max-w-sm">
                  Salvamos seu pré-diagnóstico no CRM e preparamos a sua análise. Caso a janela de conversa do WhatsApp não tenha aberto automaticamente, clique no botão abaixo para iniciar.
                </p>
              </div>

              <div className="w-full max-w-xs pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-sm font-medium tracking-tight overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 w-full"
                  style={{
                    background: "linear-gradient(135deg, #0E9F6E 0%, #16B981 50%, #34D399 100%)",
                    boxShadow: "0 18px 35px rgba(14,159,110,0.40), 0 0 0 1px rgba(187,247,221,0.30), inset 0 1px 0 rgba(255,255,255,0.25)",
                    color: "#eef2ff"
                  }}
                >
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.737-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  ABRIR WHATSAPP MANUALMENTE
                </a>
              </div>

              <button
                onClick={() => {
                  setAnswers({ volume: "", gargalo: "", controle: "", custo: "" });
                  setFormData({ nome: "", empresa: "", email: "", telefone: "" });
                  setStep(0);
                }}
                className="text-sm text-brand hover:underline"
              >
                Responder novamente
              </button>
            </Card>
          </div>
        )}

      </div>
    </Section>
  );
}
