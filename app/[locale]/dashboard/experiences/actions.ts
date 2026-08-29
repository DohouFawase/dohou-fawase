"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createExperienceAction(formData: FormData) {
  const supabase = await createClient();

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") ? (formData.get("end_date") as string) : null;
  const contract_type = formData.get("contract_type") as string;
  const logo_url = formData.get("logo_url") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  const { error } = await supabase.from("experiences").insert({
    company,
    role,
    description,
    location,
    start_date,
    end_date,
    contract_type,
    logo_url,
    order,
  });

  if (error) {
    throw new Error(`Erreur lors de la création : ${error.message}`);
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/dashboard");
}

// 2. UPDATE
export async function updateExperienceAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") ? (formData.get("end_date") as string) : null;
  const contract_type = formData.get("contract_type") as string;
  const logo_url = formData.get("logo_url") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  const { error } = await supabase
    .from("experiences")
    .update({
      company,
      role,
      description,
      location,
      start_date,
      end_date,
      contract_type,
      logo_url,
      order,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour : ${error.message}`);
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/dashboard");
}

// 3. DELETE
export async function deleteExperienceAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Erreur lors de la suppression : ${error.message}`);
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/dashboard");
}