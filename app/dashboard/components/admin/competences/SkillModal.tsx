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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="skill-modal-title" className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-stone-50/70 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-2.5 text-orange-700">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-700">Portfolio</p>
              <h2 id="skill-modal-title" className="mt-0.5 text-lg font-semibold tracking-tight text-[#171717]">
                {isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}
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
        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto p-6 sm:p-7">
          {/* Nom de la catégorie */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Catégorie <span className="text-orange-600">*</span></label>
            <input
              type="text"
              name="category"
              required
              defaultValue={skillToEdit?.category || ""}
              placeholder="ex: Frontend, Backend, Tools & DevOps"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Liste des compétences */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">
              Compétences / technologies <span className="font-normal text-neutral-400">(séparées par des virgules)</span> <span className="text-orange-600">*</span>
            </label>
            <textarea
              name="items"
              required
              rows={4}
              defaultValue={skillToEdit?.items ? skillToEdit.items.join(", ") : ""}
              placeholder="React, Next.js, Tailwind CSS, TypeScript"
              className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Ordre d'affichage */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Ordre d&apos;affichage</label>
            <input
              type="number"
              name="order"
              defaultValue={skillToEdit?.order || 0}
              placeholder="0"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
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