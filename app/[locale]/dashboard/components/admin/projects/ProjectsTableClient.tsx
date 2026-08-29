"use client";

import { useState } from "react";
import { Plus, ExternalLink, Eye, Trash2, Edit2, Star } from "lucide-react";
import { Project, ProjectModal , } from "./CreateProjectModal";
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
    <div className="space-y-6">
      {/* Header avec Bouton Ajouter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Projets</h1>
          <p className="text-xs text-gray-500 mt-1">Gère et modifie les projets de ton portfolio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Tableau CRUD */}
      <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
        {initialProjects && initialProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Projet</th>
                  <th className="py-3.5 px-4">Stack</th>
                  <th className="py-3.5 px-4 text-center">Vues</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Infos projet */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 text-gray-400 font-bold">
                            {project.title.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-black text-sm">{project.title}</p>
                          <p className="text-gray-400 line-clamp-1 max-w-xs">{project.description || "Aucune description"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Stack */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.stack && project.stack.length > 0 ? (
                          project.stack.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 font-semibold rounded-md text-[10px]"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">Aucune</span>
                        )}
                      </div>
                    </td>

                    {/* Vues */}
                    <td className="py-4 px-4 text-center font-bold text-black">
                      <div className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-md">
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                        <span>{project.views || 0}</span>
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-4 text-center">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md font-bold">
                          <Star className="w-3 h-3 fill-orange-500" />
                          <span>Oui</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">Non</span>
                      )}
                    </td>

                    {/* Actions CRUD */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Liens externes */}
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
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
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            title="GitHub"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}

                        {/* Éditer (Update) */}
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Supprimer (Delete) */}
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="p-12 text-center space-y-3">
            <p className="text-gray-400 text-sm italic">Aucun projet enregistré.</p>
          </div>
        )}
      </div>

      {/* Modal Réutilisable */}
      <ProjectModal
        isOpen={isModalOpen}
        projectToEdit={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}