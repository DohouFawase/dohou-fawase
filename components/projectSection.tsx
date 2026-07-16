"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // adapte le chemin à ton projet

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech_stack: string[] | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  order: number;
};

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/10 bg-black/3 px-3 py-2">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
      </div>
      <div className="ml-2 flex-1 truncate rounded-md bg-black/4 px-3 py-1 text-[11px] text-black/40">
        {url}
      </div>
    </div>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  if (project.image_url) {
    return (
      <div className="flex h-full flex-col">
        {project.project_url && (
          <BrowserChrome url={project.project_url.replace(/^https?:\/\//, "")} />
        )}
        <div
          className="flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image_url})` }}
        />
      </div>
    );
  }

  // Placeholder générique si aucune image n'est encore renseignée
  return (
    <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
      <span className="text-[11px] font-semibold tracking-widest text-black/25">
        APERÇU À VENIR
      </span>
    </div>
  );
}

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.error("Erreur chargement projets:", error);
      } else {
        setProjects(data ?? []);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto container border-t border-black/10 px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* surtitre */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            05
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            PROJETS SÉLECTIONNÉS
          </span>
        </div>

        {/* titre principal */}
        <h2 className="max-w-3xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Quelques réalisations{" "}
          <span className="font-serif italic text-orange-600">
            le reste est sous accord de confidentialité (NDA).
          </span>
        </h2>

        {/* introduction */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Un aperçu de mes produits, outils et expérimentations. Chaque carte
          mène vers le projet en ligne.
        </p>

        {/* --- ÉTAT : chargement --- */}
        {loading && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl border border-black/10 bg-black/3"
              />
            ))}
          </div>
        )}

        {/* --- ÉTAT : aucun projet en base --- */}
        {!loading && projects.length === 0 && (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/1.5 px-6 py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/10 text-orange-600">
              <Sparkles className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-black">
              Les projets arrivent bientôt
            </h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-black/50">
              Cette section est en cours de construction. Repassez très vite
              pour découvrir mes dernières réalisations.
            </p>
          </div>
        )}

        {/* --- ÉTAT : projets chargés --- */}
        {!loading && projects.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <a
                key={p.id}
                href={p.project_url || p.github_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl border border-black/10 bg-black/1.5 transition hover:border-black/20"
              >
                {/* aperçu */}
                <div className="relative h-52 w-full overflow-hidden">
                  <ProjectPreview project={p} />
                  {p.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold tracking-widest text-white backdrop-blur-sm">
                      EN VEDETTE
                    </span>
                  )}
                </div>

                {/* contenu */}
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-black">{p.title}</h3>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-black/40 transition group-hover:text-orange-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  {p.description && (
                    <p className="mt-3 text-[14px] leading-relaxed text-black/60">
                      {p.description}
                    </p>
                  )}
                  {p.tech_stack && p.tech_stack.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tech_stack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/12 px-3 py-1 text-[11px] tracking-wide text-black/60"
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* pied de page de la section */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[11px] font-semibold tracking-widest text-black/40">
            MES PROJETS CLIENTS LES PLUS RÉCENTS SONT SOUS NDA.
          </p>
          <a
            href="https://github.com/DohouFawase"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold tracking-widest text-black underline underline-offset-4"
          >
            VOIR PLUS SUR GITHUB →
          </a>
        </div>
      </div>
    </section>
  );
}