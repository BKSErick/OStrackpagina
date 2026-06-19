import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper mt-24">
      <div className="mx-auto max-w-content px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-xs">
            <Wordmark size={17} sub="OS TRACKING" />
            <p className="mt-4 text-sm text-mute leading-relaxed">
              Gestão de ordens de serviço para recuperadoras industriais.
              Do recebimento à entrega, com o lead time sob controle.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            <FooterCol
              title="Produto"
              links={[
                { label: "Como funciona", href: "/como-funciona" },
                { label: "Recursos", href: "/recursos" },
              ]}
            />
            <FooterCol
              title="Empresa"
              links={[{ label: "Contato", href: "/contato" }]}
            />
            <FooterCol
              title="Comece"
              links={[{ label: "Solicitar demo", href: "/contato" }]}
            />
          </div>
        </div>

        <div className="hairline my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint">
          <span>© {new Date().getFullYear()} OStrack. Todos os direitos reservados.</span>
          <span className="mono">CLI First · Observability Second · UI Third</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="eyebrow mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-2 hover:text-ink transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
