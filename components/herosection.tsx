/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

/**
 * Section Hero — Reproduction pixel-perfect, fond BLANC, accents orange.
 */
const PHOTO_URL =
  "/images/dohou-gbenoupko-fawase-portrait.png";

const STATS = [
  { value: "34+", label: "PRODUITS LIVRÉS" },
  { value: "6+", label: "ANS D'EXPÉRIENCE" },
  { value: "5+", label: "SECTEURS D'ACTIVITÉ" },
  { value: "99.9%", label: "MINDSET HAUTE DISPO" },
];

const TAGS = [
  "Systèmes Scalables",
  "Product Design",
  "Développement Web & Mobile",
  "Branding",
  "Intelligence Artificielle",
  "SaaS",
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-white text-black overflow-hidden">
      {/* Style injecté temporairement pour l'animation du défilement infini */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: infinite-scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Halo radial subtil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative mx-auto  container px-6 pt-16 pb-10 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---------------- COLONNE GAUCHE ---------------- */}
          <div>
            {/* Badge de disponibilité */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/2 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-black/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              DISPONIBLE EN FREELANCE &amp; CDI
            </div>

            {/* Nom */}
            <p className="mt-6 text-[13px] font-bold tracking-widest text-orange-600">
              DOHOU GBENOUPKO FAWASE — AKA OMO IYA ONIRICE
            </p>

            {/* Titre principal */}
            <h1 className="mt-4 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-black sm:text-6xl">
              Je conçois des produits qui
              <br />
              résolvent de vrais problèmes
              <br />
              et <span className="text-orange-600">génèrent de la croissance.</span>
            </h1>

            {/* Description avec intégration IA */}
            <p className="mt-6 max-w-auto text-[15px] leading-relaxed text-black/60">
              Ingénieur logiciel et créateur de produits pour startups et entreprises.
              Je transforme des problèmes complexes en applications rapides, scalables et
              dotées d&apos;IA pour convertir vos visiteurs en clients. Du design au frontend,
              jusqu&lsquo;au backend : l&apos;objectif n&apos;est pas juste de coder, mais de mesurer votre succès.
            </p>

            {/* Boutons d'action */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500">
                LANCER UN PROJET
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>

              <button className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-bold text-black transition hover:bg-black/5">
                VOIR MES PROJETS
              </button>

              <a
                href="/resumen/fawase_dohou.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="CV_DOHOU_Fawase.pdf"
                className="inline-flex items-center gap-1 text-sm font-bold text-black/70 underline underline-offset-4 transition hover:text-black">
                CV / RÉSUMÉ
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>
            </div>

            {/* Statistiques */}
            <div className="mt-10 inline-grid grid-cols-4 gap-x-10 rounded-2xl border border-black/10 px-8 py-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold text-black sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold tracking-wide text-black/45">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- COLONNE DROITE — PHOTO ---------------- */}
          <div className="relative mx-auto flex h-105 w-[320px] items-center justify-center sm:h-120 sm:w-90">
            {/* Carte arrière-plan (terracotta), pivotée */}
            <div className="absolute inset-0 rotate-[8deg] rounded-[28px] bg-linear-to-br from-[#3a2318] to-[#241209]" />

            {/* Carte orange + Photo */}
            <div className="absolute inset-0 -rotate-3 overflow-hidden rounded-[28px] bg-linear-to-br  shadow-2xl">
              <img
                src={PHOTO_URL}
                alt="Dohou Gbenoupko Fawase"
                className="h-full w-full object-cover mix-blend-luminosity opacity-90"
              />
            </div>

            {/* Badge de situation actuelle */}
            <div className="absolute -rotate-3 bottom-6 left-2 rounded-xl bg-black/85 px-4 py-2.5 backdrop-blur-sm">
              <div className="text-[9px] font-bold tracking-widest text-white/50">
                ACTUELLEMENT
              </div>
              <div className="text-[13px] font-bold text-white">
                software engineer @ Avoakaconsulting
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- SECTION TAGS DÉFILANTS (INFINITE SCROLL) ---------------- */}
        <div className="mt-14 border-t border-black/10 pt-6 relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div className="animate-scroll py-2">
            {/* On duplique la liste des tags pour permettre la transition infinie transparente */}
            {[...TAGS, ...TAGS].map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="inline-flex items-center gap-4 mx-4 text-lg font-semibold text-black/80 sm:text-xl whitespace-nowrap">
                <Sparkles className="h-4 w-4 text-orange-600" strokeWidth={2} />
                <span className="font-serif italic">{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}