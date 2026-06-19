"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

// WhatsApp de destino (Erick / OStrack). Formato wa.me: DDI+DDD+numero, só dígitos.
const WHATSAPP_NUMBER = "5531991072407";

const field =
  "w-full h-11 px-3.5 rounded-md bg-paper border border-rule text-ink placeholder:text-faint text-sm focus:border-brand focus:outline-none transition-colors";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const msg =
      `*Nova solicitação de demo (OStrack)*\n\n` +
      `*Nome:* ${data.get("nome")}\n` +
      `*Empresa:* ${data.get("empresa")}\n` +
      `*E-mail:* ${data.get("email")}\n` +
      `*Telefone:* ${data.get("telefone") || "não informado"}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-paper border border-rule rounded-lg shadow-card-1 p-8 flex flex-col items-center text-center justify-center min-h-[360px]">
        <div className="w-12 h-12 rounded-full bg-ok/10 text-ok flex items-center justify-center text-2xl">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-semibold text-ink">Quase lá!</h2>
        <p className="mt-2 text-mute max-w-xs">
          Abrimos o WhatsApp com sua solicitação. É só apertar enviar que a gente
          responde rapidinho.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 text-sm text-brand hover:underline"
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper border border-rule rounded-lg shadow-card-1 p-6 sm:p-8 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Label text="Nome">
          <input name="nome" required placeholder="Seu nome" className={field} />
        </Label>
        <Label text="Empresa">
          <input name="empresa" required placeholder="Sua recuperadora" className={field} />
        </Label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Label text="E-mail">
          <input name="email" type="email" required placeholder="voce@empresa.com" className={field} />
        </Label>
        <Label text="Telefone">
          <input name="telefone" placeholder="(31) 90000-0000" className={field} />
        </Label>
      </div>
      <Button type="submit" variant="glass" color="ok" className="w-full">
        <WhatsAppIcon /> Enviar pelo WhatsApp
      </Button>
      <p className="text-xs text-faint text-center">
        Ao enviar, abrimos o WhatsApp com seus dados preenchidos.
      </p>
    </form>
  );
}

function Label({ text, children }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block">{text}</span>
      {children}
    </label>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.737-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}
