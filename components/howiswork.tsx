"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageProvider";

const STEPS = [
  {
    n: "01",
    title: "Clarifier le besoin",
    desc: "Nous posons le contexte, les objectifs, les contraintes et les besoins des utilisateurs. Cette étape permet de définir un périmètre utile et des priorités réalistes.",
  },
  {
    n: "02",
    title: "Concevoir et construire",
    desc: "Je transforme les priorités en parcours et en interfaces, puis je développe une solution accessible, maintenable et adaptée au contexte technique.",
  },
  {
    n: "03",
    title: "Livrer et améliorer",
    desc: "Après la mise en production, nous vérifions le fonctionnement, recueillons les retours disponibles et identifions les améliorations à apporter.",
  },
];

const PHOTO_URL =
  "/images/seconde.jpeg";

export default function HowIWork() {
  const { language } = useLanguage();
  const en = language === "en";
  const steps = en
    ? [
        { n: "01", title: "Clarify the need", desc: "We define the context, goals, constraints, and user needs to set useful priorities and a realistic scope." },
        { n: "02", title: "Design and build", desc: "I turn priorities into user journeys and interfaces, then build an accessible, maintainable solution suited to the technical context." },
        { n: "03", title: "Launch and improve", desc: "After launch, we check how things work, gather feedback, and identify improvements." },
      ]
    : STEPS;
  return (
    <section id="method" className="w-full bg-white text-black">
      <div data-reveal className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* eyebrow */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            03
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            {en ? "MY APPROACH" : "MA MÉTHODE"}
          </span>
        </div>

        {/* headline */}
        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          {en ? "From our first conversation to launch, " : "Du premier échange à la mise en production, "}{" "}
          <span className="font-serif italic text-orange-600">
            {en ? "a clear process." : "une démarche claire."}
          </span>
        </h2>

        {/* intro */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          {en ? "Every project starts with a concrete need. We move forward in clear steps, with explained decisions and regular check-ins." : "Chaque projet commence par un besoin concret. Nous avançons par étapes, avec des décisions expliquées et des points de validation réguliers."}
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
              alt="Fawase devant son ordinateur portable"
              className="object-cover"
            />

            {/* bottom-left tag */}
            <div className="absolute bottom-5 left-5 text-[11px] font-semibold tracking-widest text-white/80">
              {en ? "DESIGN · DEVELOPMENT" : "CONCEPTION · DÉVELOPPEMENT"}
            </div>

            {/* bottom-right badge */}
            <div className="absolute bottom-5 right-5 rounded-full bg-orange-600 px-4 py-1.5 text-[11px] font-bold text-white">
              COTONOU, BJ
            </div>
          </div>

          {/* ---------------- RIGHT: steps ---------------- */}
          <div data-reveal-stagger className="space-y-5">
            {steps.map((step) => (
              <div
                key={step.n}
                data-reveal
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
