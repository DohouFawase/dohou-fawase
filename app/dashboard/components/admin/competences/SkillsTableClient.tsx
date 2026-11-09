"use client";

import { useState } from "react";
import { Skill, SkillModal } from "./SkillModal";
import { Plus, Trash2, Edit2, Wrench } from "lucide-react";
import { deleteSkillAction } from "@/app/dashboard/skills/actions";

interface SkillsTableClientProps {
  initialSkills: Skill[];
}

export function SkillsTableClient({ initialSkills }: SkillsTableClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleOpenCreate = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, category: string) => {
    if (confirm(`Es-tu sûr de vouloir supprimer la catégorie "${category}" ?`)) {
      await deleteSkillAction(id);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Gestion du portfolio</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">Compétences</h1>
          <p className="mt-2 text-sm text-neutral-500">Gère les stacks et compétences affichées sur ton portfolio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* Table CRUD */}
      <section aria-label="Liste des catégories de compétences" className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm">
        {initialSkills && initialSkills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th scope="col" className="px-5 py-4 text-[10px]">Ordre</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Catégorie</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Technologies</th>
                  <th scope="col" className="px-5 py-4 text-right text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {initialSkills.map((skill) => (
                  <tr key={skill.id} className="transition-colors hover:bg-orange-50/30">
                    {/* Ordre */}
                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-9 justify-center rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-neutral-500">
                        {skill.order || 0}
                      </span>
                    </td>

                    {/* Catégorie */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-orange-100 bg-orange-50 p-2 text-orange-700">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-[#171717]">{skill.category}</span>
                      </div>
                    </td>

                    {/* Technologies (Items) */}
                    <td className="px-5 py-4">
                      <div className="flex max-w-md flex-wrap gap-1.5">
                        {skill.items && skill.items.length > 0 ? (
                          skill.items.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="rounded-lg border border-orange-100 bg-orange-50/70 px-2.5 py-1 text-[11px] font-medium text-orange-800"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-400">Aucun élément</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Modifier */}
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="rounded-lg p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(skill.id, skill.category)}
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
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Wrench className="h-5 w-5" /></div>
            <p className="text-sm font-medium text-neutral-600">Aucune catégorie enregistrée.</p>
            <p className="text-xs text-neutral-400">Ajoute des compétences pour enrichir ton portfolio.</p>
          </div>
        )}
      </section>

      {/* Modal */}
      <SkillModal
        isOpen={isModalOpen}
        skillToEdit={selectedSkill}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}