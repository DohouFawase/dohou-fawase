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
import { LanguageProvider } from "@/context/LanguageProvider";

const SITE_URL = 'https://dohou.vercel.app';
export const metadata: Metadata = {
  title: 'Full-Stack Developer | Dohou Gbenoupko Fawase',
  description: 'Software engineer at the intersection of product, design, and development. Explore Dohou Gbenoupko Fawase’s experience, projects, and expertise.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/og-image.svg',
  },
  openGraph: {
    title: 'Dohou Gbenoupko Fawase — Product, Design, and Engineering',
    description: 'Dohou Fawase’s portfolio: experience, web and mobile projects, approach, and contact.',
    url: SITE_URL,
    siteName: 'Dohou Fawase — Portfolio',
    locale: 'en_US',
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
      lang="en"
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
        <LanguageProvider>
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
        </LanguageProvider>
      </body>
    </html>
  );
}
