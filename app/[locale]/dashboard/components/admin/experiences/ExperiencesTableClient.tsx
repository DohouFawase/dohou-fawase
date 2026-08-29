"use client";

import { useState } from "react";
import { Experience, ExperienceModal } from "./ExperienceModal";
import { Plus, Trash2, Edit2, Briefcase, Calendar, MapPin } from "lucide-react";
import { deleteExperienceAction } from "@/app/dashboard/experiences/actions";

interface ExperiencesTableClientProps {
  initialExperiences: Experience[];
}

export function ExperiencesTableClient({
  initialExperiences,
}: ExperiencesTableClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const handleOpenCreate = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, company: string) => {
    if (confirm(`Es-tu sûr de vouloir supprimer l'expérience chez "${company}" ?`)) {
      await deleteExperienceAction(id);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Présent";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Expériences
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gère ton parcours professionnel et tes postes passés ou actuels.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Expérience</span>
        </button>
      </div>

      {/* Table CRUD */}
      <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
        {initialExperiences && initialExperiences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Entreprise & Poste</th>
                  <th className="py-3.5 px-4">Période</th>
                  <th className="py-3.5 px-4">Type / Lieu</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialExperiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Entreprise & Poste */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {exp.logo_url ? (
                          <img
                            src={exp.logo_url}
                            alt={exp.company}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 text-gray-500">
                            <Briefcase className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-black text-sm">{exp.role}</p>
                          <p className="text-orange-600 font-semibold">{exp.company}</p>
                          {exp.description && (
                            <p className="text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Période */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                        </span>
                      </div>
                      {!exp.end_date && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-bold text-[10px]">
                          En cours
                        </span>
                      )}
                    </td>

                    {/* Type / Lieu */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {exp.contract_type && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 font-semibold rounded text-[10px]">
                            {exp.contract_type}
                          </span>
                        )}
                        {exp.location && (
                          <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(exp.id, exp.company)}
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
            <p className="text-gray-400 text-sm italic">
              Aucune expérience enregistrée.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        experienceToEdit={selectedExperience}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}