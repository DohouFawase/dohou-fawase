"use client";

import Image from "next/image";

const STEPS = [
  {
    n: "01",
    title: "Comprendre le problème",
    desc: "Avant d'écrire une seule ligne de code, j'analyse vos utilisateurs, vos objectifs et vos chiffres. Les meilleurs produits commencent par la bonne question, pas par la fonctionnalité la plus tape-à-l'œil.",
  },
  {
    n: "02",
    title: "Concevoir & bâtir la solution",
    desc: "Je conçois des interfaces épurées et à fort taux de conversion, adossées à des systèmes évolutifs, pour que le produit ait un rendu premium et tienne la charge durant votre croissance.",
  },
  {
    n: "03",
    title: "Déployer, mesurer, rentabiliser",
    desc: "Je livre rapidement, j'observe le comportement des utilisateurs réels et j'itère sur ce qui fait bouger les indicateurs clés : inscriptions, rétention et chiffre d'affaires.",
  },
];

const PHOTO_URL =
  "/images/seconde.jpeg";

export default function HowIWork() {
  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* eyebrow */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            03
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            MA MÉTHODE
          </span>
        </div>

        {/* headline */}
        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Pas seulement du code,{" "}
          <span className="font-serif italic text-orange-600">
            des résultats mesurables.
          </span>
        </h2>

        {/* intro */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Je m&apos;intéresse à l&apos;aspect business derrière le produit. Chaque décision est
          pesée face à une seule question : cela vous aidera-t-il à générer ou à économiser
          de l&apos;argent ?
        </p>

        {/* content grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ---------------- LEFT: photo ---------------- */}
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-black/10">
            <Image
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={PHOTO_URL}
              alt="En plein développement"
              className="object-cover"
            />

            {/* bottom-left tag */}
            <div className="absolute bottom-5 left-5 text-[11px] font-semibold tracking-widest text-white/80">
              EN PRODUCTION
            </div>

            {/* bottom-right badge */}
            <div className="absolute bottom-5 right-5 rounded-full bg-orange-600 px-4 py-1.5 text-[11px] font-bold text-white">
              COTONOU, BJ
            </div>
          </div>

          {/* ---------------- RIGHT: steps ---------------- */}
          <div className="space-y-5">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-black/10 bg-black/1.5 p-7"
              >
                <div className="flex items-start gap-6">
                  <div className="text-3xl font-extrabold text-orange-600">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-black/60">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}