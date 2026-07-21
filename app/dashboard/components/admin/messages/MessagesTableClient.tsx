"use client";

import { useState } from "react";
import { Message, MessageDetailModal } from "./MessageDetailModal";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Messages</h1>
          <p className="text-xs text-gray-500 mt-1">
            Consulte et réponds aux messages envoyés depuis le formulaire de contact.
          </p>
        </div>
      </div>

      {/* Table CRUD */}
      <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
        {initialMessages && initialMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Statut</th>
                  <th className="py-3.5 px-4">Expéditeur</th>
                  <th className="py-3.5 px-4">Objet & Aperçu</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`cursor-pointer transition-colors ${
                      !msg.is_read
                        ? "bg-orange-50/30 hover:bg-orange-50/60 font-medium"
                        : "hover:bg-gray-50/50"
                    }`}
                  >
                    {/* Statut Lu/Non lu */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => handleToggleRead(e, msg.id, msg.is_read)}
                        className="p-1 rounded-md hover:bg-gray-200/50 text-gray-400 hover:text-black transition-colors"
                        title={msg.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                      >
                        {msg.is_read ? (
                          <MailOpen className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Mail className="w-4 h-4 text-orange-600 fill-orange-600/20" />
                        )}
                      </button>
                    </td>

                    {/* Expéditeur */}
                    <td className="py-4 px-4">
                      <div>
                        <p className={`text-sm ${!msg.is_read ? "font-bold text-black" : "text-gray-700"}`}>
                          {msg.email}
                        </p>
                      </div>
                    </td>

                    {/* Objet & Aperçu */}
                    <td className="py-4 px-4">
                      <div className="max-w-md">
                        <p className={`text-xs ${!msg.is_read ? "font-bold text-black" : "font-semibold text-gray-800"}`}>
                          {msg.subject || "Sans objet"}
                        </p>
                        <p className="text-gray-400 line-clamp-1 text-[11px] mt-0.5">
                          {msg.message}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Lire le message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDelete(e, msg.id)}
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
            <div className="p-3 bg-gray-50 text-gray-400 rounded-full w-fit mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-gray-400 text-sm italic">Aucun message reçu pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal d'affichage du message */}
      <MessageDetailModal
        isOpen={isModalOpen}
        message={selectedMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}