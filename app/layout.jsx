import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1175331711422463";

export const metadata = {
  metadataBase: new URL("https://ostrack.com.br"),
  title: {
    default: "OStrack: Pipeline de Recuperação Industrial",
    template: "%s · OStrack",
  },
  description:
    "Pipeline de recuperação industrial para controlar OS, peritagem, escopo técnico, aprovação do cliente, qualidade, lead time e base documental para databook.",
  keywords: [
    "ordem de serviço industrial",
    "recuperadora industrial",
    "gestão de OS",
    "peritagem",
    "lead time industrial",
    "databook industrial",
    "manutenção industrial",
  ],
  openGraph: {
    title: "OStrack: Pipeline de Recuperação Industrial",
    description:
      "Controle a OS do recebimento à entrega: peritagem, escopo técnico, aprovação, execução, qualidade e documento final.",
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
        {META_PIXEL_ID ? (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
                `,
              }}
            />
            {/* Radar de Sinais do CRM: o fbq nao alimenta o banco do CRM, esse script sim. */}
            <Script
              id="crm-sinais"
              strategy="afterInteractive"
              src="https://crmerick.vercel.app/diagnostico-pixel.js"
              data-endpoint="https://crmerick.vercel.app/api/facebook-pixel"
              data-client-name="Site OStrack"
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
