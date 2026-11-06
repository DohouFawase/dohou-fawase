import type { Metadata } from "next";
import "../globals.css";
import { Alpino } from "@/libs/font";
import Navbar from "@/components/navigation";
import { AuthProvider } from "@/context/AuthProvider";
import CtaFooter from "@/components/footer";
import Script from "next/script";
import TerminalLoader from "@/components/terminalLoader";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { VisitorWelcome } from "@/components/visitor-welcome";
import ScrollMotion from "@/components/scroll-motion";

const SITE_URL = 'https://dohou.vercel.app';
export const metadata: Metadata = {
  title: 'Développeur Full-Stack | Dohou Gbenoupko Fawase',
  description: 'Ingénieur logiciel au croisement du produit, du design et du développement. Découvrez le parcours, les projets et les expertises de Dohou Gbenoupko Fawase.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/og-image.svg',
  },
  openGraph: {
    title: 'Dohou Gbenoupko Fawase — Produit, design et ingénierie',
    description: 'Portfolio de Dohou Fawase : expériences, projets web et mobile, méthode de travail et contact.',
    url: SITE_URL,
    siteName: 'Dohou Fawase — Portfolio',
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
          <ScrollMotion />
          <AnalyticsTracker />
          <Navbar />
          {children}
          <VisitorWelcome />
          <CtaFooter />
        </AuthProvider>
      </body>
    </html>
  );
}