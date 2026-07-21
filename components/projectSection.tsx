"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  stack: string[] | string | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  order: number;
  views?: number; // 👈 Champ pour le nombre de vues
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

  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
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

  // Handler pour incrémenter le nombre de vues au clic
  const handleProjectClick = async (projectId: string) => {
    const supabase = createClient();

    // 1. Mise à jour instantanée du state local (UI réactive)
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, views: (p.views ?? 0) + 1 } : p
      )
    );

    // 2. Appel de la procédure stockée dans Supabase
    try {
      const { error } = await supabase.rpc("increment_project_views", {
        project_id: projectId,
      });

      if (error) console.error("Erreur increment_project_views:", error);
    } catch (err) {
      console.error("Erreur lors de la mise à jour des vues:", err);
    }
  };

  const parseTechStack = (stack: string[] | string | null): string[] => {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;
    if (typeof stack === "string") {
      try {
        const parsed = JSON.parse(stack);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return stack.split(",").map((s) => s.trim());
      }
    }
    return [];
  };

  return (
    <section className="w-full bg-white text-black" id="projects">
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

        {/* ÉTAT : chargement */}
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

        {/* ÉTAT : aucun projet en base */}
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

        {/* ÉTAT : projets chargés */}
        {!loading && projects.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((p) => {
              const tags = parseTechStack(p.stack);

              return (
                <a
                  key={p.id}
                  href={p.project_url || p.github_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleProjectClick(p.id)} // 👈 Incrémentation au clic
                  className="group overflow-hidden rounded-2xl border border-black/10 bg-black/1.5 transition hover:border-black/20"
                >
                  {/* aperçu */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <ProjectPreview project={p} />
                    
                    {/* Badges : VEDETTE à gauche, VUES à droite */}
                    <div className="absolute inset-x-3 top-3 flex items-center justify-between pointer-events-none">
                      <div>
                        {p.featured && (
                          <span className="rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold tracking-widest text-white backdrop-blur-sm">
                            EN VEDETTE
                          </span>
                        )}
                      </div>

                      {/* Badges de vues */}
                      {/* <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <Eye className="h-3.5 w-3.5 text-orange-400" />
                        {p.views ?? 0}
                      </span> */}
                    </div>
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

                    {/* Rendu dynamique du tech stack */}
                    {tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <span
                            key={`${tag}-${idx}`}
                            className="rounded-full border border-black/12 px-3 py-1 text-[11px] font-semibold tracking-wide text-black/70 bg-black/3"
                          >
                            {tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* pied de page */}
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