import type { Metadata } from "next";
import "../globals.css";
import { Alpino } from "@/libs/font";
import Navbar from "@/components/navigation";
import { AuthProvider } from "@/context/AuthProvider";
import CtaFooter from "@/components/footer";
import Script from "next/script";
import TerminalLoader from "@/components/terminalLoader";

const SITE_URL = 'https://dohou.vercel.app';
export const metadata: Metadata = {
  title: 'Développeur Full-Stack | Dohou Gbenoupko Fawase',
  description: 'Je conçois des produits web et mobiles performants et scalables pour booster votre croissance.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/og-image.svg',
  },
  openGraph: {
    title: 'Dohou Gbenoupko Fawase — AKA OMO IYA ONIRICE',
    description: 'Ingénieur logiciel et créateur de produits pour startups.',
    url: SITE_URL,
    siteName: 'Mon Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${Alpino.variable} h-full`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z874S8CXDD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z874S8CXDD');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {/* Placé en haut pour bloquer l'écran dès le premier rendu */}
          <TerminalLoader />
          <Navbar />
          {children}
          <CtaFooter />
        </AuthProvider>
      </body>
    </html>
  );
}