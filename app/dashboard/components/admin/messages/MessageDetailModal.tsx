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

export function getContactNameAndMessage(message: string) {
  let visibleMessage = message;
  const nameMatch = visibleMessage.match(/^\[contact-name\]\r?\n([^\r\n]{1,80})\r?\n\[\/contact-name\]\r?\n/);
  if (nameMatch) visibleMessage = visibleMessage.slice(nameMatch[0].length);
  const consentMatch = visibleMessage.match(/^\[auto-reply-consent\]\r?\ntrue\r?\n\[\/auto-reply-consent\]\r?\n/);
  if (consentMatch) visibleMessage = visibleMessage.slice(consentMatch[0].length);

  return {
    name: nameMatch?.[1] ?? null,
    receiptConsent: Boolean(consentMatch),
    message: visibleMessage.replace(/^\r?\n/, ""),
  };
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
  const contact = getContactNameAndMessage(message.message);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const handleStartReply = () => {
    const { message: originalMessage } = getContactNameAndMessage(message.message);
    setReplySubject(`Re: ${message.subject || "Votre message"}`);
    setReplyBody(`\n\n--- Message d'origine ---\nDe : ${message.email}\n${originalMessage}`);
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
    } catch {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="message-modal-title" className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-2xl">

        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-stone-50/70 px-6 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl border border-orange-100 bg-orange-50 p-2.5 text-orange-700">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-700">Boîte de réception</p>
              <h2 id="message-modal-title" className="mt-0.5 truncate text-base font-semibold text-[#171717]">
                {isReplying ? "Répondre au message" : message.subject || "Sans objet"}
              </h2>
              <p className="mt-0.5 truncate text-xs font-medium text-neutral-500">
                {contact.name ? `${contact.name} · ` : ""}{message.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 rounded-xl p-2 text-neutral-400 transition hover:bg-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps principal : Lecture ou Formulaire de Réponse */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6 sm:p-7">
          {!isReplying ? (
            /* VUE LECTURE DE MESSAGE */
            <>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <span>Reçu le {formatDate(message.created_at)}</span>
              </div>
              {contact.receiptConsent && (
                <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
                  La personne a accepté de recevoir un e-mail de confirmation de son message.
                </p>
              )}

              <div className="rounded-2xl border border-black/[0.06] bg-stone-50 p-5 text-sm leading-7 text-neutral-700 whitespace-pre-wrap">
                {contact.message}
              </div>
            </>
          ) : (
            /* FORMULAIRE DE RÉPONSE DIRECTE */
            <form id="reply-form" onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">À</label>
                <input
                  type="text"
                  disabled
                  value={message.email}
                  className="w-full rounded-xl border border-neutral-200 bg-stone-100 px-3.5 py-2.5 text-sm font-medium text-neutral-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">Sujet <span className="text-orange-600">*</span></label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">Message <span className="text-orange-600">*</span></label>
                <textarea
                  required
                  rows={8}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Écrivez votre réponse ici..."
                  className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm leading-6 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </form>
          )}
        </div>

        {/* Actions / Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-black/[0.06] bg-stone-50/70 p-4 sm:px-6">
          {!isReplying ? (
            <>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleRead}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-white hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
                  aria-label="Supprimer le message"
                  className="rounded-xl p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleStartReply}
                className="flex items-center gap-2 rounded-xl bg-[#171717] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>

              <button
                type="submit"
                form="reply-form"
                disabled={isSending}
                className="flex items-center gap-2 rounded-xl bg-[#171717] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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