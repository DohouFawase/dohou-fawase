"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // adapte le chemin à ton projet

type Skill = {
  id: string;
  category: string;
  items: string[];
  order: number;
};

export default function Stack() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchSkills() {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.error("Erreur chargement compétences:", error);
      } else {
        setSkills(data ?? []);
      }
      setLoading(false);
    }

    fetchSkills();
  }, []);

  return (
    <section className="w-full bg-white text-black" id="stack">
      <div className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* surtitre */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            04
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            COMPÉTENCES
          </span>
        </div>

        {/* titre principal */}
        <h2 className="max-w-3xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Les outils que j&lsquo;utilise{" "}
          <span className="font-serif italic text-orange-600">
            au quotidien pour résoudre vos défis.
          </span>
        </h2>

        {/* introduction */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Les technologies évoluent, l&apos;essentiel reste l&apos;impact. J&apos;adapte toujours ma stack
          technologique aux besoins réels du produit, et non l&apos;inverse.
        </p>

        {/* --- ÉTAT : chargement --- */}
        {loading && (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-black/10 bg-black/3"
              />
            ))}
          </div>
        )}

        {/* --- ÉTAT : aucune compétence en base --- */}
        {!loading && skills.length === 0 && (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/1.5 px-6 py-20 text-center">
            <h3 className="text-lg font-bold text-black">
              Compétences en cours de mise à jour
            </h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-black/50">
              Cette section sera bientôt complétée avec l&apos;ensemble de ma
              stack technique.
            </p>
          </div>
        )}

        {/* --- ÉTAT : compétences chargées --- */}
        {!loading && skills.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, i) => (
              <div
                key={group.id}
                className="rounded-2xl border border-black/10 bg-black/1.5 p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-black">
                    {group.category}
                  </h3>
                  <span className="text-[12px] font-bold text-orange-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-black/12 px-3.5 py-1.5 text-[13px] text-black/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}