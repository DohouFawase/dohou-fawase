"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const project_url = formData.get("project_url") as string;
  const github_url = formData.get("github_url") as string;
  const featured = formData.get("featured") === "on";

  const rawStack = formData.get("stack") as string;
  const stack = rawStack
    ? rawStack.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("projects").insert({
    title,
    description,
    image_url,
    project_url,
    github_url,
    featured,
    stack,
  });

  if (error) {
    throw new Error(`Erreur lors de la création : ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
}

// 2. UPDATE
export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const project_url = formData.get("project_url") as string;
  const github_url = formData.get("github_url") as string;
  const featured = formData.get("featured") === "on";

  const rawStack = formData.get("stack") as string;
  const stack = rawStack
    ? rawStack.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      description,
      image_url,
      project_url,
      github_url,
      featured,
      stack,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour : ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
}

// 3. DELETE
export async function deleteProjectAction(projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    throw new Error(`Erreur lors de la suppression : ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
}