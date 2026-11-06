"use client";

import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowDownToLine, ArrowUpRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "À propos", number: "01", href: "#about" },
  { label: "Parcours", number: "02", href: "#work" },
  { label: "Projets", number: "04", href: "#projects" },
  { label: "Expertise", number: "05", href: "#stack" },
  { label: "Contact", number: "07", href: "#contact" },
];

const CV_FILE_PATH = "/resumen/fawase_dohou.pdf";
const CV_DOWNLOAD_NAME = "CV_DOHOU_Fawase.pdf";
const SECTION_IDS = [
  "hero",
  "about",
  "work",
  "method",
  "projects",
  "stack",
  "principles",
  "contact",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { user, loading } = useAuth();

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) {
          const currentIndex = SECTION_IDS.indexOf(current.target.id);
          const activeLink = [...LINKS]
            .reverse()
            .find((link) => SECTION_IDS.indexOf(link.href.slice(1)) <= currentIndex);
          setActiveSection(activeLink?.href.slice(1) ?? "hero");
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.35] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  // Enregistrement dans Supabase + Déclenchement du téléchargement
  const handleDownloadCV = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 1. Appel asynchrone Supabase (RPC) en arrière-plan
    try {
      const supabase = createClient();
      supabase.rpc("increment_cv_downloads").then(({ error }) => {
        if (error) console.error("Erreur RPC CV:", error);
      });
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur CV:", error);
    }

    // 2. Déclenchement propre du téléchargement côté navigateur
    const link = document.createElement("a");
    link.href = CV_FILE_PATH;
    link.download = CV_DOWNLOAD_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3. Fermeture du menu mobile si ouvert
    if (open) setOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="site-nav mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-7 lg:px-10">
        <a
          href="#hero"
          className="brand-link group flex min-w-0 items-center gap-3"
          aria-label="Retour à l’accueil"
        >
          <span className="brand-mark" aria-hidden="true">
            <span>F</span>
            <i />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold tracking-tight text-black sm:text-sm">
              DOHOU FAWASE
            </span>
            <span className="mt-0.5 hidden text-[9px] font-semibold tracking-[0.16em] text-black/40 sm:block">
              PRODUCT ENGINEER
            </span>
          </span>
        </a>

        <ul className="nav-capsule hidden items-center gap-1 p-1 lg:flex">
          {LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`nav-capsule-link ${isActive ? "is-active" : ""}`}
                >
                  <span className="nav-capsule-number">{link.number}</span>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && (
            <a
              href={user ? "/dashboard" : "/auth"}
              className="nav-account-link"
            >
              {user ? "MON ESPACE" : "CONNEXION"}
            </a>
          )}
          <a href={CV_FILE_PATH} onClick={handleDownloadCV} className="cv-link">
            CV <ArrowDownToLine size={13} />
          </a>
          <a href="#contact" className="nav-contact-link">
            <span>Parlons projet</span>
            <span className="nav-contact-icon">
              <ArrowUpRight size={15} />
            </span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((isOpen) => !isOpen)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className={`mobile-menu-toggle lg:hidden ${open ? "is-open" : ""}`}
        >
          <span>{open ? "FERMER" : "MENU"}</span>
          <span className="mobile-menu-icon">
            {open ? <X size={18} /> : <Menu size={18} />}
          </span>
        </button>
      </nav>

      <div
        id="mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        className={`mobile-nav-panel lg:hidden ${open ? "is-open" : ""}`}
      >
        <div className="mobile-nav-inner">
          <p className="mobile-nav-kicker">NAVIGATION · PORTFOLIO</p>
          <ul className="mobile-nav-links">
            {LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                  >
                    <span className="mobile-nav-number">{link.number}</span>
                    <span>{link.label}</span>
                    <ArrowUpRight size={17} />
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mobile-nav-actions">
            {!loading && (
              <a href={user ? "/dashboard" : "/auth"} onClick={() => setOpen(false)}>
                {user ? "MON ESPACE" : "CONNEXION"}
              </a>
            )}
            <a href={CV_FILE_PATH} onClick={handleDownloadCV}>
              Télécharger le CV <ArrowDownToLine size={14} />
            </a>
          </div>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mobile-nav-cta"
            tabIndex={open ? 0 : -1}
          >
            Construisons quelque chose
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}