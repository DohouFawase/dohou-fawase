import type { Metadata } from "next";
import "../globals.css";
import { Alpino } from "@/libs/font";
import Navbar from "@/components/navigation";
import { AuthProvider } from "@/context/AuthProvider";
import CtaFooter from "@/components/footer";
import Script from "next/script";



// 💡 Remplacez par votre vrai domaine une fois déployé sur Vercel
const SITE_URL = 'https://dohou.vercel.app';
export const metadata: Metadata = {
  title: 'Développeur Full-Stack | Dohou Gbenoupko Fawase',
  description: 'Je conçois des produits web et mobiles performants et scalables pour booster votre croissance.',
  metadataBase: new URL(SITE_URL), // Indique à Next.js de préfixer automatiquement les chemins relatifs
  alternates: {
    canonical: '/', // Sera traduit en https://votre-portfolio.vercel.app/
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
        url: '/og-image.png', // Placé dans public/og-image.svg (Next.js utilisera metadataBase pour la rendre absolue)
        width: 1200,
        height: 630,
        type: 'image/png', // Optionnel mais recommandé pour les fichiers SVG
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
      lang="fr" // Passé en "fr" car votre contenu est en français
      className={`${Alpino.variable} h-full`}
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z874S8CXDD"
        strategy="afterInteractive"
      />

      {/* Deuxième script : Initialise la configuration de Google Analytics */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z874S8CXDD');
          `}
      </Script>
      <head>

        <body className="min-h-full flex flex-col">
          <AuthProvider>
            <Navbar />
            {children}
            <CtaFooter />
          </AuthProvider>
        </body>
      </head>
    </html>
  );
}