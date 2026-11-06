"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
type Experience = {
  id: string;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  contract_type: string | null;
  order: number;
};

const MONTHS_FR = [
  "JANV", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
  "JUILLET", "AOÛT", "SEPT", "OCT", "NOV", "DÉC",
];

function formatPeriod(start: string, end: string | null) {
  const s = new Date(start);
  const startLabel = `${MONTHS_FR[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
  if (!end) return `${startLabel} — PRÉSENT`;
  const e = new Date(end);
  const endLabel = `${MONTHS_FR[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
  return `${startLabel} — ${endLabel}`;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("order", { ascending: true });

        if (error) throw error;
        setExperiences(data ?? []);
      } catch (error) {
        console.error("Erreur chargement expériences:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, [retryCount]);

  return (
    <section className="w-full bg-white text-black" id="work">
      <div data-reveal className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        <div className="mb-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            02
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            EXPÉRIENCE
          </span>
        </div>

        <h2 className="max-w-5xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Des expériences variées{" "}
          <span className="font-serif italic text-orange-600">
            et une curiosité toujours active.
          </span>
        </h2>

        <div data-reveal-stagger className="mt-14 divide-y divide-black/10 border-y border-black/10">
          {loading && (
            <p className="py-8 text-sm text-black/40">Chargement…</p>
          )}

          {!loading && loadError && (
            <div className="py-8">
              <p className="text-sm text-black/55">
                Le parcours n’a pas pu être chargé. Réessayez dans un instant.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoadError(false);
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
                className="mt-4 rounded-full border border-black/15 px-5 py-2.5 text-xs font-semibold text-black transition hover:border-orange-600 hover:text-orange-700"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !loadError && experiences.length === 0 && (
            <p className="py-8 text-sm text-black/55">
              Aucune expérience n’est publiée dans cette section pour le moment.
            </p>
          )}

          {!loading && !loadError &&
            experiences.map((exp, i) => (
              <div
                key={exp.id}
                data-reveal
                className="grid grid-cols-1 items-start gap-4 py-8 sm:grid-cols-[60px_1fr_auto] sm:items-center sm:gap-8"
              >
                <div className="text-[12px] font-bold text-orange-600">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(220px,260px)_1fr] sm:gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-black sm:text-xl">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-[14px] text-black/45">
                      {exp.company}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="max-w-xl text-[15px] leading-relaxed text-black/60">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[12px] font-semibold tracking-widest text-black/50">
                    {formatPeriod(exp.start_date, exp.end_date)}
                  </div>
                  <div className="mt-1 text-[11px] tracking-widest text-black/35">
                    {exp.contract_type}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}