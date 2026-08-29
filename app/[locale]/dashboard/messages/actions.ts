"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Répondre directement au message par Email via Resend
export async function replyToMessageAction(
  messageId: string,
  recipientEmail: string,
  replySubject: string,
  replyBody: string
) {
  const supabase = await createClient();

  // Envoi de l'email via Resend API
 const { error: emailError } = await resend.emails.send({
   from: "Fawase <contact@dohou-fawase.vercel.app>",
  to: [recipientEmail], // Attention: Doit être l'adresse email de ton compte Resend pendant les tests
  subject: replySubject,
  text: replyBody,
});

  if (emailError) {
    throw new Error(`Erreur lors de l'envoi de l'email : ${emailError.message}`);
  }

  // Optionnel : Marquer automatiquement le message comme "lu" dans Supabase après la réponse
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId);

  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard");
}

// 2. Marquer comme Lu / Non lu
export async function toggleReadStatusAction(id: string, currentStatus: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: !currentStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Erreur lors du changement de statut : ${error.message}`);
  }

  revalidatePath("/admin/messages");
}

// 3. Supprimer un message
export async function deleteMessageAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Erreur lors de la suppression : ${error.message}`);
  }

  revalidatePath("/admin/messages");
}