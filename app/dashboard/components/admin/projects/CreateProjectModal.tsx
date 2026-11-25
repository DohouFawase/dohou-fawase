"use client";

import { useState } from "react";
import { X, FolderPlus, Edit2, Loader2 } from "lucide-react";
import { createProjectAction, updateProjectAction } from "@/app/dashboard/projects/actions";

export interface Project {
  id: string;
  title: string;
  title_en?: string | null;
  description?: string;
  description_en?: string | null;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  stack?: string[];
  featured?: boolean;
  views?: number;
}

interface ProjectModalProps {
  projectToEdit?: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ projectToEdit, isOpen, onClose }: ProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(projectToEdit);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing && projectToEdit) {
        await updateProjectAction(projectToEdit.id, formData);
      } else {
        await createProjectAction(formData);
      }
      onClose();
    } catch (err) {
      alert("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="project-modal-title" className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-stone-50/70 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-2.5 text-orange-700">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-700">Portfolio</p>
              <h2 id="project-modal-title" className="mt-0.5 text-lg font-semibold tracking-tight text-[#171717]">
                {isEditing ? "Modifier le projet" : "Ajouter un projet"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-xl p-2 text-neutral-400 transition hover:bg-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto p-6 text-[#171717] sm:p-7">
          {/* Titre */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Titre du projet <span className="text-orange-600">*</span></label>
            <input
              type="text"
              name="title"
              required
              defaultValue={projectToEdit?.title || ""}
              placeholder="ex: KuraScouting"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Project title (English)</label>
            <input type="text" name="title_en" defaultValue={projectToEdit?.title_en || ""} placeholder="English title (optional)" className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={projectToEdit?.description || ""}
              placeholder="Brève description du projet..."
              className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Description (English)</label>
            <textarea name="description_en" rows={3} defaultValue={projectToEdit?.description_en || ""} placeholder="English project description (optional)" className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
          </div>

          {/* Stack Technologique */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Technologies <span className="font-normal text-neutral-400">(séparées par des virgules)</span></label>
            <input
              type="text"
              name="stack"
              defaultValue={projectToEdit?.stack ? projectToEdit.stack.join(", ") : ""}
              placeholder="React, Next.js, Laravel, Tailwind CSS"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">URL de l&apos;image</label>
              <input
                type="url"
                name="image_url"
                defaultValue={projectToEdit?.image_url || ""}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Lien de démonstration</label>
              <input
                type="url"
                name="project_url"
                defaultValue={projectToEdit?.project_url || ""}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Lien GitHub</label>
            <input
              type="url"
              name="github_url"
              defaultValue={projectToEdit?.github_url || ""}
              placeholder="https://github.com/..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Featured Switch */}
          <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={projectToEdit?.featured || false}
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
              Mettre en avant sur la page d’accueil
              <span className="mt-0.5 block text-xs font-normal text-neutral-500">Le projet sera mis en évidence dans ton portfolio.</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-col-reverse gap-2 border-t border-black/[0.06] bg-white/95 p-5 backdrop-blur sm:-mx-7 sm:-mb-7 sm:flex-row sm:justify-end sm:gap-3 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{isEditing ? "Mettre à jour" : "Enregistrer"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
