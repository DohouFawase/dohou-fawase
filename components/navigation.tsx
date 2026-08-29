/* eslint-disable react-hooks/static-components */
"use client";

import useAuth from "@/hooks/useAuth";
import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const CV_FILE_PATH = "/resumen/fawase_dohou.pdf";
const CV_DOWNLOAD_NAME = "CV_DOHOU_Fawase.pdf";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const LINKS = [
    { label: t("about"), href: "#about" },
    { label: t("experience"), href: "#work" },
    { label: t("skills"), href: "#stack" },
    { label: t("projects"), href: "#projects" },
    { label: t("contact"), href: "#contact" },
  ];

  const switchLocale = () => {
    const nextLocale = locale === "fr" ? "en" : "fr";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
    if (open) setOpen(false);
  };

  const handleDownloadCV = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      supabase.rpc("increment_cv_downloads").then(({ error }) => {
        if (error) console.error("Erreur RPC CV:", error);
      });
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur CV:", error);
    }

    const link = document.createElement("a");
    link.href = CV_FILE_PATH;
    link.download = CV_DOWNLOAD_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (open) setOpen(false);
  };

  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <button
      type="button"
      onClick={switchLocale}
      disabled={isPending}
      aria-label={`Switch language to ${locale === "fr" ? "English" : "Français"}`}
      className={`relative inline-flex h-7 w-16 items-center rounded-full border border-black/10 bg-black/5 px-1 transition disabled:opacity-50 ${className}`}
    >
      {/* Curseur qui glisse */}
      <span
        className={`absolute top-0.5 left-0.5 flex h-6 w-7 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm transition-transform duration-300 ease-out ${
          locale === "en" ? "translate-x-7.5" : "translate-x-0"
        }`}
      >
        {locale.toUpperCase()}
      </span>

      {/* Labels fixes en fond */}
      <span className="flex w-full justify-between px-1.5 text-[9px] font-bold tracking-wide text-black/30">
        <span>FR</span>
        <span>EN</span>
      </span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto container flex items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-orange-600" />
          <span className="text-[15px] font-bold text-black">
            OMO iya oniRice
          </span>
        </Link>

        {/* Nav links (Desktop) */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[11px] font-semibold tracking-widest text-black/50 transition hover:text-black"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + Login + Switch langue (Desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <LangSwitch />
          {!loading && (
            <Link
              href={user ? "/dashboard" : "/auth"}
              className="text-[11px] font-semibold tracking-widest text-black/60 transition hover:text-black"
            >
              {user ? t("account") : t("login")}
            </Link>
          )}
          <a
            href={CV_FILE_PATH}
            onClick={handleDownloadCV}
            className="rounded-full bg-black px-5 py-2.5 text-[11px] font-bold tracking-widest text-white transition hover:bg-black/85"
          >
            {t("hireMe")} →
          </a>
        </div>

        {/* Burger button (Mobile) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-black transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-black transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-black transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-6 border-t border-black/10 bg-white px-6 py-6 sm:px-10">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[13px] font-semibold tracking-widest text-black/70 transition hover:text-black"
              >
                {link.label}
              </a>
            </li>
          ))}
          {!loading && (
            <li>
              <Link
                href={user ? "/dashboard" : "/auth"}
                onClick={() => setOpen(false)}
                className="block text-[13px] font-semibold tracking-widest text-black/70 transition hover:text-black"
              >
                {user ? t("account") : t("login")}
              </Link>
            </li>
          )}
          <li>
            <a
              href={CV_FILE_PATH}
              onClick={handleDownloadCV}
              className="inline-block w-full text-center rounded-full bg-black px-5 py-3 text-[11px] font-bold tracking-widest text-white transition hover:bg-black/85"
            >
              {t("hireMe")} →
            </a>
          </li>
          <li className="pt-2">
            <LangSwitch />
          </li>
        </ul>
      </div>
    </header>
  );
}