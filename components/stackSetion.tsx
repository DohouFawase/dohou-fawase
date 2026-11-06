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
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function fetchSkills() {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("order", { ascending: true });

        if (error) throw error;
        setSkills(data ?? []);
      } catch (error) {
        console.error("Erreur chargement compétences:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [retryCount]);

  return (
    <section className="w-full bg-white text-black" id="stack">
      <div data-reveal className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* surtitre */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            05
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            COMPÉTENCES
          </span>
        </div>

        {/* titre principal */}
        <h2 className="max-w-3xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Les compétences mobilisées{" "}
          <span className="font-serif italic text-orange-600">
            selon les besoins du produit.
          </span>
        </h2>

        {/* introduction */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Cette sélection reflète les outils et pratiques que j’utilise. Le choix
          des technologies dépend du contexte, des contraintes et des objectifs du projet.
        </p>

        {/* --- ÉTAT : chargement --- */}
        {loading && (
          <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-black/10 bg-black/3"
              />
            ))}
          </div>
        )}

        {/* --- ÉTAT : aucune compétence en base --- */}
        {!loading && !loadError && skills.length === 0 && (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/1.5 px-6 py-20 text-center">
            <h3 className="text-lg font-bold text-black">
              Aucune compétence n’est publiée dans cette section pour le moment
            </h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-black/50">
              Vous pouvez me contacter pour échanger sur les technologies et
              pratiques adaptées à votre projet.
            </p>
          </div>
        )}

        {!loading && loadError && (
          <div className="mt-14 rounded-2xl border border-orange-900/10 bg-orange-50/60 px-6 py-10 text-center">
            <h3 className="text-lg font-bold text-black">
              Les compétences ne sont pas disponibles pour le moment
            </h3>
            <p className="mt-2 text-sm text-black/55">
              Un problème a empêché leur chargement. Réessayez dans un instant.
            </p>
            <button
              type="button"
              onClick={() => {
                setLoadError(false);
                setLoading(true);
                setRetryCount((count) => count + 1);
              }}
              className="mt-5 rounded-full border border-black/15 px-5 py-2.5 text-xs font-semibold text-black transition hover:border-orange-600 hover:text-orange-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* --- ÉTAT : compétences chargées --- */}
        {!loading && !loadError && skills.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, i) => (
              <div
                key={group.id}
                data-reveal="card"
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