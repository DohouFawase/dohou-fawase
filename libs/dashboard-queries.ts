import { createClient } from "@/utils/supabase/server";

// 1. Nombre total de téléchargements du CV
export async function getCVDownloadCount() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_stats")
    .select("value")
    .eq("key", "cv_downloads")
    .maybeSingle(); // <-- Utilise maybeSingle() au lieu de single()

  if (error) {
    console.error("Erreur getCVDownloadCount:", error);
    return 0;
  }

  // Si la ligne n'existe pas encore, data sera null et renverra 0 sans erreur
  return data?.value ?? 0;
}
// 2. Trafic des 30 derniers jours (pour les graphiques par date)
export async function getTraficStats() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from("page_views")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const viewsByDay: Record<string, number> = {};

  data?.forEach((row) => {
    const day = new Date(row.created_at).toISOString().split("T")[0];
    viewsByDay[day] = (viewsByDay[day] || 0) + 1;
  });

  return Object.entries(viewsByDay).map(([date, count]) => ({
    date,
    visites: count,
  }));
}

// 3. Nombre de messages non lus
export async function getUnreadMessagesCount() {
  const supabase = await createClient();

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return count || 0;
}

// 4. Projets les plus vus (Top 5)
export async function getTopProjects() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, views_count, image_url")
    .order("views_count", { ascending: false })
    .limit(5);

  return projects || [];
}

// 5. Total des vues globales sur le site
export async function getTotalViewsCount() {
  const supabase = await createClient();

  const { count } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  return count || 0;
}

// 6. Répartition du trafic PAR PAYS
export async function getTrafficByCountry() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_traffic_by_country");

  if (error) {
    console.error("Erreur récupération pays:", error);
    return [];
  }

  return data as { country: string; total: number }[];
}

// 7. Fonction d'incrémentation d'un projet (à appeler depuis un composant client)
export const handleViewProject = async (projectId: string) => {
  const { createClient: createClientWeb } = await import("@/utils/supabase/client");
  const supabase = createClientWeb();
  await supabase.rpc("increment_project_views", { project_id: projectId });
};