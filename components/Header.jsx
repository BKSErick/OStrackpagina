import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui";

const nav = [
  { label: "Início", href: "/" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Recursos", href: "/recursos" },
  { label: "Contato", href: "/contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur-md border-b border-rule">
      <div className="mx-auto max-w-content px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" aria-label="OStrack, início">
          <Wordmark size={17} sub="OS TRACKING" />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-2 hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/contato" variant="ghost" className="hidden sm:inline-flex">
            Entrar
          </Button>
          <Button href="/contato">Solicitar demo</Button>
        </div>
      </div>
    </header>
  );
}
