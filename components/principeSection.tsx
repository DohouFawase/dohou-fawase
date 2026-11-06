"use client";

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
  return (
    <section id="principles" className="w-full bg-white text-black">
      <div data-reveal className="mx-auto container  px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* surtitre */}
        <div className="mb-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            06
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            PRINCIPES
          </span>
        </div>

        {/* titre principal */}
        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Les idées qui guident mon travail{" "}
          <span className="font-serif italic text-orange-600">au quotidien.</span>
        </h2>

        {/* grille de principes */}
        <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
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
                  PRINCIPE
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