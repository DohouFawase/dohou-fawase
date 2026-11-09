"use client";

import { useState } from "react";
import { getContactNameAndMessage, Message, MessageDetailModal } from "./MessageDetailModal";
import { Mail, MailOpen, Trash2, Eye, Calendar, Inbox } from "lucide-react";
import { deleteMessageAction, toggleReadStatusAction } from "@/app/dashboard/messages/actions";

interface MessagesTableClientProps {
  initialMessages: Message[];
}

export function MessagesTableClient({ initialMessages }: MessagesTableClientProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);

    // Marquer comme lu automatiquement à l'ouverture si pas encore lu
    if (!msg.is_read) {
      await toggleReadStatusAction(msg.id, false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Es-tu sûr de vouloir supprimer ce message ?")) {
      await deleteMessageAction(id);
    }
  };

  const handleToggleRead = async (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation();
    await toggleReadStatusAction(id, currentStatus);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Boîte de réception</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">Messages</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Consulte et réponds aux messages envoyés depuis le formulaire de contact.
          </p>
        </div>
      </div>

      {/* Table CRUD */}
      <section aria-label="Liste des messages" className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm">
        {initialMessages && initialMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th scope="col" className="w-16 px-5 py-4 text-center text-[10px]">Statut</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Expéditeur</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Objet &amp; aperçu</th>
                  <th scope="col" className="px-5 py-4 text-[10px]">Date</th>
                  <th scope="col" className="px-5 py-4 text-right text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {initialMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`cursor-pointer transition-colors ${
                      !msg.is_read
                        ? "bg-orange-50/40 hover:bg-orange-50/70"
                        : "hover:bg-stone-50/70"
                    }`}
                  >
                    {/* Statut Lu/Non lu */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={(e) => handleToggleRead(e, msg.id, msg.is_read)}
                        className="rounded-lg p-2 text-neutral-400 transition hover:bg-white hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        title={msg.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                        aria-label={msg.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                      >
                        {msg.is_read ? (
                          <MailOpen className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Mail className="w-4 h-4 text-orange-600 fill-orange-600/20" />
                        )}
                      </button>
                    </td>

                    {/* Expéditeur */}
                    <td className="px-5 py-4">
                      <div className="min-w-0">
                        <p className={`truncate ${!msg.is_read ? "font-semibold text-[#171717]" : "font-medium text-neutral-700"}`}>
                          {getContactNameAndMessage(msg.message).name || msg.email}
                        </p>
                        {getContactNameAndMessage(msg.message).name && (
                          <p className="mt-1 truncate text-xs text-neutral-400">{msg.email}</p>
                        )}
                      </div>
                    </td>

                    {/* Objet & Aperçu */}
                    <td className="px-5 py-4">
                      <div className="max-w-md">
                        <p className={`truncate text-sm ${!msg.is_read ? "font-semibold text-[#171717]" : "font-medium text-neutral-700"}`}>
                          {msg.subject || "Sans objet"}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
                          {getContactNameAndMessage(msg.message).message}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="rounded-lg p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          aria-label="Lire le message"
                          title="Lire le message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDelete(e, msg.id)}
                          className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          aria-label="Supprimer le message"
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
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-neutral-600">Aucun message reçu pour le moment.</p>
            <p className="text-xs text-neutral-400">Les nouveaux messages apparaîtront ici.</p>
          </div>
        )}
      </section>

      {/* Modal d'affichage du message */}
      <MessageDetailModal
        isOpen={isModalOpen}
        message={selectedMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}