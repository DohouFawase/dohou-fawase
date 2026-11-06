"use client";

import { createClient } from "@/utils/supabase/client";

const SERVICES = [
  {
    n: "01",
    title: "Design produit",
    desc: "Des premières maquettes aux interfaces finalisées, avec une attention particulière portée à la clarté, à l’accessibilité et aux objectifs du produit.",
  },
  {
    n: "02",
    title: "Développement web et mobile",
    desc: "Des interfaces soignées et des back-ends maintenables avec React, Next.js, Laravel ou NestJS. Le choix technique dépend du besoin.",
  },
  {
    n: "03",
    title: "Identité visuelle",
    desc: "Des bases graphiques cohérentes pour aider un produit à se distinguer et à inspirer confiance.",
  },
  {
    n: "04",
    title: "Architecture et performance",
    desc: "Des systèmes structurés, testables et conçus pour évoluer sans complexité superflue.",
  },
];

const FACTS = [
  { label: "FOCUS", value: "Conception et développement de produits" },
  {
    label: "SECTEURS",
    value: "Immobilier · Fintech · SaaS · Agritech · Edtech · Proptech · Restauration…",
  },
  { label: "EXPÉRIENCE", value: "4+ ans" },
  { label: "DISPONIBLE POUR", value: "Missions freelance et postes à temps plein" },
];

const CV_FILE_PATH = "/resumen/fawase_dohou.pdf";
const CV_DOWNLOAD_NAME = "CV_DOHOU_Fawase.pdf";

export default function About() {
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
  };

  return (
    <section className="w-full bg-white text-black" id="about">
      <div data-reveal="drift" className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* eyebrow */}
        <div className="mb-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            01
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            À PROPOS
          </span>
        </div>

        {/* headline */}
        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Des produits qui commencent par une question
        </h2>
        <p className="mt-1 max-w-4xl font-serif text-[2.4rem] italic leading-[1.1] text-orange-600 sm:text-5xl">
          et se terminent en production.
        </p>

        {/* content grid */}
        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.85fr]">
          {/* ---------------- LEFT: bio + facts ---------------- */}
          <div>
            <div className="space-y-6 text-[15px] leading-relaxed text-black/65">
              <p>
                Je m&apos;appelle DOHOU GBENOUPKO FAWASE, connu en ligne sous le nom de{" "}
                <span className="font-bold text-black">OMO IYA ONIRICE</span>. Je
                travaille à la croisée du produit, du design et de l&apos;ingénierie
                logicielle : de la compréhension du besoin à la conception et au
                développement de la solution.
              </p>
              <p>
                Mon parcours m&apos;a amené à contribuer à la conception d&apos;identités
                visuelles et au développement de produits web et mobiles, notamment
                dans l&apos;immobilier, la fintech et le SaaS.
              </p>
              <p>
                Je peux intervenir sur une étape précise ou accompagner plusieurs
                phases du produit, de la conception à la mise en production.
                Parlons de votre besoin et du cadre de la mission.
              </p>
            </div>

            {/* Téléchargement CV CTA */}
            <div className="mt-8">
              <a
                href={CV_FILE_PATH}
                onClick={handleDownloadCV}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[12px] font-bold tracking-widest text-white transition hover:bg-black/85"
              >
                TÉLÉCHARGER MON CV <span>↓</span>
              </a>
            </div>

            {/* facts table */}
            <div className="mt-10 grid grid-cols-2 border border-black/10">
              {FACTS.map((fact, i) => (
                <div
                  key={fact.label}
                  className={[
                    "px-6 py-5",
                    i % 2 === 0 ? "border-r border-black/10" : "",
                    i < 2 ? "border-b border-black/10" : "",
                  ].join(" ")}
                >
                  <div className="text-[10px] font-semibold tracking-widest text-black/40">
                    {fact.label}
                  </div>
                  <div className="mt-2 text-[15px] font-bold text-black">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- RIGHT: services ---------------- */}
          <div>
            <div className="mb-4 text-[11px] font-semibold tracking-widest text-black/40">
              CE QUE JE FAIS
            </div>
            <div className="space-y-4">
              {SERVICES.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-black/10 bg-black/1.5 p-6 transition hover:border-black/20"
                >
                  <div className="text-[11px] font-bold text-orange-600">
                    {s.n}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-black">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/55">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}