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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-black/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-black">
              {isEditing ? "Modifier l'expérience" : "Ajouter une expérience"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Entreprise & Poste */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Entreprise *</label>
              <input
                type="text"
                name="company"
                required
                defaultValue={experienceToEdit?.company || ""}
                placeholder="ex: Google, Freelance"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Poste / Rôle *</label>
              <input
                type="text"
                name="role"
                required
                defaultValue={experienceToEdit?.role || ""}
                placeholder="ex: Full-Stack Developer"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Type de contrat & Localisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Type de contrat</label>
              <input
                type="text"
                name="contract_type"
                defaultValue={experienceToEdit?.contract_type || ""}
                placeholder="ex: CDI, Freelance, Temps partiel"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Lieu</label>
              <input
                type="text"
                name="location"
                defaultValue={experienceToEdit?.location || ""}
                placeholder="ex: Cotonou, Bénin (Remote)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Date de début *</label>
              <input
                type="date"
                name="start_date"
                required
                defaultValue={experienceToEdit?.start_date || ""}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Date de fin</label>
              <input
                type="date"
                name="end_date"
                disabled={isCurrentRole}
                defaultValue={experienceToEdit?.end_date || ""}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          {/* Checkbox Poste actuel */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_current"
              checked={isCurrentRole}
              onChange={(e) => setIsCurrentRole(e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label htmlFor="is_current" className="text-xs font-semibold text-gray-700">
              Poste actuel (En cours)
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Description / Missions</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={experienceToEdit?.description || ""}
              placeholder="Détails des tâches et réalisations..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Logo URL & Ordre */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">URL du Logo</label>
              <input
                type="url"
                name="logo_url"
                defaultValue={experienceToEdit?.logo_url || ""}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Ordre</label>
              <input
                type="number"
                name="order"
                defaultValue={experienceToEdit?.order || 0}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
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