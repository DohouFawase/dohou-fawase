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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Compétences</h1>
          <p className="text-xs text-gray-500 mt-1">Gère les stacks et compétences affichées sur ton portfolio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Table CRUD */}
      <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
        {initialSkills && initialSkills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ordre</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Technologies / Items</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Ordre */}
                    <td className="py-4 px-4 font-bold text-gray-400">
                      #{skill.order || 0}
                    </td>

                    {/* Catégorie */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-md text-gray-700">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-black text-sm">{skill.category}</span>
                      </div>
                    </td>

                    {/* Technologies (Items) */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {skill.items && skill.items.length > 0 ? (
                          skill.items.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 font-semibold rounded-lg text-[11px]"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">Aucun item</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Modifier */}
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(skill.id, skill.category)}
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
            <p className="text-gray-400 text-sm italic">Aucune catégorie de compétences enregistrée.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <SkillModal
        isOpen={isModalOpen}
        skillToEdit={selectedSkill}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}