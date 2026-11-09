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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Gestion du portfolio</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">
            Expériences
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Gère ton parcours professionnel et tes postes passés ou actuels.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle expérience</span>
        </button>
      </div>

      {/* Table CRUD */}
      <section aria-label="Liste des expériences" className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm">
        {initialExperiences && initialExperiences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th scope="col" className="px-5 py-4 text-[10px]">Entreprise &amp; poste</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Période</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Type / lieu</th>
                  <th scope="col" className="px-5 py-4 text-right text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {initialExperiences.map((exp) => (
                  <tr key={exp.id} className="transition-colors hover:bg-orange-50/30">
                    {/* Entreprise & Poste */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        {exp.logo_url ? (
                          <img
                            src={exp.logo_url}
                            alt={exp.company}
                            className="h-12 w-12 shrink-0 rounded-xl border border-black/[0.06] object-cover"
                          />
                        ) : (
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-orange-100 bg-orange-50 text-orange-700">
                            <Briefcase className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[#171717]">{exp.role}</p>
                          <p className="mt-0.5 text-sm font-medium text-orange-700">{exp.company}</p>
                          {exp.description && (
                            <p className="mt-1 line-clamp-1 max-w-xs text-xs text-neutral-500">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Période */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                        <span className="whitespace-nowrap">
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                        </span>
                      </div>
                      {!exp.end_date && (
                        <span className="mt-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                          En cours
                        </span>
                      )}
                    </td>

                    {/* Type / Lieu */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {exp.contract_type && (
                          <span className="inline-flex rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                            {exp.contract_type}
                          </span>
                        )}
                        {exp.location && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="rounded-lg p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(exp.id, exp.company)}
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
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Briefcase className="h-5 w-5" /></div>
            <p className="text-sm font-medium text-neutral-600">Aucune expérience enregistrée.</p>
            <p className="text-xs text-neutral-400">Ajoute une expérience pour présenter ton parcours.</p>
          </div>
        )}
      </section>

      {/* Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        experienceToEdit={selectedExperience}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}