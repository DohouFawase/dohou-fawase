"use client";

import { useState } from "react";
import { Plus, ExternalLink, Eye, Trash2, Edit2, Star } from "lucide-react";
import { Project, ProjectModal } from "./CreateProjectModal";
import { deleteProjectAction } from "@/app/dashboard/projects/actions";
            
interface ProjectsTableClientProps {
  initialProjects: Project[];
}
const GithubIcon = ({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function ProjectsTableClient({ initialProjects }: ProjectsTableClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    
  const handleOpenCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Es-tu sûr de vouloir supprimer le projet "${title}" ?`)) {
      await deleteProjectAction(id);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header avec Bouton Ajouter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Gestion du portfolio</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">Projets</h1>
          <p className="mt-2 text-sm text-neutral-500">Gère et modifie les projets de ton portfolio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Tableau CRUD */}
      <section aria-label="Liste des projets" className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm">
        {initialProjects && initialProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th scope="col" className="px-5 py-4 text-[10px]">Projet</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Technologies</th>
                  <th scope="col" className="px-5 py-4 text-center text-[10px]">Vues</th>
                  <th scope="col" className="px-5 py-4 text-center text-[10px]">Mise en avant</th>
                  <th scope="col" className="px-5 py-4 text-right text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {initialProjects.map((project) => (
                  <tr key={project.id} className="transition-colors hover:bg-orange-50/30">
                    {/* Infos projet */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="h-12 w-12 shrink-0 rounded-xl border border-black/[0.06] object-cover"
                          />
                        ) : (
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-orange-100 bg-orange-50 font-bold text-orange-700">
                            {project.title.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[#171717]">{project.title}</p>
                          <p className="mt-1 line-clamp-1 max-w-xs text-xs text-neutral-500">{project.description || "Aucune description"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Stack */}
                    <td className="px-5 py-4">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {project.stack && project.stack.length > 0 ? (
                          project.stack.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="rounded-lg border border-black/[0.05] bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-400">Aucune</span>
                        )}
                      </div>
                    </td>

                    {/* Vues */}
                    <td className="px-5 py-4 text-center font-semibold text-[#171717]">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-2.5 py-1.5">
                        <Eye className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{project.views || 0}</span>
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4 text-center">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                          <Star className="h-3 w-3 fill-orange-500" />
                          <span>Oui</span>
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">Non</span>
                      )}
                    </td>

                    {/* Actions CRUD */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Liens externes */}
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-2 text-neutral-400 transition hover:bg-stone-100 hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            title="Démo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-2 text-neutral-400 transition hover:bg-stone-100 hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            title="GitHub"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}

                        {/* Éditer (Update) */}
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="rounded-lg p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Supprimer (Delete) */}
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3 px-6 py-16 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Plus className="h-5 w-5" /></div>
            <p className="text-sm font-medium text-neutral-600">Aucun projet enregistré.</p>
            <p className="text-xs text-neutral-400">Ajoute un projet pour le faire apparaître dans ton portfolio.</p>
          </div>
        )}
      </section>

      {/* Modal Réutilisable */}
      <ProjectModal
        isOpen={isModalOpen}
        projectToEdit={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}