"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
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
    <div className="relative isolate flex h-full items-center overflow-hidden bg-[#171717] px-7 py-8 sm:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_28%,rgba(249,115,22,0.24),transparent_38%)]" />
      <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border border-orange-300/15" />
      <div className="pointer-events-none absolute right-6 top-8 -z-10 h-44 w-44 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-16 top-16 -z-10 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />
      <div className="max-w-[78%]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-orange-300">
          Produit numérique · Sélection
        </p>
        <p className="mt-4 font-serif text-2xl leading-tight tracking-tight text-white sm:text-3xl">
          {project.title}
        </p>
        <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.17em] text-white/40">
          Aperçu du projet
        </p>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-5 font-serif text-8xl italic leading-none text-white/[0.035] sm:text-9xl">
        F
      </span>
    </div>
  );
}

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("order", { ascending: true });

        if (error) throw error;
        setProjects(data ?? []);
      } catch (error) {
        console.error("Erreur chargement projets:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [retryCount]);

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
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];

  const handleSimilarProject = (project: Project) => {
    window.dispatchEvent(
      new CustomEvent("portfolio:contact-prefill", {
        detail: {
          subject: `Projet similaire à ${project.title}`,
          message: `Bonjour Fawase,\n\nJ’ai découvert ${project.title} dans votre portfolio et je souhaite discuter d’un projet similaire.\n\nMon besoin : `,
        },
      }),
    );
    window.location.hash = "contact";
  };

  return (
    <section className="w-full bg-white text-black" id="projects">
      <div data-reveal className="mx-auto container border-t border-black/10 px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        {/* surtitre */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            04
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            PROJETS SÉLECTIONNÉS
          </span>
        </div>

        {/* titre principal */}
        <h2 className="max-w-3xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Quelques réalisations à découvrir.{" "}
          <span className="font-serif italic text-orange-600">
            Certaines missions restent confidentielles.
          </span>
        </h2>

        {/* introduction */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Découvrez une sélection de produits et d’outils auxquels j’ai
          contribué. Les liens sont indiqués lorsqu’ils sont disponibles.
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

        {!loading && loadError && (
          <div className="mt-14 rounded-2xl border border-orange-900/10 bg-orange-50/60 px-6 py-10 text-center">
            <h3 className="text-lg font-bold text-black">
              Les projets ne sont pas disponibles pour le moment
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black/55">
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

        {/* ÉTAT : aucun projet en base */}
        {!loading && !loadError && projects.length === 0 && (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/1.5 px-6 py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/10 text-orange-600">
              <Sparkles className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-black">
              Aucun projet n’est publié dans cette section pour le moment
            </h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-black/50">
              Écrivez-moi si vous souhaitez en savoir plus sur mon travail ou
              discuter d’un projet similaire.
            </p>
          </div>
        )}

        {/* ÉTAT : projets chargés */}
        {!loading && !loadError && projects.length > 0 && (
          <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
            {projects.map((project, index) => {
              const tags = parseTechStack(project.stack);
              const isFeatured = project.id === featuredProject?.id;
              const isWide = index % 4 === 0 || index % 4 === 3;

              return (
                <article
                  key={project.id}
                  data-reveal="card"
                  className={`group overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-600/35 hover:shadow-xl hover:shadow-black/10 ${
                    isWide ? "md:col-span-7" : "md:col-span-5"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-[#171717] ${
                      isWide ? "h-72 sm:h-80" : "h-64 sm:h-72"
                    }`}
                  >
                    <div className="h-full transition duration-700 ease-out group-hover:scale-[1.035]">
                      <ProjectPreview project={project} />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                    <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white/90 backdrop-blur">
                        PROJET {String(index + 1).padStart(2, "0")}
                      </span>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-orange-950/20">
                          <Sparkles className="h-3 w-3" />
                          À la une
                        </span>
                      )}
                    </div>
                    <div className="pointer-events-none absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                        {isFeatured ? "Projet mis en lumière" : "Sélection portfolio"}
                      </p>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 text-white transition group-hover:border-orange-300 group-hover:bg-orange-500">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-orange-700/70">
                          {isFeatured ? "Projet mis en lumière" : "Réalisation"}
                        </p>
                        <h3 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                          {project.title}
                        </h3>
                      </div>
                      <span className="shrink-0 pt-1 text-[11px] font-medium tabular-nums text-black/35">
                        {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                      </span>
                    </div>
                    {project.description && (
                      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-black/60">
                        {project.description}
                      </p>
                    )}

                    {tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {tags.slice(0, 5).map((tag, tagIndex) => (
                          <span
                            key={`${tag}-${tagIndex}`}
                            className="rounded-full border border-black/10 bg-[#f7f6f3] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-black/65"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/8 pt-5">
                      {(project.project_url || project.github_url) && (
                        <a
                          href={project.project_url || project.github_url || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleProjectClick(project.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-orange-600"
                        >
                          Découvrir le projet <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSimilarProject(project)}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-[11px] font-semibold text-black/60 transition hover:text-orange-700"
                      >
                        Un projet similaire <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* pied de page */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[11px] font-semibold tracking-widest text-black/40">
            Certaines missions sont confidentielles ; les projets présentés ici sont partageables.
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