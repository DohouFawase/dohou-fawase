"use client";

const SERVICES = [
  {
    n: "01",
    title: "Design de Produit",
    desc: "Des wireframes aux interfaces soignées et hautement convertissantes, conçues pour transformer vos visiteurs en clients payants.",
  },
  {
    n: "02",
    title: "Développement Web & Mobile",
    desc: "Des front-ends rapides et accessibles combinés à des back-ends robustes en React, Next.js, Laravel, Nest.js et Mysql, taillés pour vendre et évoluer.",
  },
  {
    n: "03",
    title: "Branding & Identité",
    desc: "Des systèmes visuels qui rendent votre produit fiable et haut de gamme, pour que vos clients achètent en toute confiance.",
  },
  {
    n: "04",
    title: "Architectures Évolutives",
    desc: "Une infrastructure technique qui reste rapide et stable à mesure que votre trafic, vos revenus et vos équipes grandissent.",
  },
];

const FACTS = [
  { label: "FOCUS", value: "Résolution de problèmes & croissance" },
  { label: "PRODUITS LIVRÉS", value: "34+" },
  { label: "EXPÉRIENCE", value: "4+ ans" },
  { label: "DISPONIBLE POUR", value: "Freelance & Temps plein" },
];

export default function About() {
  return (
    <section className="w-full bg-white text-black" id="about">
      <div className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
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
                résous des problèmes business grâce au code. Je me situe à
                l&apos;intersection du produit, du design et de l&apos;ingénierie : le genre
                de profil capable de maquetter un flux le matin et de déployer
                l&apos;API le soir même.
              </p>
              <p>
                En plus de 4 ans, j&apos;ai conçu des marques et livré plus de 8 produits
                web et mobiles pour des startups dans l&apos;immobilier, la fintech
                et le SaaS. Je ne me contente pas de faire du joli ; je construis
                des produits qui attirent les utilisateurs, les fidélisent et transforment
                l&apos;attention en chiffre d&apos;affaires.
              </p>
              <p>
                Si vous cherchez quelqu&apos;un capable de piloter l&apos;ensemble du cycle
                de vie d&apos;un produit, de l&apos;identité visuelle à l&apos;architecture technique,
                tout en ayant les yeux rivés sur votre rentabilité, discutons-en.
              </p>
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