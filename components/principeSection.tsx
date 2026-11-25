"use client";
import { useLanguage } from "@/context/LanguageProvider";

const PRINCIPLES = [
  {
    n: "01",
    title: "Le ressenti est une fonctionnalité.",
    desc: "La latence, le mouvement, la fluidité et le rythme font partie du produit. Une interface qui manque de clarté ou de fluidité peut nuire à l’expérience, même si ses fonctionnalités sont présentes.",
  },
  {
    n: "02",
    title: "Livrer petit, livrer souvent.",
    desc: "Je privilégie des livraisons par étapes, suivies de retours et d’améliorations ciblées. Cela permet de faire évoluer le produit sans attendre une refonte complète.",
  },
  {
    n: "03",
    title: "Partager les décisions.",
    desc: "Une documentation utile, des commits explicites et des décisions partagées facilitent la reprise du projet et le travail en équipe.",
  },
  {
    n: "04",
    title: "Technos éprouvées, goût affûté.",
    desc: "Je privilégie des outils adaptés et éprouvés, comme Laravel, Next.js et TypeScript, en gardant la solution aussi simple que le projet le permet.",
  },
];

export default function Principles() {
  const { language } = useLanguage();
  const en = language === "en";
  const principles = en ? [
    { n: "01", title: "Feel is a feature.", desc: "Latency, motion, fluidity, and rhythm are part of the product. An unclear or sluggish interface can hurt the experience, even when all its features are there." },
    { n: "02", title: "Ship small, ship often.", desc: "I favor staged releases followed by feedback and focused improvements. This helps a product evolve without waiting for a full redesign." },
    { n: "03", title: "Share decisions.", desc: "Useful documentation, clear commits, and shared decisions make projects easier to maintain and help teams work together." },
    { n: "04", title: "Proven tools, thoughtful craft.", desc: "I choose dependable tools suited to the work, such as Laravel, Next.js, and TypeScript, while keeping solutions as simple as possible." },
  ] : PRINCIPLES;
  return (
    <section id="principles" className="w-full bg-white text-black">
      <div data-reveal className="mx-auto container  px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* surtitre */}
        <div className="mb-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            06
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            {en ? "PRINCIPLES" : "PRINCIPES"}
          </span>
        </div>

        {/* titre principal */}
        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          {en ? "The ideas that guide my work " : "Les idées qui guident mon travail "}{" "}
          <span className="font-serif italic text-orange-600">{en ? "every day." : "au quotidien."}</span>
        </h2>

        {/* grille de principes */}
        <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.n}
              data-reveal="card"
              className="rounded-2xl border border-black/10 bg-black/1.5 p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-orange-600">
                  {p.n}
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-black/35">
                  {en ? "PRINCIPLE" : "PRINCIPE"}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-black">
                {p.title}
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-black/60">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
