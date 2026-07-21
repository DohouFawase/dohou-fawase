"use client";

import { useState } from "react";
import { X, Mail, Calendar, Send, Trash2, CheckCircle, Circle, Loader2, ArrowLeft } from "lucide-react";
import { deleteMessageAction, replyToMessageAction, toggleReadStatusAction } from "@/app/dashboard/messages/actions";

export interface Message {
  id: string;
  email: string;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface MessageDetailModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDetailModal({ message, isOpen, onClose }: MessageDetailModalProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  if (!isOpen || !message) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const handleStartReply = () => {
    setReplySubject(`Re: ${message.subject || "Votre message"}`);
    setReplyBody(`\n\n--- Message d'origine ---\nDe : ${message.email}\n${message.message}`);
    setIsReplying(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await replyToMessageAction(message.id, message.email, replySubject, replyBody);
      alert("Votre réponse a été envoyée avec succès !");
      setIsReplying(false);
      onClose();
    } catch (err) {
      alert("Une erreur s'est produite lors de l'envoi de l'email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleRead = async () => {
    await toggleReadStatusAction(message.id, message.is_read);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
      await deleteMessageAction(message.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-black/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-black line-clamp-1">
                {isReplying ? "Répondre au message" : message.subject || "Sans objet"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">{message.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps principal : Lecture ou Formulaire de Réponse */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {!isReplying ? (
            /* VUE LECTURE DE MESSAGE */
            <>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reçu le {formatDate(message.created_at)}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </div>
            </>
          ) : (
            /* FORMULAIRE DE RÉPONSE DIRECTE */
            <form id="reply-form" onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">À :</label>
                <input
                  type="text"
                  disabled
                  value={message.email}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Sujet *</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Message *</label>
                <textarea
                  required
                  rows={8}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Écrivez votre réponse ici..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>
            </form>
          )}
        </div>

        {/* Actions / Footer */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
          {!isReplying ? (
            <>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-200/60 rounded-lg transition-colors"
                >
                  {message.is_read ? (
                    <>
                      <Circle className="w-3.5 h-3.5 text-orange-500" />
                      <span>Non lu</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>Lu</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleStartReply}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Répondre</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>

              <button
                type="submit"
                form="reply-form"
                disabled={isSending}
                className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer le mail</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}