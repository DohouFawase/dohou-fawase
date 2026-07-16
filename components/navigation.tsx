"use client";

import useAuth from "@/hooks/useAuth";
import { useState } from "react";

const LINKS = [
  { label: "À PROPOS", href: "#about" },
  { label: "EXPÉRIENCE", href: "#work" },
  { label: "COMPÉTENCES", href: "#stack" },
  { label: "PROJETS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex container items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-orange-600" />
          <span className="text-[15px] font-bold text-black">
            OMO iya oniRice
          </span>
        </a>

        {/* Nav links (Desktop) */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[11px] font-semibold tracking-widest text-black/50 transition hover:text-black"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + Login (Desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          {!loading && (
            <a
              href={user ? "/dashboard" : "/auth"}
              className="text-[11px] font-semibold tracking-widest text-black/60 transition hover:text-black"
            >
              {user ? "MON COMPTE" : "CONNEXION"}
            </a>
          )}
          <button className="rounded-full bg-black px-5 py-2.5 text-[11px] font-bold tracking-widest text-white transition hover:bg-black/85">
            ME RECRUTER →
          </button>
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
            <li key={link.label}>
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
              <a
                href={user ? "/dashboard" : "/auth"}
                onClick={() => setOpen(false)}
                className="block text-[13px] font-semibold tracking-widest text-black/70 transition hover:text-black"
              >
                {user ? "MON COMPTE" : "CONNEXION"}
              </a>
            </li>
          )}
          <li>
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-full bg-black px-5 py-3 text-[11px] font-bold tracking-widest text-white transition hover:bg-black/85"
            >
              ME RECRUTER →
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}