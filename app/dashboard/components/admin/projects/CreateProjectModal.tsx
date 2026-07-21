"use client";

import { useState, useEffect } from "react";
import { Plus, X, FolderPlus, Edit2, Loader2 } from "lucide-react";
import { createProjectAction, updateProjectAction } from "@/app/dashboard/projects/actions";

export interface Project {
  id: string;
  title: string;
  description?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-black/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-black">
              {isEditing ? "Modifier le projet" : "Ajouter un projet"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-black">
          {/* Titre */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Titre du projet *</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={projectToEdit?.title || ""}
              placeholder="ex: KuraScouting"
              className="w-full px-3 py-2 border tex border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={projectToEdit?.description || ""}
              placeholder="Brève description du projet..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Stack Technologique */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Technologies (séparées par des virgules)</label>
            <input
              type="text"
              name="stack"
              defaultValue={projectToEdit?.stack ? projectToEdit.stack.join(", ") : ""}
              placeholder="React, Next.js, Laravel, Tailwind CSS"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">URL de l&apos;image</label>
              <input
                type="url"
                name="image_url"
                defaultValue={projectToEdit?.image_url || ""}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Lien Démo (Live URL)</label>
              <input
                type="url"
                name="project_url"
                defaultValue={projectToEdit?.project_url || ""}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* GitHub URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Lien GitHub</label>
            <input
              type="url"
              name="github_url"
              defaultValue={projectToEdit?.github_url || ""}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Featured Switch */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={projectToEdit?.featured || false}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-gray-700">
              Mettre en avant sur la page d&lsquo;accueil (Featured)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
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