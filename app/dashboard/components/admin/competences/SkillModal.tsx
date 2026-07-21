"use client";

import { useState } from "react";
import { X, Wrench, Edit2, Loader2 } from "lucide-react";
import { updateSkillAction, createSkillAction } from "@/app/dashboard/skills/actions";

export interface Skill {
  id: string;
  category: string;
  items: string[];
  order?: number;
}

interface SkillModalProps {
  skillToEdit?: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SkillModal({ skillToEdit, isOpen, onClose }: SkillModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(skillToEdit);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing && skillToEdit) {
        await updateSkillAction(skillToEdit.id, formData);
      } else {
        await createSkillAction(formData);
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
      <div className="bg-white border border-black/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-black">
              {isEditing ? "Modifier la catégorie" : "Ajouter une catégorie de compétences"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nom de la catégorie */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Catégorie *</label>
            <input
              type="text"
              name="category"
              required
              defaultValue={skillToEdit?.category || ""}
              placeholder="ex: Frontend, Backend, Tools & DevOps"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Liste des compétences */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Compétences / Technologies (séparées par des virgules) *
            </label>
            <textarea
              name="items"
              required
              rows={4}
              defaultValue={skillToEdit?.items ? skillToEdit.items.join(", ") : ""}
              placeholder="React, Next.js, Tailwind CSS, TypeScript"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Ordre d'affichage */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Ordre d&apos;affichage</label>
            <input
              type="number"
              name="order"
              defaultValue={skillToEdit?.order || 0}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
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