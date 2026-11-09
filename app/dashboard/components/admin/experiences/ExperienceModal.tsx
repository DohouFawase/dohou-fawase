"use client";

import { useState } from "react";
import { X, Briefcase, Edit2, Loader2 } from "lucide-react";
import { createExperienceAction, updateExperienceAction } from "@/app/dashboard/experiences/actions";

export interface Experience {
  id: string;
  company: string;
  role: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  contract_type?: string;
  logo_url?: string;
  order?: number;
}

interface ExperienceModalProps {
  experienceToEdit?: Experience | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExperienceModal({
  experienceToEdit,
  isOpen,
  onClose,
}: ExperienceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrentRole, setIsCurrentRole] = useState(
    experienceToEdit ? !experienceToEdit.end_date : false
  );

  const isEditing = Boolean(experienceToEdit);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    if (isCurrentRole) {
      formData.delete("end_date");
    }

    try {
      if (isEditing && experienceToEdit) {
        await updateExperienceAction(experienceToEdit.id, formData);
      } else {
        await createExperienceAction(formData);
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
      <div role="dialog" aria-modal="true" aria-labelledby="experience-modal-title" className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-stone-50/70 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-2.5 text-orange-700">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-700">Portfolio</p>
              <h2 id="experience-modal-title" className="mt-0.5 text-lg font-semibold tracking-tight text-[#171717]">
                {isEditing ? "Modifier l'expérience" : "Ajouter une expérience"}
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
          {/* Entreprise & Poste */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Entreprise <span className="text-orange-600">*</span></label>
              <input
                type="text"
                name="company"
                required
                defaultValue={experienceToEdit?.company || ""}
                placeholder="ex: Google, Freelance"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Poste / rôle <span className="text-orange-600">*</span></label>
              <input
                type="text"
                name="role"
                required
                defaultValue={experienceToEdit?.role || ""}
                placeholder="ex: Full-Stack Developer"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Type de contrat & Localisation */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Type de contrat</label>
              <input
                type="text"
                name="contract_type"
                defaultValue={experienceToEdit?.contract_type || ""}
                placeholder="ex: CDI, Freelance, Temps partiel"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Lieu</label>
              <input
                type="text"
                name="location"
                defaultValue={experienceToEdit?.location || ""}
                placeholder="ex: Cotonou, Bénin (Remote)"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Date de début <span className="text-orange-600">*</span></label>
              <input
                type="date"
                name="start_date"
                required
                defaultValue={experienceToEdit?.start_date || ""}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Date de fin</label>
              <input
                type="date"
                name="end_date"
                disabled={isCurrentRole}
                defaultValue={experienceToEdit?.end_date || ""}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-neutral-400"
              />
            </div>
          </div>

          {/* Checkbox Poste actuel */}
          <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
            <input
              type="checkbox"
              id="is_current"
              checked={isCurrentRole}
              onChange={(e) => setIsCurrentRole(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="is_current" className="text-sm font-medium text-neutral-700">
              Poste actuel
              <span className="mt-0.5 block text-xs font-normal text-neutral-500">Aucune date de fin ne sera enregistrée.</span>
            </label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">Description / missions</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={experienceToEdit?.description || ""}
              placeholder="Détails des tâches et réalisations..."
              className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Logo URL & Ordre */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-700">URL du logo</label>
              <input
                type="url"
                name="logo_url"
                defaultValue={experienceToEdit?.logo_url || ""}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">Ordre</label>
              <input
                type="number"
                name="order"
                defaultValue={experienceToEdit?.order || 0}
                placeholder="0"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
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