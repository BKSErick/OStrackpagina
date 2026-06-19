import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://ostrack.com.br"),
  title: {
    default: "OStrack: Gestão de Ordens de Serviço Industrial",
    template: "%s · OStrack",
  },
  description:
    "Sistema de gestão de ordens de serviço para recuperadoras industriais. Controle todo o ciclo: entrada, peritagem, aprovação, execução, montagem e entrega, com o lead time sob controle.",
  keywords: [
    "ordem de serviço industrial",
    "recuperadora industrial",
    "gestão de OS",
    "peritagem",
    "lead time industrial",
    "manutenção industrial",
  ],
  openGraph: {
    title: "OStrack: Gestão de Ordens de Serviço Industrial",
    description:
      "Controle todo o ciclo da OS: entrada, peritagem, aprovação, execução, montagem e entrega.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport = {
  themeColor: "#2952E3",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      data-theme="safe"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
