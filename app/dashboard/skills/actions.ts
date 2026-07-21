"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createSkillAction(formData: FormData) {
  const supabase = await createClient();

  const category = formData.get("category") as string;
  const rawItems = formData.get("items") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  // Découpage du texte en tableau text[]
  const items = rawItems
    ? rawItems.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("skills").insert({
    category,
    items,
    order,
  });

  if (error) {
    throw new Error(`Erreur lors de la création : ${error.message}`);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/admin/dashboard");
}

// 2. UPDATE
export async function updateSkillAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const category = formData.get("category") as string;
  const rawItems = formData.get("items") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  const items = rawItems
    ? rawItems.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("skills")
    .update({
      category,
      items,
      order,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour : ${error.message}`);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/admin/dashboard");
}

// 3. DELETE
export async function deleteSkillAction(skillId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", skillId);

  if (error) {
    throw new Error(`Erreur lors de la suppression : ${error.message}`);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/admin/dashboard");
}