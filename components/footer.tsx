import { ArrowUp, ArrowUpRight, Mail, Sparkles } from "lucide-react";

const EMAIL = "dohoufawase@gmail.com";
const WHATSAPP_URL = "https://wa.me/2290197395756";

const FOOTER_LINKS = [
  { label: "À propos", href: "#about" },
  { label: "Parcours", href: "#work" },
  { label: "Méthode", href: "#method" },
  { label: "Projets", href: "#projects" },
  { label: "Expertise", href: "#stack" },
  { label: "Principes", href: "#principles" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/DohouFawase" },
  { label: "LinkedIn", href: "https://linkedin.com/in/dohou-fawase" },
  { label: "X", href: "https://x.com/omo_iya_oniRice" },
];

export default function CtaFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="portfolio-footer relative overflow-hidden bg-[#121211] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 -top-56 h-[34rem] w-[34rem] rounded-full border border-orange-200/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-36 h-[25rem] w-[25rem] rounded-full border border-orange-200/10"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-6 pt-16 sm:px-10 sm:pt-20 lg:px-16 lg:pt-24">
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16 lg:pb-20">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-orange-300 sm:text-[11px]">
              <Sparkles size={14} />
              UNE IDÉE À FAIRE GRANDIR ?
            </p>
            <h2 className="mt-6 max-w-3xl text-[clamp(2.6rem,7vw,6.2rem)] font-medium leading-[0.94] tracking-[-0.065em]">
              Faisons-en
              <span className="block font-serif italic text-orange-400">
                quelque chose de réel.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
              Produit web ou mobile, nouvelle fonctionnalité ou renfort
              technique : racontez-moi ce que vous voulez construire.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <a
              href="#contact"
              className="footer-primary-cta group inline-flex min-h-14 w-full items-center justify-between gap-8 rounded-full bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-400 sm:w-auto sm:min-w-72"
            >
              Parlons de votre projet
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 transition group-hover:rotate-45 group-hover:bg-white/25">
                <ArrowUpRight size={17} />
              </span>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 px-6 text-xs font-semibold text-white/75 transition hover:border-white/50 hover:text-white sm:w-auto"
            >
              Ou échangeons sur WhatsApp
              <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/12 py-10 md:grid-cols-[1fr_1.2fr_1fr] md:items-start md:gap-8">
          <div>
            <a
              href="#hero"
              className="inline-flex items-center gap-3"
              aria-label="Retour à l’accueil"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-serif text-xl italic text-black">
                F
              </span>
              <span>
                <span className="block text-sm font-bold tracking-wide">
                  DOHOU FAWASE
                </span>
                <span className="mt-1 block text-[9px] font-semibold tracking-[0.17em] text-white/40">
                  INGÉNIERIE LOGICIELLE · PRODUIT
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-xs leading-6 text-white/45">
              Ingénierie logicielle, conception produit et expériences
              numériques pensées pour durer.
            </p>
          </div>

          <nav aria-label="Navigation de pied de page">
            <p className="mb-4 text-[9px] font-bold tracking-[0.18em] text-white/35">
              EXPLORER
            </p>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="footer-nav-link text-xs text-white/65 transition hover:text-orange-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-[9px] font-bold tracking-[0.18em] text-white/35">
              RESTONS EN CONTACT
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-orange-300"
            >
              <Mail size={15} className="text-orange-300" />
              {EMAIL}
              <ArrowUpRight size={13} />
            </a>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold tracking-widest text-white/45 transition hover:text-white"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-5 text-[9px] font-medium tracking-[0.1em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} DOHOU GBENOUPKO FAWASE. TOUS DROITS RÉSERVÉS.</p>
          <p>CONÇU AVEC SOIN · BÉNIN</p>
          <a
            href="#hero"
            className="group inline-flex items-center gap-2 self-start text-white/65 transition hover:text-white sm:self-auto"
          >
            RETOUR EN HAUT
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/15 transition group-hover:-translate-y-0.5 group-hover:border-orange-300 group-hover:text-orange-300">
              <ArrowUp size={13} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
